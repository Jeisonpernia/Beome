# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Extensin',
    'summary': 'Customer Portal',
    'sequence': '9001',
    'version': '12.0.37',
    'category': 'Hidden',
    'description': """ Portal Extension """,
    'depends': ['portal','auth_oauth','website_sale','l10n_au','sale_management'],
    'data': [
        'data/website_data.xml',
        'security/ir.model.access.csv',
        'views/portal_templates.xml',
       # 'views/webclient_template.xml',
        'views/assets.xml',
        'views/auth_oauth_templates.xml',
		'views/upgrade_templates.xml',
        'views/product_view.xml',
        'views/payment_template.xml',
    ],
    'qweb': [
    ],
}


