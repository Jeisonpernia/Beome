from odoo import fields,models,api
import datetime
import calendar
from datetime import timedelta


class Product_template(models.Model):
    _inherit = 'product.template'

    no_of_days = fields.Integer('No. of subscription Days')


class Product_product(models.Model):
    _inherit='product.product'
    
    
    no_of_days = fields.Integer('No. of subscription Days',related='product_tmpl_id.no_of_days')

    
class sale_order_history(models.Model):
    _name='transaction.history'
    _description = 'Transaction History'
    
    partner_id = fields.Many2one('res.partner','Partner Id')
    plan = fields.Many2one('product.product',string="Plan")
    sale_id = fields.Many2one('sale.order',string="Sale Order")
    # plan = fields.Char('Plan Type')
    days = fields.Integer('No of Days')
    amount= fields.Float('Amount')
    start_date = fields.Char('Start Date')
    end_date = fields.Char('End Date')
    payment_date= fields.Char('payment Date')


class ResPartner(models.Model):
    _inherit = 'res.partner'

    transaction_ids = fields.One2many('transaction.history','partner_id')
    
    
    
    
    
# class sale_order(models.Model):
#     _inherit='sale.order'
    
#     @api.model
#     def create(self,vals):
#         history_dict ={}
#         res = super(sale_order, self).create(vals)
#         if res.order_line[0].product_id.id == 1:
#             history_dict.update({'plan':'BASIC'})
#         if res.order_line[0].product_id.id ==2:
#             history_dict.update({'plan':'Advanced'})
#         if res.order_line[0].product_id.no_of_days:
#             history_dict.update({'days':30})
#         else:
#             history_dict.update({'days':20})
#         if res.amount_total:
#             history_dict.update({'amount':res.amount_total})
#         if res.date_order:
#             history_dict.update({'start_date':'12/05/1989'})
#             history_dict.update({'end_date':'12/05/1989'})
#             history_dict.update({'payment_date':'12/05/1989'})
#         self.env['sale.order.history'].create(history_dict)
#         return res
         
    # @api.multi
    # def get_sale_history(self,partner_id):
    #     orders = self.search([('partner_id','=',partner_id.id)])
    #     order_list=[]
    #     for order in orders:
    #         history_dict={}
    #         order_lines = self.env['sale.order.line'].search([('order_id','=',order.id)])
    #         for order_line in order_lines:
    #             product_id = self.env['product.product'].search([('name', '=', 'Basic Plan')], limit=1)
    #             if product_id:
    #                 if order_line.product_id.id == product_id.id:
    #                     print('Product Name : ',product_id.name)
    #                     history_dict.update({'plan':'BASIC'})
    #                     if order_line.product_id.no_of_days:
    #                         history_dict.update({'days':str(order_line.product_id.no_of_days)})
    #                     if order_line.price_total:
    #                         history_dict.update({'amount': str(order_line.price_total)})
    #                     if order.date_order:
    #                         order_date = datetime.datetime.strftime(order.date_order, '%d-%m-%Y')
    #                         print('Order date : ',order_date)
    #
    #                         end_date = order.date_order + timedelta(days=order_line.product_id.no_of_days)
    #                         end_date = datetime.datetime.strftime(end_date, '%d-%m-%Y')
    #                         print("End date : ",end_date)
    #
    #                         history_dict.update({'start_date':order_date})
    #                         history_dict.update({'end_date':end_date})
    #                         history_dict.update({'payment_date':order_date})
    #         order_list.append(history_dict)
    #     return order_list
                     
                    
                    
                    
        
        
                    
            
            