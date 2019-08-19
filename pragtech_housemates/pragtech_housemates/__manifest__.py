# -*- encoding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Housemates',
    'category': 'Website',
    'summary': '',
    'website': '',
    'version': '12.0.30',
    'description': "",
    'depends': [
                'website','website_blog','base','auth_oauth','auth_signup', 'pragtech_website_extension','partner_firstname','login_user_detail'
                ],
    'installable': True,
    'data': [
        'security/ir.model.access.csv',

        'data/website_data.xml',
        'data/configuration_data.xml',

        'views/assets.xml',
        'views/remove_footer.xml',
        'views/flatmates_view.xml',
        'views/config_master_view.xml',
        'views/website_blog_view.xml',
        'views/res_user.xml',
        'views/email_template.xml',
        'views/res_config_settings_views.xml',
        'views/product_view.xml',
        'views/messages_history_view.xml',
        'static/src/xml/menu_item.xml',
        'static/src/xml/home_view.xml',
        'static/src/xml/message_template.xml',
        'static/src/xml/shortlist_template.xml',
        'static/src/xml/list_place_template.xml',
        'static/src/xml/custom_header_template.xml',
        'static/src/xml/find_place_template.xml',
        'static/src/xml/about_template.xml',
        'static/src/xml/property_detail.xml',
        'static/src/xml/website_blog_template.xml',
        'static/src/xml/find_place_preview.xml',
        'static/src/xml/list_place_preview.xml',

        'static/src/static_webpages/info_breadcrumb.xml',
        'static/src/static_webpages/info_li_list.xml',
        'static/src/static_webpages/info_template.xml',
        'static/src/static_webpages/info_flatmate_inspection.xml',
        'static/src/static_webpages/info_how_to_contact.xml',
        'static/src/static_webpages/info_home_share_melbourne.xml',
        'static/src/static_webpages/info_message_response_rate.xml',
        'static/src/static_webpages/info_verification.xml',
        'static/src/static_webpages/info_frequently_asked_questions.xml',
        'static/src/static_webpages/info_why_upgrade.xml',
        'static/src/static_webpages/info_how_does_it_work.xml',
        'static/src/static_webpages/info_find_share_accommodation.xml',
        'static/src/static_webpages/info_rent_your_spare_room.xml',
        'static/src/static_webpages/info_teamups.xml',
        'static/src/static_webpages/info_value_my_room.xml',
        'static/src/static_webpages/info_legal_introduction.xml',
        'static/src/static_webpages/info_holding_deposits.xml',
        'static/src/static_webpages/info_share_accommodation_legal_situations.xml',
        'static/src/static_webpages/info_planning_rules.xml',
        'static/src/static_webpages/info_pre_agreement_checklist.xml',
        'static/src/static_webpages/info_flatmate_agreement.xml',
        'static/src/static_webpages/info_bonds.xml',
        'static/src/static_webpages/info_condition_reports.xml',
        'static/src/static_webpages/info_tenancy_agreements.xml',
        'static/src/static_webpages/info_rent_payments.xml',
        'static/src/static_webpages/info_rights_obligations.xml',
        'static/src/static_webpages/info_ending_tenancy.xml',
        'static/src/static_webpages/info_resolving_disputes.xml',
        'static/src/static_webpages/info_about.xml',
        'static/src/static_webpages/info_terms.xml',
        'static/src/static_webpages/info_live_rent_free.xml',
        'static/src/static_webpages/info_press.xml',
        'static/src/static_webpages/info_community_charter.xml',
        'static/src/static_webpages/info_privacy.xml',
        'static/src/static_webpages/info_contact.xml',
    ],
    'application': True,
}
