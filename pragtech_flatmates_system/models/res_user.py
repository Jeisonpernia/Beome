from odoo import api, fields, models, _


class ResUser(models.Model):
    _inherit='res.users'

    listing_alerts = fields.Selection([('real_time','Real Time'),('daily','Daily'),('none','None')], string="Listing Alerts")
    new_device_alerts = fields.Boolean(string="New Device alerts")
    message_alerts = fields.Boolean(string="Message alerts")
    community_notices = fields.Boolean(string="Community notices")
    special_offers = fields.Boolean(string="Special offers")
    deactivate_account=fields.Boolean(string="Deactivate Account")