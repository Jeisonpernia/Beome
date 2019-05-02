# -*- encoding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Website',
    'category': 'Website',
    'summary': '',
    'website': '',
    'version': '12.0',
    'description': "",
    'depends': [
                'website',
                'pragtech_create_static_webpages',
                ],
    'installable': True,
    'data': [
        'security/ir.model.access.csv',

        'data/website_data.xml',

        'views/assets.xml',
        'views/remove_footer.xml',
        'views/flatmates_view.xml',
        'views/config_master_view.xml',

        'static/src/xml/menu_item.xml',
        'static/src/xml/home_view.xml',
        'static/src/xml/shortlist_template.xml',
        'static/src/xml/list_place_template.xml',
        'static/src/xml/find_place_template.xml',
        'static/src/xml/about_template.xml',
        'static/src/xml/property_detail.xml',
        'static/src/xml/info_template.xml',
        'static/src/xml/contact_template.xml',
        'static/src/xml/live_rent_free_template.xml',
    ],
    'application': True,
    'uninstall_hook': 'uninstall_hook',
}
