from odoo import api, fields, models, _
from odoo.exceptions import UserError
from odoo.addons.auth_signup.models.res_partner import SignupError, now
import base64
import requests

import logging

_logger = logging.getLogger(__name__)


class ResUser(models.Model):
    _inherit='res.users'

    listing_alerts = fields.Selection([('real_time','Real Time'),('daily','Daily'),('none','None')], string="Listing Alerts")
    new_device_alerts = fields.Boolean(string="New Device alerts")
    message_alerts = fields.Boolean(string="Message alerts")
    community_notices = fields.Boolean(string="Community notices")
    special_offers = fields.Boolean(string="Special offers")
    deactivate_account=fields.Boolean(string="Deactivate Account")
    house_mates_ids = fields.Many2many('house.mates')

    last_logged_ip = fields.Char(string='IP')
    last_logged_browser = fields.Char(string='Browser')
    last_logged_os = fields.Char(string='OS')

    @api.multi
    def send_account_verify_email(self):
        """ create account verification token for each user, and send their account verify url by email """
        # prepare reset password signup
        create_mode = bool(self.env.context.get('create_user'))

        # no time limit for initial invitation, only for reset password
        expiration = False if create_mode else now(days=+1)

        self.mapped('partner_id').verify_prepare(expiration=expiration)
        # send email to users with their signup url
        template = self.env.ref('pragtech_flatmates_system.mail_verify_account')
        assert template._name == 'mail.template'

        template_values = {
            #             'email_to': '${object.email|safe}',
            'email_cc': False,
            'auto_delete': True,
            'partner_to': False,
            'scheduled_date': False,
        }
        template.write(template_values)
        #         try:

        for user in self:
            if not user.email:
                raise UserError(_("Cannot send email: user %s has no email address.") % user.name)
            with self.env.cr.savepoint():
                template.with_context(lang=user.lang).send_mail(user.id, force_send=True, raise_exception=True)
            _logger.info("Password reset email sent for user <%s> to <%s>", user.login, user.email)
#         except Exception as e:
#                 print  ("\n\nFailed to insert record<br/>\n" + str(e))

    # @api.multi
    # def write(self,vals):
    #     print("\n\n--------------users write-----------",vals)
    #     return super(ResUser,self).write(vals)


    #Inherited to set User's Profile picture gets from Facebook
    @api.model
    def _generate_signup_values(self, provider, validation, params):

        image = None
        if validation.get('picture'):
            image_url = validation['picture']['data']['url']
            image_data = self._get_image_data(image_url)

            if image_data:
                image = base64.b64encode(image_data)


        oauth_uid = validation['user_id']
        email = validation.get('email', 'provider_%s_user_%s' % (provider, oauth_uid))
        name = validation.get('name', email)
        dict1= {
            'name': name,
            'login': email,
            'email': email,
            'oauth_provider_id': provider,
            'oauth_uid': oauth_uid,
            'oauth_access_token': params['access_token'],
            'active': True,
        }

        if image:
            dict1.update({'image':image})

        return dict1

    def _get_image_data(self, image_url):

        image_content = None

        resp = requests.get(image_url)

        if resp.status_code == 200:
            image_content = resp.content

        if image_content:
            return image_content

