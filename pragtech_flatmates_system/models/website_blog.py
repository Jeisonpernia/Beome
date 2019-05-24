from odoo import api, fields, models, _
from odoo.exceptions import UserError
import logging
_logger = logging.getLogger(__name__)

class BlogPostInherit(models.Model):
    _inherit = 'blog.post'

    # Override for set defualt blog as "Our Blog"
    @api.model
    def default_get(self, fields):
        res = super(BlogPostInherit, self).default_get(fields)
        # print('\n\nRES :: ',res,'\n\n\n')
        # print('\n\nContext :: ', self._context, '\n\n\n')
        res['blog_id'] = 1
        return res

    @api.multi
    def write(self, vals):
        if 'is_published' in vals and vals['is_published'] == True:
            self.send_listing_alert_email()

        return super(BlogPostInherit, self).write(vals)

    @api.multi
    def send_listing_alert_email(self):

        template = self.env.ref('pragtech_flatmates_system.blog_community_notices_alert')
        assert template._name == 'mail.template'

        template_values = {
            'email_cc': False,
            'auto_delete': True,
            'partner_to': False,
            'scheduled_date': False,
        }

        template.write(template_values)
        user_id = self.env['res.users'].sudo().search([('community_notices', '=', True)])
        for user in user_id:
            if not user.email:
                raise UserError(_("Cannot send email: user %s has no email address.") % user.name)
            with self.env.cr.savepoint():
                template.with_context(lang=user.lang).send_mail(user.id, force_send=True, raise_exception=True)
            _logger.info("Password reset email sent for user <%s> to <%s>", user.login, user.email)
