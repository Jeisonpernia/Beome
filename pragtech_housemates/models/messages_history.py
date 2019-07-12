# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import UserError
import logging

_logger = logging.getLogger(__name__)




class MessagesHistory(models.Model):
    _name = 'messages.history'
    _description = 'Messaging History'
    _rec_name = 'msg_from'

    msg_from = fields.Many2one("res.users",string="From")
    msg_to = fields.Many2one("res.users",string="To")
    message = fields.Text(string="Message")
    msg_time = fields.Datetime("Time")
    property_id = fields.Many2one("house.mates",string="Property")


