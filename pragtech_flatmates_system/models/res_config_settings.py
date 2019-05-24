from odoo import fields, models,api
from ast import literal_eval

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    sms_user_name = fields.Char(string='User Name',)
    sms_user_password = fields.Char(string='Password',)

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        ICPSudo = self.env['ir.config_parameter'].sudo()
        sms_user_name = ICPSudo.get_param('pragtech_flatmates_system.sms_user_name')
        sms_user_password = ICPSudo.get_param('pragtech_flatmates_system.sms_user_password')

        res.update(
            sms_user_name = sms_user_name,
            sms_user_password = sms_user_password,
        )
        return res

    @api.multi
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        ICPSudo = self.env['ir.config_parameter'].sudo()
        ICPSudo.set_param("pragtech_flatmates_system.sms_user_name", self.sms_user_name)
        ICPSudo.set_param("pragtech_flatmates_system.sms_user_password", self.sms_user_password)