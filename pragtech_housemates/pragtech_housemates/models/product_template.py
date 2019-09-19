from odoo import fields,models,api

class Product_template(models.Model):
    _inherit = 'product.template'

    feature_ids = fields.Many2many('plan.feature', string="Features")


class Product_product(models.Model):
    _inherit='product.product'
    
    feature_ids = fields.Many2many('plan.feature', string="Features",related='product_tmpl_id.feature_ids')
