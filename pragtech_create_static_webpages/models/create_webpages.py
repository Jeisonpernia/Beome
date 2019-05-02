from odoo import models,fields, _

class Webpage_Extension(models.Model):
    _name = 'webpage.extension'
    _description = 'Create Static Webpages'

    name = fields.Char('Heading')
    description = fields.Html('Description')
    state = fields.Selection([('active','Active'),('inactive','Inactive')],'State', default='inactive')
    type_of_webpage = fields.Selection([('how_to_guides', 'How to guides'), ('latest_articles', 'Latest articles'), ('legal_guides', 'Legal guides'), ('social', 'Social'), ('about', 'About Flatmates.com.au') , ('our_friends', 'Our friends')], 'Webpage Category')
    type = fields.Selection([('is_template', 'Is a template'), ('is_link', 'Is a link')], 'Webpage Type', default='is_template')
    target = fields.Selection([('_self', 'Self'), ('_blank', 'New')], 'Target')
    href = fields.Char('Link')