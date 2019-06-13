# -*- coding: utf-8 -*-
from odoo import http
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.http import request
import json

from odoo.addons.payment.controllers.portal import PaymentProcessing
import datetime
from datetime import timedelta

class WebsiteSale(WebsiteSale):


    @http.route(['/make_payment1'], type='http', auth="public", website=True)
    def make_payment(self,**post):
        print('2222222222222222222222')
        product_id = request.env['product.product'].search([('name', '=', 'Basic Plan')], limit=1)
        if True :
                request.website.sale_get_order(force_create=1)._cart_update(
                product_id=product_id.id,
                add_qty=1,
                set_qty=1,
                )
        return request.redirect("/shop/payment")
    
    @http.route(['/make_payment2'], type='http', auth="public", website=True)
    def make_payment1(self,**post):     
        if True :
            request.website.sale_get_order(force_create=1)._cart_update(
            product_id=2,
            add_qty=1,
            set_qty=1,
            )
        return request.redirect("/shop/payment")

    @http.route(['/get_history'], type='json', auth="public", website=True)
    def get_history(self, **post):
        data = {}

        partner = request.env.user.partner_id
        print('Parnter :: ',partner)
        if partner:
            history_list = []
            for transaction in partner.transaction_ids:
                transaction_dict = {
                    'plan':transaction.plan.name,
                    'amount':transaction.amount,
                    'days':transaction.days,
                    'start_date':transaction.start_date,
                    'end_date':transaction.end_date,
                    'payment_date':transaction.payment_date
                }

                history_list.append(transaction_dict)

        if history_list:
            data = {
                'transaction_history': history_list,
            }

        return data

    @http.route(['/get_product_plan'], type='json', auth="public", website=True)
    def get_product_plan(self, **post):
        data = {}

        product = request.env['product.product'].search([('name','=','Basic Plan')])
        print('Product : ',product)
        if product:
            data.update({
                'name':product.name,
                'amount':product.list_price,
                'no_of_days':product.no_of_days
            })
        return data


    @http.route(['/shop/confirmation'], type='http', auth="public", website=True)
    def payment_confirmation(self, **post):

        """ End of checkout process controllers. Confirmation is basically seing
        the status of a sale.order. State at this point :

         - should not have any context / session info: clean them
         - take a sale.order id, because we request a sale.order and are not
           session dependant anymore
        """
        sale_order_id = request.session.get('sale_last_order_id')
        if sale_order_id:
            order = request.env['sale.order'].sudo().browse(sale_order_id)
            return request.render("website_sale.confirmation", {'order': order})
        else:
            return request.redirect('/')

    @http.route('/shop/payment/validate', type='http', auth="public", website=True)
    def payment_validate(self, transaction_id=None, sale_order_id=None, **post):
        """ Method that should be called by the server when receiving an update
        for a transaction. State at this point :

         - UDPATE ME
        """
        if sale_order_id is None:
            order = request.website.sale_get_order()
        else:
            order = request.env['sale.order'].sudo().browse(sale_order_id)
            assert order.id == request.session.get('sale_last_order_id')

        if transaction_id:
            tx = request.env['payment.transaction'].sudo().browse(transaction_id)
            assert tx in order.transaction_ids()
        elif order:
            tx = order.get_portal_last_transaction()
        else:
            tx = None

        if not order or (order.amount_total and not tx):
            return request.redirect('/shop')

        #added by sagar
        if order:
            values = {
                'sale_id':order.id,
            }
            for line in order.order_line:
                order_date = datetime.datetime.strftime(order.date_order, '%d-%m-%Y')
                end_date = order.date_order + timedelta(days=line.product_id.no_of_days)
                end_date = datetime.datetime.strftime(end_date, '%d-%m-%Y')

                values.update({
                    'plan':line.product_id.id,
                    'days':line.product_id.no_of_days,
                    'amount':line.price_total,
                    'start_date':order_date,
                    'end_date':end_date,
                    'payment_date':order_date,
                    'partner_id':order.partner_id.id
                })
            if values:
                new_transaction_history_id = request.env['transaction.history'].sudo().create(values)

        ################

        # clean context and session, then redirect to the confirmation page
        request.website.sale_reset()
        if tx and tx.state == 'draft':
            return request.redirect('/shop')

        PaymentProcessing.remove_payment_transaction(tx)
        return request.redirect('/shop/confirmation')