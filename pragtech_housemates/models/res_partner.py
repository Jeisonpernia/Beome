from odoo import api, fields, models, _
from odoo import api, exceptions, fields, models, _
from datetime import datetime, timedelta
from odoo.exceptions import UserError, RedirectWarning, ValidationError
import random
import werkzeug.urls


def now(**kwargs):
    dt = datetime.now() + timedelta(**kwargs)
    return fields.Datetime.to_string(dt)
def random_token():
    # the token has an entropy of about 120 bits (6 bits/char * 20 chars)
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return ''.join(random.SystemRandom().choice(chars) for _ in range(20))

class ResPartner(models.Model):
    _inherit = 'res.partner'

    gender = fields.Selection([('male', 'Male'), ('Female', 'female')], string='Gender')

    verify_token = fields.Char(copy=False, groups="base.group_erp_manager")
    verify_expiration = fields.Datetime(copy=False, groups="base.group_erp_manager")
    verify_valid = fields.Boolean(compute='_compute_verify_valid', string='Verify Token is Valid')
    verify_url = fields.Char(compute='_compute_verify_url', string='Verify Account URL')
    first_login = fields.Boolean(string='Is First Login')
    mobile_no_is_verified = fields.Boolean(string='Is Verified Mobile Number')
    allowed_to_contact = fields.Boolean(string="Allowed to Contact")

    @api.model
    def create(self, vals):
        country_id = self.env['res.country'].sudo().search([('code', '=', 'AU')], limit=1)
        if country_id:
            vals['country_id'] = country_id.id

        return super(ResPartner, self).create(vals)

    @api.multi
    @api.depends('verify_token', 'verify_expiration')
    def _compute_verify_valid(self):
        dt = now()
        for partner in self.sudo():
            partner.verify_valid = bool(partner.verify_token) and \
                                   (not partner.verify_expiration or dt <= partner.verify_expiration)

    @api.multi
    def _compute_verify_url(self):
        """ proxy for function field towards actual implementation """

        result = self.sudo()._get_verify_url_for_action()
        for partner in self:
            if any(u.has_group('base.group_user') for u in partner.user_ids if u != self.env.user):
                self.env['res.users'].check_access_rights('write')
            partner.verify_url = result.get(partner.id, False)

    @api.multi
    def _get_verify_url_for_action(self, action=None, view_type=None, menu_id=None, res_id=None, model=None):
        """ generate a signup url for the given partner ids and action, possibly overriding
            the url state components (menu_id, id, view_type) """

        res = dict.fromkeys(self.ids, False)
        base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')
        for partner in self:
            # when required, make sure the partner has a valid signup token
            if self.env.context.get('signup_valid') and not partner.user_ids:
                partner.verify_prepare()

            route = 'login'
            # the parameters to encode for the query
            query = dict(db=self.env.cr.dbname)
            #             signup_type = self.env.context.get('signup_force_type_in_url', partner.signup_type or '')
            #             if signup_type:
            #                 route = 'reset_password' if signup_type == 'reset' else signup_type

            if partner.verify_token:
                query['verify_token'] = partner.verify_token
            elif partner.user_ids:
                query['login'] = partner.user_ids[0].login
            else:
                continue  # no signup token, no user, thus no signup url!

            fragment = dict()
            base = '/web#'
            if action == '/mail/view':
                base = '/mail/view?'
            elif action:
                fragment['action'] = action
            if view_type:
                fragment['view_type'] = view_type
            if menu_id:
                fragment['menu_id'] = menu_id
            if model:
                fragment['model'] = model
            if res_id:
                fragment['res_id'] = res_id

            if fragment:
                query['redirect'] = base + werkzeug.urls.url_encode(fragment)

            res[partner.id] = werkzeug.urls.url_join(base_url, "/web/%s?%s" % (route, werkzeug.urls.url_encode(query)))
        return res

    @api.multi
    def verify_prepare(self, expiration=False):
        """ generate a new token for the partners with the given validity, if necessary
            :param expiration: the expiration datetime of the token (string, optional)
        """

        for partner in self:
            if expiration or not partner.verify_valid:
                token = random_token()
                while self._verify_retrieve_partner(token):
                    token = random_token()
                partner.write({'verify_token': token, 'verify_expiration': expiration})
        return True

    @api.model
    def _verify_retrieve_partner(self, token, check_validity=False, raise_exception=False):
        """ find the partner corresponding to a token, and possibly check its validity
            :param token: the token to resolve
            :param check_validity: if True, also check validity
            :param raise_exception: if True, raise exception instead of returning False
            :return: partner (browse record) or False (if raise_exception is False)
        """

        partner = self.search([('verify_token', '=', token)], limit=1)
        if not partner:
            if raise_exception:
                raise exceptions.UserError(_("Signup token '%s' is not valid") % token)
            return False
        partner = self.search([('signup_token', '=', token)], limit=1)
        if not partner:
            if raise_exception:
                raise exceptions.UserError(_("Signup token '%s' is not valid") % token)
            return False
        if check_validity and not partner.verify_valid:
            if raise_exception:
                raise exceptions.UserError(_("Signup token '%s' is no longer valid") % token)
            return False
        return partner
