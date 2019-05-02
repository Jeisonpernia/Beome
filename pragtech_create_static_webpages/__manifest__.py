# -*- encoding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Create Webpages Extension',
    'category': '',
    'summary': '',
    'website': '',
    'version': '12.0',
    'description': "",
    'depends': [],
    'installable': True,
    'data': [ 'security/ir.model.access.csv',
    'views/create_webpages_view.xml',
    ],
    'application': True,
    'uninstall_hook': 'uninstall_hook',
}
