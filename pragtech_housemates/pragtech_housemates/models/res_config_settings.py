from odoo import fields, models,api
from ast import literal_eval

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    sms_user_name = fields.Char(string='User Name',)
    sms_user_password = fields.Char(string='Password',)

    facebook_client_id = fields.Char(string='Facebook Client ID',)
    facebook_client_secret = fields.Char(string='Facebook Client Secret', )

    linkedin_client_id = fields.Char(string='Linkedin Client ID', )
    linkedin_client_secret = fields.Char(string='Linkedin Client Secret', )

    insta_client_id = fields.Char(string='Insta Client ID', )
    insta_client_secret = fields.Char(string='Insta Client Secret', )


    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        ICPSudo = self.env['ir.config_parameter'].sudo()
        sms_user_name = ICPSudo.get_param('pragtech_housemates.sms_user_name')
        sms_user_password = ICPSudo.get_param('pragtech_housemates.sms_user_password')
        facebook_client_id = ICPSudo.get_param('pragtech_housemates.facebook_client_id')
        facebook_client_secret = ICPSudo.get_param('pragtech_housemates.facebook_client_secret')
        linkedin_client_id = ICPSudo.get_param('pragtech_housemates.linkedin_client_id')
        linkedin_client_secret = ICPSudo.get_param('pragtech_housemates.linkedin_client_secret')
        insta_client_id = ICPSudo.get_param('pragtech_housemates.insta_client_id')
        insta_client_secret = ICPSudo.get_param('pragtech_housemates.insta_client_secret')


        res.update(
            sms_user_name = sms_user_name,
            sms_user_password = sms_user_password,
            facebook_client_id = facebook_client_id,
            facebook_client_secret = facebook_client_secret,
            linkedin_client_id = linkedin_client_id,
            linkedin_client_secret = linkedin_client_secret,
            insta_client_id = insta_client_id,
            insta_client_secret = insta_client_secret,
        )
        return res

    @api.multi
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        ICPSudo = self.env['ir.config_parameter'].sudo()
        ICPSudo.set_param("pragtech_housemates.sms_user_name", self.sms_user_name)
        ICPSudo.set_param("pragtech_housemates.sms_user_password", self.sms_user_password)
        ICPSudo.set_param("pragtech_housemates.facebook_client_id", self.facebook_client_id)
        ICPSudo.set_param("pragtech_housemates.facebook_client_secret", self.facebook_client_secret)
        ICPSudo.set_param("pragtech_housemates.linkedin_client_id", self.linkedin_client_id)
        ICPSudo.set_param("pragtech_housemates.linkedin_client_secret", self.linkedin_client_secret)
        ICPSudo.set_param("pragtech_housemates.insta_client_id", self.insta_client_id)
        ICPSudo.set_param("pragtech_housemates.insta_client_secret", self.insta_client_secret)