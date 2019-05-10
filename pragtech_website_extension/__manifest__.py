# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Extensin',
    'summary': 'Customer Portal',
    'sequence': '9001',
    'version': '12.0.1',
    'category': 'Hidden',
    'description': """ Portal Extension """,
    'depends': ['portal','auth_oauth'],
    'data': [
        'views/portal_templates.xml',
       # 'views/webclient_template.xml',
        'views/assets.xml',
        # 'views/auth_oauth_templates.xml'
    ],
    'qweb': [
    ],
}
