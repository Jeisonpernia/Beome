import json
import io
import base64
import logging
import werkzeug
from io import StringIO, BytesIO
from werkzeug.utils import redirect
from datetime import date, datetime, timedelta
from odoo.exceptions import AccessError, UserError,ValidationError
from odoo.addons.auth_signup.models.res_users import SignupError
from odoo.addons.web.controllers.main import ensure_db, Home
import ast
import pytz
from odoo.tools import ustr
from dateutil import relativedelta
try:
    import httpagentparser
except ImportError:
    pass
from time import gmtime, strftime

import odoo
import requests
from odoo.http import request
from odoo import http, tools, _
from odoo.addons.web.controllers.main import Home
from odoo.addons.website.controllers.main import Website
from odoo.addons.website_blog.controllers.main import WebsiteBlog
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.http_routing.models.ir_http import slug, unslug
from odoo import http, fields
from odoo.addons.auth_signup.controllers.main import AuthSignupHome
from odoo.modules.module import get_module_resource
import pyotp
import json
import re
# from __future__ import print_function
import clicksend_client
from clicksend_client import SmsMessage
from clicksend_client.rest import ApiException
from datetime import date

_logger = logging.getLogger(__name__)

suburb_json_file_path = get_module_resource('pragtech_housemates', 'models', 'suburb.json')
with open(suburb_json_file_path) as json_file:
    suburb_data = json.load(json_file)

shortlist_data={}
class AuthSignupHomeChild(AuthSignupHome):
    def do_signup(self, qcontext):
        """ Shared helper that creates a res.partner out of a token """
        values = {key: qcontext.get(key) for key in ('login', 'name', 'password', 'unique_code')}
        if not values:
            raise UserError(_("The form was not properly filled in."))
        if values.get('password') != qcontext.get('confirm_password'):
            raise UserError(_("Passwords do not match; please retype them."))
        supported_langs = [lang['code'] for lang in request.env['res.lang'].sudo().search_read([], ['code'])]
        if request.lang in supported_langs:
            values['lang'] = request.lang
        values.update({'unique_id': qcontext.get('unique_code')})
        self._signup_with_values(qcontext.get('token'), values)
        request.env.cr.commit()

    @http.route()
    def web_login(self, *args, **kw):
        values = request.params.copy()
        ensure_db()

        response = super(AuthSignupHomeChild, self).web_login(*args, **kw)

        # if request.httprequest.method == 'POST':
        #     print("+++++++++++++=reponse-=-=-=-=-=-=-=-=-=-", response.uid)
        #     old_uid = request.uid
        #     uid = request.session.authenticate(request.session.db, request.params['login'], request.params['password'])
        #     if uid is not False:
        #         request.params['login_success'] = True
        #         return http.redirect_with_hash(self._login_redirect(uid, redirect=None))
        #     request.uid = old_uid
        #     response.qcontext['error'] = _("Wrong login/password or your account is not active account.Please check")

        context = request.env.context

        qcontext = self.get_auth_signup_qcontext()


        if kw.get('verify_token', False):
            verify_token = kw.get('verify_token', False)
            partner = request.env['res.partner'].sudo().search([('verify_token', '=', verify_token)], limit=1)
            if partner:

                user = request.env['res.users'].sudo().search([('partner_id', '=', partner.id), ('active', '=', False)],
                                                       limit=1)

                if user:

                    user.active = True

                    response.qcontext['message'] = _("Your Account has been validated Successfully.")
                else:
                    response.qcontext['message'] = _("Your Account is already verified ")
                if request.env.user.id != 4:

                    response.qcontext['message'] = "Your active session has expired. " + response.qcontext['message']
                    request.session.logout(keep_db=True)
                    return werkzeug.utils.redirect('/web/login?message=Your active session has expired. Please Login',
                                                   303)


                # response= request.render('web.login', values)
        if kw.get('redirect', False):
            if kw.get('redirect') == '/account_confirmation_message':
                response.qcontext['message'] = _(
                    "Verification link has been sent to your registered email ID. Please click on 'Confirm My Account' for account verification\n\n\nئیمهیڵێک ناردرا بۆ ئیمهڵهکهت، تکایه کلیک لهسهر دوگمهی'Verify Account' بکه لهناو ئیمهڵهکه")
                # response = request.render('web.login', values)
        # uid = request.session.authenticate(request.session.db, request.params['login'], request.params['password'])
        # if uid is not False:



        return response

    @http.route('/web/signup', type='http', auth='public', website=True, sitemap=False,)
    def web_auth_signup(self, *args, **kw):
        res = super(AuthSignupHomeChild, self).web_auth_signup(*args,**kw)
        qcontext = self.get_auth_signup_qcontext()

        user_sudo = request.env['res.users'].sudo().search([('login', '=', qcontext.get('login'))])

        if user_sudo:
            mail_server_obj = request.env['ir.mail_server'].sudo().search([])
            if mail_server_obj:
                user_sudo.with_context(create_user=True).send_account_verify_email()
                user_sudo.active = False
                request.session.logout(keep_db=True)
                '''instead of automatic login redirect it to login_message page'''
                return request.redirect('/web/login_message')
        return res

    def _signup_with_values(self, token, values):
        # print("values==in _signup_with_values======================",values,token)
        db, login, password = request.env['res.users'].sudo().signup(values, token)

        request.env.cr.commit()  # as authenticate will use its own cursor we need to commit the current transaction
        uid = request.session.authenticate(db, login, password)
        if not uid:
            raise SignupError(_('Authentication Failed.'))

    @http.route('/web/login_message', type='http', auth='public', website=True, sitemap=False)
    def web_login_message(self, *args, **kw):
        values = {}
        values['message'] = _("Verification link has been sent to your registered email ID. Please click on 'Verify account' for account verification")
        return request.render('pragtech_housemates.login_message', values)


class Website_Inherit(Website):
    @http.route('/', auth='public', website=True)
    def index(self, **kw):

        context = request.env.context
        print("====================['login']========", request.params)
        user_rec = request.env['res.users'].sudo().search([('id', '=', context.get('uid'))])
        if user_rec:
            print("=====context.get('uid')-=======", context.get('uid'))

            send_mail = 0
            agent = request.httprequest.environ.get('HTTP_USER_AGENT')
            agent_details = httpagentparser.detect(agent)
            user_os = agent_details['os']['name']
            browser_name = agent_details['browser']['name']
            ip_address = request.httprequest.environ['REMOTE_ADDR']
            if user_rec.last_logged_ip and user_rec.last_logged_browser and user_rec.last_logged_os:
                if user_rec.last_logged_ip != ip_address or user_rec.last_logged_browser != browser_name or user_rec.last_logged_os != user_os:
                    send_mail = 1
                    user_rec.last_logged_ip = ip_address
                    user_rec.last_logged_browser = browser_name
                    user_rec.last_logged_os = user_os
                else:
                    send_mail = 0
            else:
                send_mail = 1
                user_rec.last_logged_ip = ip_address
                user_rec.last_logged_browser = browser_name
                user_rec.last_logged_os = user_os
            if send_mail == 1:

                template = request.env.ref('pragtech_housemates.mail_login_alert')
                assert template._name == 'mail.template'

                template_values = {
                    #             'email_to': '${object.email|safe}',
                    'email_cc': False,
                    'auto_delete': True,
                    'partner_to': False,
                    'scheduled_date': False,
                }

                template.sudo().write(template_values)
                mail_server_obj = request.env['ir.mail_server'].sudo().search([])
                print("===============mail_server_obj==============", mail_server_obj)

                if mail_server_obj:
                    for user in user_rec:
                        print("===============user==============", user.login)
                        if not user.email:
                            raise UserError(_("Cannot send email: user %s has no email address.") % user.name)
                        with request.env.cr.savepoint():
                            template.sudo().with_context(lang=user.lang).send_mail(user.id, force_send=True, raise_exception=True)
                        _logger.info("Password reset email sent for user <%s> to <%s>", user.login, user.email)
            properties=request.env['house.mates'].sudo().search([('user_id','=',user_rec.id)])
            if properties:
                for property in properties:
                    property.sudo().write({'latest_active_date':datetime.now()})


        # print('\n\n\n ################################################ \n\n')
        # properties = request.env['product.product'].sudo().search([])
        # print ("Recordddddddddddddddddd-------",properties)
        # data_list = []
        # for rec in properties:
        #     print (rec.id)
        #     print (rec.name)
        #     print (rec.default_code)
        #     print (rec.barcode)
        #     print (rec.description)
        #
        #     data_record = {
        #         'id' : rec.id,
        #         'title' : rec.name,
        #         'img_src' : rec.barcode,
        #         'area' : rec.default_code,
        #         'description' : rec.description,
        #     }
        #     data_list.append(data_record)

        # [
        #     {'id': 1,
        #      'img_src': 'https://flatmates-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,h_180,q_auto,w_290/dwphcw1aobemhkj8axpt.jpg'},
        #     {'id': 2,
        #      'img_src': 'https://flatmates-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,h_180,q_auto,w_290/ywk5pgct6baqjmjitf41.jpg'},
        #     {'id': 3,
        #      'img_src': 'https://flatmates-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,h_180,q_auto,w_290/hvyfhf8ihhgouxxijnb9.jpg'},
        #     {'id': 4,
        #      'img_src': 'https://flatmates-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,h_180,q_auto,w_290/dwphcw1aobemhkj8axpt.jpg'},
        #     {'id': 5,
        #      'img_src': 'https://flatmates-res.cloudinary.com/image/upload/c_fill,dpr_2.0,f_auto,h_180,q_auto,w_290/ywk5pgct6baqjmjitf41.jpg'},
        #
        # ]
        # return http.request.render('pragtech_housemates.home',
        #                             {'length' : data_list })
        return http.request.render('pragtech_housemates.home')

    @http.route(website=True, auth="public")
    def web_login(self, redirect=None, *args, **kw):
        response = super(Website_Inherit, self).web_login(redirect=redirect, *args, **kw)

        print('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ', request.session)
        list_place = False
        find_place = False
        short_list = False
        if request.session.get('list_place'):
            list_place = request.session.get('list_place')

        if request.session.get('find_place'):
            find_place = request.session.get('find_place')

        if request.session.get('short_list'):
            short_list = request.session.get('short_list')

        if not redirect and request.params['login_success']:
            # if request.env['res.users'].browse(request.uid).has_group('base.group_user'):
            #     redirect = b'/web?' + request.httprequest.query_string

            if list_place:
                request.session['list_place'] = False
                return werkzeug.utils.redirect('/listplace')

            if find_place:
                print('treeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                request.session['find_place'] = False
                return werkzeug.utils.redirect('/find-place/describe-your-ideal-place/start')
            if short_list:
                request.session['short_list'] = False
                return werkzeug.utils.redirect("/shortlists")
            # else:
            #     print('treeeeeeeeeeeeeeeeeee 2222222222222222222')
            #     redirect = '/'
            # return http.redirect_with_hash(redirect)
        return response


class FlatMates(http.Controller):

    @http.route(['/shortlist'], type='http', auth="public", website=True, csrf=False)
    def short_listting(self, **kwargs):
        if 'data' in kwargs and kwargs['data']:
            global shortlist_data
            shortlist_data=kwargs
            print("\n in shortlist", shortlist_data)
            flatmate_obj = request.env['house.mates'].sudo().search([('id', '=', kwargs['data'])], limit=1)
            res_user_id = request.env['res.users'].sudo().search([('id','=',request.uid)])
            if flatmate_obj and 'data' in kwargs:
                if kwargs['active'] == 'True':
                    if res_user_id:
                        if res_user_id.house_mates_ids:
                            res_user_id.sudo().write({
                                    'house_mates_ids': [(4,flatmate_obj.id)]
                                })
                        else:
                            res_user_id.sudo().write({
                                'house_mates_ids': [(6,0,[flatmate_obj.id])]
                            })

                else:
                    for id in res_user_id.house_mates_ids:
                        if flatmate_obj.id == id.id:
                            res_user_id.sudo().write({
                                'house_mates_ids': [(3,flatmate_obj.id)]
                            })

            list = {}
            return list

    @http.route(['/search/records'], type='http', auth="public", website=True, method=['GET'], csrf=False)
    def search_record(self, **kwargs):

        print('\n\n\nKWARGS 11::\n',kwargs,'\n\n\n')
        #
        # # for room
        # accomodation_type_room = [value for key, value in kwargs.items() if 'room_accommodation' in key]
        # print('\n\n\naccomodation_type_room ::\n', accomodation_type_room, '\n\n\n')

        # # for flats
        # # accomodation_type_flats = [value for key, value in kwargs.items() if 'flats_accommodation' in key]
        # # print('\n\n\naccomodation_type_flats ::\n', accomodation_type_flats, '\n\n\n')
        #
        # flatmate_obj = request.env['house.mates'].sudo()
        # if kwargs:
        #     if kwargs.get('search_room_button'):
        #         if kwargs.get('search_room_button') == "search_room_sumbit":
        #             print("---------------------------dhfasdkjfndfsn-----------------")
        #
        #             domain = []
        #             if kwargs.get('min_room_rent'):
        #                 minimum_rent = float(kwargs.get('min_room_rent'))
        #                 domain.append(('weekly_budget','>=',minimum_rent))
        #
        #             if kwargs.get('max_room_rent'):
        #                 maximum_rent = float(kwargs.get('max_room_rent'))
        #                 domain.append(('weekly_budget', '<=', maximum_rent))
        #
        #             if kwargs.get('search_sort'):
        #                 search_sort = kwargs.get('search_sort')
        #
        #             if kwargs.get('search_room_avail_date'):
        #                 room_avail_date = kwargs.get('search_room_avail_date')
        #                 domain.append(('avil_date','>=',room_avail_date))
        #
        #             if kwargs.get('search_gender'):
        #                     prefer = kwargs.get('search_gender')
        #                     domain.append(('pref','=',prefer))
        #
        #             if kwargs.get('search_stay_len'):
        #                 if kwargs.get('search_stay_len') != 'all_stay_len':
        #                     stay_len_type = int(kwargs.get('search_stay_len'))
        #                     max_len_stay_id = request.env['maximum.length.stay'].browse(stay_len_type)
        #                     if max_len_stay_id:
        #                         domain.append(('max_len_stay_id','=',max_len_stay_id.id))
        #
        #             if accomodation_type_room:
        #                 property_type_list=[]
        #                 for id in accomodation_type_room:
        #                     property_type_list.append(int(id))
        #                 property_type_id = request.env['property_type'].sudo().search([('id','in',property_type_list)])
        #                 print("-----((((((----))))))))--------",property_type_id)
        #                 if property_type_id:
        #                     domain.append(('property_type', '=', property_type_id.id))
        #
        #             if kwargs.get('search_room_parking_type'):
        #                 if kwargs.get('search_room_parking_type') != 'any_parking':
        #                     parking_type = int(kwargs.get('search_room_parking_type'))
        #                     parking_id = request.env['parking'].browse(parking_type)
        #                     if parking_id:
        #                         domain.append(('parking_id','=',parking_id.id))
        #
        #             if kwargs.get('search_bedrooms'):
        #                 if kwargs.get('search_bedrooms') != 'all_bedrooms':
        #                     search_bedroom = int(kwargs.get('search_bedrooms'))
        #                     bedrooms_id = request.env['bedrooms'].browse(search_bedroom)
        #                     if bedrooms_id:
        #                         domain.append(('total_bedrooms_id','=',bedrooms_id.id))
        #             # if kwargs.get(''):
        #
        #             # Search in About Rooms Line
        #             room_type = None
        #             bathroom_type = None
        #             room_furnishing_type = None
        #
        #             if kwargs.get('search_room_type'):
        #                 if kwargs.get('search_room_type') != 'all_rooms':
        #                     print('Room Type existttttttttttttttt')
        #                     room_type = int(kwargs.get('search_room_type'))
        #
        #             if kwargs.get('search_room_bathroom_type'):
        #                 if kwargs.get('search_room_bathroom_type') != 'all_bathroom_types':
        #                     print('Bathroom type existtttttttttttttttttt')
        #                     bathroom_type = int(kwargs.get('search_room_bathroom_type'))
        #
        #             if kwargs.get('search_room_furnsh_type'):
        #                 if kwargs.get('search_room_furnsh_type') != 'all_furnishing_types':
        #                     print('furnishing type existtttttttttttttttt')
        #                     room_furnishing_type = int(kwargs.get('search_room_furnsh_type'))
        #
        #             #############################
        #
        #             if domain:
        #                 print('\n\n\nDomain :: \n\n',domain,'\n\n\n')
        #                 flatmate_records = flatmate_obj.search(domain)
        #
        #                 print('REcordsssssss : ',flatmate_records)
        #                 # result_list = []
        #                 # if flatmate_records :
        #                 #     if room_type or bathroom_type or room_furnishing_type:
        #                 #         for record in flatmate_records:
        #                 #             for line in record.rooms_ids:
        #                 #                 if line.room_type_id.id == room_type or\
        #                 #                     line.bath_room_type_id.id == bathroom_type or\
        #                 #                     line.room_furnishing_id.id == room_furnishing_type:
        #                 #
        #                 #                     if record not in result_list:
        #                 #                         result_list.append(record)
        #                 #
        #                 #     if result_list:
        #                 #             print('\n\n\nResult List ::\n',result_list,'\n\n\n')
        #                 #
        #                 #     else:
        #                 #         print('\n\n\n Result List Without line ::\n',flatmate_records,'\n\n\n')
        #
        #
        #
        #
        #
        #
        # # print("\n\n Result List ::::::::::",result_list, "\n\n\n")

        return request.render("pragtech_housemates.home")

    # @http.route(['/P<id>'], type='http', auth="public", website=True, csrf=True)
    # def property_detail(self, id, **kwargs):
    #     print("\n\nID -----------------------", id)
    #     property = request.env['flat.mates'].sudo().search([('id', '=', id)], limit=1)
    #     property_address= property.street+','+property.street2+','+property.city
    #     values={'property': property,'property_address':property_address}
    #
    #     if property.user_id:
    #         values.update({'user_name':property.user_id.name})
    #     if property.total_bedrooms_id.name:
    #         values.update({'total_bedrooms': property.total_bedrooms_id.name})
    #     if property.total_bathrooms_id.name:
    #         values.update({'total_bathrooms': property.total_bathrooms_id.name})
    #     if property.total_no_flatmates_id.name:
    #         values.update({'total_no_flatmates': property.total_no_flatmates_id.name})
    #     if property.description_about_property:
    #         values.update({'description_about_property':property.description_about_property})
    #     if property.description_about_user:
    #         values.update({'description_about_user':property.description_about_user})
    #
    #
    #     return request.render("pragtech_housemates.property_detail11", values)



    @http.route(['/get_html_content_property_detail'], type='json', auth="public", website=True, csrf=False)
    def get_html_content_property_detail(self,**kwargs):
        property=None

        if 'id' in kwargs and kwargs['id']:
            property = request.env['house.mates'].sudo().browse(int(kwargs['id']))
        values={}
        if property.description_about_property:
            str_proprty_descrip=property.description_about_property.replace('\n','<br>')
            values={'description_about_property':str_proprty_descrip}
        if property.description_about_user:
            str_user_descrip=property.description_about_user.replace('\n','<br>')
            values.update({'description_about_user':str_user_descrip})
        if property.listing_type:
            values.update({'listing_type':property.listing_type})
        if property.listing_type == 'list' and property.latitude:
            values.update({'latitude':property.latitude})
        if property.listing_type == 'list' and property.longitude:
            values.update({'longitude': property.longitude})
        if property.listing_type == 'list' and property.north:
            values.update({'north': property.north})
        if property.listing_type == 'list' and property.east:
            values.update({'east': property.east})
        if property.listing_type == 'list' and property.south:
            values.update({'south': property.south})
        if property.listing_type == 'list' and property.west:
            values.update({'west': property.west})
        if property.city:
            values.update({'city':property.city})
        if property.suburbs_ids:
            values.update({'suburbs_city':property.suburbs_ids[0].city})
        if property.property_type:
            values.update({'property_type':property.property_type[0].property_type})
        print("\n\nID -----------****************************------------", values)

        return values


    @http.route(['/P<id>'], type='http', auth="public", website=True, csrf=True)
    def property_detail(self, id, **kwargs):
        property = request.env['house.mates'].sudo().search([('id', '=', id)], limit=1)

        print (property.street,property.street2,property.city)
        if property.street:
            property_address = property.street
        else:
            property_address = ''

        if property.street2:
                property_address= property.street2
        if property.street3:
            property_address += ', ' + property.street3
        if property.city:
            property_address+= ', ' + property.city

        values = {'property': property, 'property_address': property_address,'street':property.street,'street2':property.street2,'city':property.city}
        if property.listing_type == 'list':
            values.update({'listing_type':'List'})
        if property.listing_type == 'find':
            values.update({'listing_type':'Find'})
        if property.user_id:
            values.update({'user_name': property.user_id.name})
            values.update({'property_user_id': property.user_id.id})
        if property.user_id:
            values.update({'property_user_id': property.user_id})
        if property.total_bedrooms_id.name:
            values.update({'total_bedrooms': property.total_bedrooms_id.name})
        if property.total_bathrooms_id.name:
            values.update({'total_bathrooms': property.total_bathrooms_id.name})
        if property.total_no_flatmates_id.name:
            values.update({'total_no_flatmates': property.total_no_flatmates_id.name})
        if property.type == 'house':
            values.update({'listing_type':'House'})
        if property.type == 'flat':
            values.update({'listing_type':'Flat'})
        # if property.description_about_property:
        #     # property_des=property.description_about_property
        #     # new_property_des=property_des.replace('\n','<br/>')
        #     values.update({'description_about_property': property.description_about_property})
        # if property.description_about_user:
        #     values.update({'description_about_user': property.description_about_user})

        if property.backpackers == True:
            values.update({'property_new':'property preferences'})
            values.update(({'backpackers': 'Backpackers'}))
        if property.smokers == True:
            values.update({'property_new':'property preferences'})
            values.update({'smokers': 'Smokers'})
        if property.fourty_year_old == True:
            values.update({'property_new':'property preferences'})
            values.update({'fourty_year_old': '40+ years olds'})
        if property.pets == True:
            values.update({'property_new':'property preferences'})
            values.update({'pets': 'Pets'})
        if property.on_welfare == True:
            values.update({'property_new':'property preferences'})
            values.update({'on_welfare': 'On welfare'})
        if property.students == True:
            values.update({'property_new':'property preferences'})
            values.update(({'students': 'Students'}))
        if property.LGBTI == True:
            values.update({'property_new':'property preferences'})
            values.update({'LGBTI': 'LGBTI'})
        if property.children == True:
            values.update({'property_new':'property preferences'})
            values.update({'children': 'Children'})
        if property.retirees == True:
            values.update({'property_new':'property preferences'})
            values.update({'retirees': 'Retirees'})
        if property.min_len_stay_id:
            values.update({'min_len_stay_id': property.min_len_stay_id.id})
            values.update({'min_len_stay_name': property.min_len_stay_id.name})

        if property.avil_date:
            # date_string=str(property.avil_date)
            # new_date = datetime.strptime(date_string, '%Y-%m-%d')
            if property.avil_date <= date.today():
                values.update({'avil_date': "Now"})
            else:
                available_date = property.avil_date.strftime('%d %b %G')
                values.update({'avil_date': available_date})

        if property.weekly_budget:
            values.update({'weekly_budget': int(property.weekly_budget)})
        if property.bond_id:
            values.update({'bond_id': int(property.weekly_budget*property.bond_id.number_of_week)})
        if property.bill_id:
            values.update({'bill_id': property.bill_id.name})
        print(property.parking_id.name)
        if property.parking_id:
            values.update({'parking_id': property.parking_id.name})
        if property.pref:
            value_key=property.selection_value(property.pref)
            print("=====kAHSfdjsaD====",value_key)
            values.update({'pref':property.pref })
        if property.person_ids:
            if property.person_ids[0].age:
                values.update({'age':property.person_ids[0].age})
            if property.person_ids[0].gender:
                values.update({'gender': property.person_ids[0].gender})
        if property.max_len_stay_id:
            values.update({'stay_lenget':property.max_len_stay_id.name})

        if property.f_full_time == True:
            values.update({'f_full_time':'Working Full time'})
        if property.f_part_time == True:
            values.update({'f_part_time': 'Working Part Time'})
        if property.f_working_holiday == True:
            values.update({'f_working_holiday': 'Working Holiday'})
        if property.f_retired == True:
            values.update({'f_retired': 'Retired'})
        if property.f_unemployed == True:
            values.update({'f_unemployed': 'Unemployed'})
        if property.f_backpacker == True:
            values.update({'f_backpacker': 'Backpacker'})
        if property.f_student == True:
            values.update({'f_student': 'Student'})

        if property.rooms_ids:
            if property.rooms_ids[0].room_furnishing_id:
                values.update({'room_furnishing_id':property.rooms_ids[0].room_furnishing_id.name})
            if property.rooms_ids[0].bath_room_type_id:
                values.update({'bath_room_type_id':property.rooms_ids[0].bath_room_type_id.name})
            if property.rooms_ids[0].room_type_id:
                values.update({'room_type_id': property.rooms_ids[0].room_type_id.name})

        if property.internet_id:
            values.update({'internet_id':property.internet_id.name})
        if property.property_type:
            values.update({'accomodation_type':property.property_type})

        if request.uid and request.uid != 4:
            values.update({'login_user_id':request.uid})

            print("\n\nID -----------------------", request.uid)
        print("=====ghghghgh====", values)
        """set mobile_not_verified,show_upgrade_plan_mobile and show_number as per conditions"""
        if not request.env.user.partner_id.mobile_no_is_verified:
            values['mobile_not_verified'] = True
        else:
            values['mobile_not_verified'] = False
        # basic_plan_product = request.env['product.product'].sudo().search([('name', '=', 'Basic Plan')])
        # sale_order_ids = request.env['sale.order'].sudo().search([('partner_id', '=', request.env.user.partner_id.id)])
        # for sale in sale_order_ids:
        #     for line in sale.order_line:
        #         if line.product_id.id == basic_plan_product.id:
        #             if date.today() > sale.create_date.date() +timedelta(days=basic_plan_product.no_of_days) and  not values['mobile_not_verified']:
        #                 values['show_upgrade_plan'] = True
        #             else:
        #                 values['show_upgrade_plan'] = False
        #             continue
        mobile_feature = request.env.ref('pragtech_housemates.feature2')
        send_message = request.env.ref('pragtech_housemates.feature4')
        social_media = request.env.ref('pragtech_housemates.feature3')
        enquiries = request.env.ref('pragtech_housemates.feature1')

        if not mobile_feature:
            mobile_feature = request.env['plan.faeture'].sudo.search([('feature_type', '=', 'mobile_number')], limit=1)

        if not send_message:
            send_message = request.env['plan.faeture'].sudo.search([('feature_type', '=', 'send_message')], limit=1)

        if not social_media:
            social_media = request.env['plan.faeture'].sudo.search([('feature_type', '=', 'social_media')], limit=1)

        if not enquiries:
            enquiries = request.env['plan.faeture'].sudo.search([('feature_type', '=', 'enquiries')], limit=1)

        transaction_ids = request.env['transaction.history'].sudo().search([('partner_id', '=', request.env.user.partner_id.id)])
        for transaction in transaction_ids:
            if date.today() <= datetime.strptime(transaction.end_date , '%d-%m-%Y').date():
                for feature in transaction.plan.feature_ids:
                    if feature.id == mobile_feature.id:
                        values['show_upgrade_plan_mobile'] = False
                    if feature.id == send_message.id:
                        values['show_upgrade_plan_send'] = False
                    if feature.id == social_media.id:
                        values['show_upgrade_plan_media'] = False
                    if feature.id == enquiries.id:
                        values['show_upgrade_plan_receive'] = False

        if 'show_upgrade_plan_mobile' not in values:
            values['show_upgrade_plan_mobile'] = True

        if 'show_upgrade_plan_send' not in values:
            values['show_upgrade_plan_send'] = True

        if 'show_upgrade_plan_media' not in values:
            values['show_upgrade_plan_media'] = True

        if 'show_upgrade_plan_receive' not in values:
            values['show_upgrade_plan_receive'] = True

        if not values['show_upgrade_plan_mobile'] and not values['mobile_not_verified']:
            values['show_number'] = True
        else:
            values['show_number'] = False

        print('iddddddddddddddddd ',id)
        # user = request.env["res.users"].sudo().browse(int(id))
        last_login = self.get_last_login_date(property.user_id)
        print('\n\n======== last login :: ',last_login)
        if last_login:
            values.update({'last_login':last_login})


        return request.render("pragtech_housemates.property_detail11", values)

    @http.route(['/shortlists'], type='http', auth="public", website=True, csrf=True)
    def short_list(self, **kwargs):
        # user_name = ""
        # if request.env.user.name != "Public user":
        #     user_name = http.request.env.user.name
        # values = {
        #     'categories': http.request.env['helpdesk.category'].sudo().search([]),
        #     'prioritys': http.request.env['helpdesk.priority'].sudo().search([]),
        #     'user_name': user_name,
        #     'user_email': request.env.user.email,
        #     'products': http.request.env['product.template'].sudo().search([]),
        # }
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'short_list': True})
            return werkzeug.utils.redirect('/web/login', )
        if 'data' in shortlist_data:
            flatmate_obj = request.env['house.mates'].sudo().search([('id', '=', shortlist_data['data'])], limit=1)
            res_user_id = request.env['res.users'].sudo().search([('id', '=', request.uid)])
            if res_user_id:
                if flatmate_obj and 'data' in shortlist_data:
                    if shortlist_data['active'] == 'True':
                        if res_user_id:
                            if res_user_id.house_mates_ids:
                                res_user_id.sudo().write({
                                    'house_mates_ids': [(4, flatmate_obj.id)]
                                })
                            else:
                                res_user_id.sudo().write({
                                    'house_mates_ids': [(6, 0, [flatmate_obj.id])]
                                })

                    else:
                        for id in res_user_id.house_mates_ids:
                            if flatmate_obj.id == id.id:
                                res_user_id.sudo().write({
                                    'house_mates_ids': [(3, flatmate_obj.id)]
                                })

        return request.render("pragtech_housemates.shortlist_page", )

    ##################################################################
    # ----------------  Routes for list my place  -------------------#
    ##################################################################

    @http.route(['/listplace'], type='http', auth="public", website=True, csrf=True)
    def list_place(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        else:
            return request.render("pragtech_housemates.list_place")

    @http.route(['/listplace/describe-your-place/accommodation'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_accommodation(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.list_place_accommodation", )

    @http.route(['/listplace/<property_type>/about'], type='http', auth="public", website=True, csrf=False)
    def list_place_about(self, property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        parking = request.env['parking'].sudo().search([('view_for','=','List')])
        internet = request.env['internet'].sudo().search([('view_for','=','List')])
        bedrooms = request.env['bedrooms'].sudo().search([])
        bathrooms = request.env['bathrooms'].sudo().search([])
        room_furnishings = request.env['room.furnishing'].sudo().search([('view_for','=','List')])

        data = {'parkings': parking,
                'internets': internet,
                'bedrooms': bedrooms,
                'bathrooms': bathrooms,
                'room_furnishings': room_furnishings,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_housemates.about_template", data)

    @http.route(['/listplace/whole-property/property-type'], type='http', auth="public", website=True, csrf=False)
    def list_place_whole_property_property_type(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        else:

            return request.render("pragtech_housemates.whole_property_template", )

    @http.route(['/listplace/<property_type>/who-lives-here'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_who_lives_here(self, property_type, **kwargs):
        print("\n=====  prop[rty type====",property_type)
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        if 'type_of_accomodation' in kwargs and kwargs['type_of_accomodation'] == "whole-property" or property_type == 'whole-property':
            bond_ids = request.env['bond.bond'].sudo().search([])
            bill_ids = request.env['bill.bill'].sudo().search([])

            data = {'bond_ids': bond_ids,
                    'bill_ids': bill_ids,
                    'type_of_accomodation':property_type,
                    }

            return request.render("pragtech_housemates.rent_bond_bills", data)


        total_flatmates = request.env['total.flatmates'].sudo().search([('view_for','=','List')])

        data = {'total_flatmates': total_flatmates,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })


        return request.render("pragtech_housemates.about_who_lives_here_template", data)

    @http.route(['/listplace/<property_type>/about-rooms'], type='http', auth="public", website=True, method=['POST'],
                csrf=False)
    def list_place_about_rooms(self, property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        room_types = request.env['room.types'].sudo().search([])
        room_furnishings = request.env['room.furnishing'].sudo().search([('view_for','=','List')])
        bathroom_types = request.env['bathroom.types'].sudo().search([('view_for','=','List')])

        data = {'room_types': room_types,
                'room_furnishings': room_furnishings,
                'bathroom_types': bathroom_types,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.about_rooms_template", data)

    @http.route(['/listplace/<property_type>/rent-bond-bills'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_share_house_rent_bond_bills(self, property_type, **kwargs):
        print('\n\n\n Request session List Place Dict  in 4444: \n', kwargs)

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})
            return werkzeug.utils.redirect('/web/login', )

        if kwargs:

            num_of_rooms = int(len(kwargs) / 3)
            # num_of_rooms = int(len(kwargs) / 2)-1

            room_data = {}
            print(num_of_rooms)
            for rec in range(0, num_of_rooms):
                room_dict = {}
                print(rec)
                # room_type_key = 'room_type_'+str(rec)
                # bathroom_types_key = 'bathroom_types_'+str(rec)
                # room_furnishing_key = 'room_furnishing_types_'+str(rec)

                room_dict['room_type'] = kwargs['room_type_' + str(rec)]
                room_dict['room_furnishing'] = kwargs['bathroom_types_' + str(rec)]
                room_dict['bathrrom_type'] = kwargs['room_furnishing_types_' + str(rec)]

                room_data['room' + str(rec + 1)] = [room_dict]

        bond_ids = request.env['bond.bond'].sudo().search([])
        bill_ids = request.env['bill.bill'].sudo().search([])

        data = {'bond_ids': bond_ids,
                'bill_ids': bill_ids,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })


        return request.render("pragtech_housemates.rent_bond_bills", data)

    @http.route(['/listplace/<property_type>/room-availability'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_share_house_room_availability(self, property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )


        min_len_stay_ids = request.env['minimum.length.stay'].sudo().search([])
        max_len_stay_ids = request.env['maximum.length.stay'].sudo().search([])

        data = {'min_len_stay_ids': min_len_stay_ids,
                'max_len_stay_ids': max_len_stay_ids,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation':property_type
                         })

        return request.render("pragtech_housemates.room_availability", data)

    @http.route(['/listplace/<property_type>/property-images'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_property_images(self, property_type,**kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.property_images", data)

    @http.route(['/listplace/<property_type>/describe-your-flatmate'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_describe_your_flatmate(self,property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.list_place_describe_your_flatmate", data)

    @http.route(['/listplace/<property_type>/flatmate-preference'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_flatmate_preference(self,property_type,**kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        flatmate_preferences = request.env['flatmate.preference'].sudo().search([])

        data = {
            'flatmate_preferences': flatmate_preferences,
        }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.flatmate_preference_template", data)

    @http.route(['/listplace/<property_type>/accepting'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_accepting(self,property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.list_place_accepting", data)

    @http.route(['/listplace/<property_type>/introduce-yourself'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_share_house_introduce_yourself(self,property_type,**kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation': property_type
                         })

        return request.render("pragtech_housemates.list_place_describe_yourself", data)

    @http.route(['/listplace/<property_type>/about-others'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_about_others(self, property_type,**kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })
        else:
            data.update({'type_of_accomodation':property_type
                         })

        return request.render("pragtech_housemates.list_place_about_others", data)

    @http.route(['/listplace/<property_type>/about-property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_comment_about_property(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        return request.render("pragtech_housemates.list_place_comment_about_property", )

    @http.route(['/list/my/property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_my_property(self, **kwargs):
        return request.render("pragtech_housemates.list_my_property", )

    @http.route(['/find/a/property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def find_a_property(self, **kwargs):
        return request.render("pragtech_housemates.find_a_property", )

    # ================== Create listing Property in Odoo ===================================#
    @http.route('/create/list_property', auth='public', type='json', website=True)
    def create_list_property(self, list_place_data):

        print('\n\n\n-----------------------------------  create_list_property  ----------------------------------------------\n\n')
        print('List place data :\n',list_place_data,'\n\n\n')
        flat_mates_obj = request.env['house.mates']
        lisitng_created = False
        vals = {}

        if list_place_data:
            list_place_dict = list_place_data[0]
            print('List Place Dict : ',list_place_dict)
            # if 'is_listing' in list_place_dict and list_place_dict.get('is_listing'):
            if 'accommodation_type' in list_place_dict and list_place_dict.get('accommodation_type'):
                print('1111111111111111111111111111111111111111')
                if list_place_dict.get('accommodation_type') == 'sharehouse':
                    accomodation_id= request.env['property.type'].sudo().search([('property_type','=','Rooms in an existing share house')])
                    vals.update({
                        'property_type': [(6,0,[accomodation_id.id])]
                    })
                elif list_place_dict.get('accommodation_type') == 'whole-property' :
                    accomodation_id_list=[]
                    accomodation_id = request.env['property.type'].sudo().search(
                        [('property_type', '=', 'Whole property for rent')])
                    accomodation_id_list.append(accomodation_id.id)
                    if 'whole_property_property_type' in list_place_dict and list_place_dict.get('whole_property_property_type'):
                        if list_place_dict.get('whole_property_property_type') == '2_bedrooms':
                            accomodation_id = request.env['property.type'].sudo().search(
                                [('property_type', '=', '2+ bedrooms')])
                            accomodation_id_list.append(accomodation_id.id)

                        elif list_place_dict.get('whole_property_property_type') == '1_bedrooms':
                            accomodation_id = request.env['property.type'].sudo().search(
                                [('property_type', '=', 'One Bed Flat')])
                            accomodation_id_list.append(accomodation_id.id)

                        elif list_place_dict.get('whole_property_property_type') == 'studio':
                            accomodation_id = request.env['property.type'].sudo().search(
                                [('property_type', '=', 'Studio')])
                            accomodation_id_list.append(accomodation_id.id)

                        elif list_place_dict.get('whole_property_property_type') == 'granny_flat':
                            accomodation_id = request.env['property.type'].sudo().search(
                                [('property_type', '=', 'Granny Flats')])
                            accomodation_id_list.append(accomodation_id.id)

                    vals.update({
                        'property_type': [(6, 0, accomodation_id_list)]
                    })
                elif list_place_dict.get('accommodation_type') == 'student-accomodation':
                    accomodation_id = request.env['property.type'].sudo().search(
                        [('property_type', '=', 'Student accommodation')])
                    vals.update({
                        'property_type': [(6, 0, [accomodation_id.id])]
                    })
                elif list_place_dict.get('accommodation_type') == 'homestay':
                    accomodation_id = request.env['property.type'].sudo().search(
                        [('property_type', '=', 'Homestay')])
                    vals.update({
                        'property_type': [(6, 0, [accomodation_id.id])]
                    })



            if 'property_type' in list_place_dict and list_place_dict.get('property_type'):
                print('222222222222222222222222222222222222222')
                if list_place_dict.get('accommodation_type') == "sharehouse":
                    if list_place_dict.get('property_type') == 'house':
                        vals.update({
                            'type': 'house'
                        })
                    elif list_place_dict.get('property_type') == 'flat':
                        vals.update({
                            'type': 'flat'
                        })

            if 'property_address' in list_place_dict and list_place_dict.get('property_address'):
                vals.update({
                    'property_address':list_place_dict.get('property_address')
                })


            if 'street_number' in list_place_dict and list_place_dict.get('street_number'):
                vals.update({
                    'street': list_place_dict.get('street_number'),
                })
            else:
                if 'street1' in list_place_dict and list_place_dict.get('street1'):
                    vals.update({
                        'street': list_place_dict.get('street1'),
                    })
                else:
                    pass

            if 'street2' in list_place_dict and list_place_dict.get('street2'):
                vals.update({
                    'street2': list_place_dict.get('street2'),
                })
            if 'street3' in list_place_dict and list_place_dict.get('street3'):
                vals.update({
                    'street3': list_place_dict.get('street3'),
                })
            if 'city' in list_place_dict and list_place_dict.get('city'):
                vals.update({
                    'city': list_place_dict.get('city'),
                })
            if 'state' in list_place_dict and list_place_dict.get('state'):
                state_name = list_place_dict.get('state')
                state_id = request.env['res.country.state'].sudo().search([('name','=',state_name)],limit=1)
                print('State Id and name :',state_id,state_id.name)
                if state_id:
                    vals.update({
                        'state_id': state_id.id,
                    })
            if 'zip_code' in list_place_dict and list_place_dict.get('zip_code'):
                vals.update({
                    'zip': list_place_dict.get('zip_code'),
                })
            # if 'country' in list_place_dict and list_place_dict.get('country'):
            #     country_name = list_place_dict.get('country')
                country_id = request.env['res.country'].sudo().search([('code','=','AU')],limit=1)
                print('Country Id and name :', country_id,country_id.name)
                if country_id:
                    vals.update({
                        'country_id': country_id.id,
                    })
            if 'latitude' in list_place_dict and list_place_dict.get('latitude'):
                vals.update({
                    'latitude': list_place_dict.get('latitude')
                })
            if 'longitude' in list_place_dict and list_place_dict.get('longitude'):
                vals.update({
                    'longitude': list_place_dict.get('longitude')
                })

            if 'north' in list_place_dict and list_place_dict.get('north'):
                vals.update({
                    'north': list_place_dict.get('north')
                })
            if 'east' in list_place_dict and list_place_dict.get('east'):
                vals.update({
                    'east': list_place_dict.get('east')
                })

            if 'south' in list_place_dict and list_place_dict.get('south'):
                vals.update({
                    'south': list_place_dict.get('south')
                })
            if 'west' in list_place_dict and list_place_dict.get('west'):
                vals.update({
                    'west': list_place_dict.get('west')
                })


            if 'total_bedrooms' in list_place_dict and list_place_dict.get('total_bedrooms'):
                print('4444444444444444444444444444444444444')
                bed_id = int(list_place_dict.get('total_bedrooms'))

                total_bedroom_id = request.env['bedrooms'].sudo().browse(bed_id)
                if total_bedroom_id:
                    vals.update({
                        'total_bedrooms_id': total_bedroom_id.id
                    })
            if 'total_bathrooms' in list_place_dict and list_place_dict.get('total_bathrooms'):
                print('555555555555555555555555555555555555555555555555555555')
                bath_id = int(list_place_dict.get('total_bathrooms'))

                total_bathroom_id = request.env['bathrooms'].sudo().browse(bath_id)
                if total_bathroom_id:
                    vals.update({
                        'total_bathrooms_id':total_bathroom_id.id
                    })

            if 'parking' in list_place_dict and list_place_dict.get('parking'):
                print('666666666666666666666666666666666666666')
                park_id = int(list_place_dict.get('parking'))

                parking_id = request.env['parking'].sudo().browse(park_id)
                if parking_id:
                    vals.update({
                        'parking_id':parking_id.id
                    })

            if 'internet' in list_place_dict and list_place_dict.get('internet'):
                print('777777777777777777777777777777777777777')
                intrnt_id = int(list_place_dict.get('internet'))

                internet_id = request.env['internet'].sudo().browse(intrnt_id)
                if internet_id:
                    vals.update({
                        'internet_id':internet_id.id
                    })

            if 'total_no_of_flatmates' in list_place_dict and list_place_dict.get('total_no_of_flatmates'):
                print('88888888888888888888888888888888888888888')
                total_flatmate_id = int(list_place_dict.get('total_no_of_flatmates'))

                total_no_of_flatmate_id = request.env['total.flatmates'].sudo().browse(total_flatmate_id)

                if total_no_of_flatmate_id:
                    vals.update({
                        'total_no_flatmates_id': total_no_of_flatmate_id.id
                    })

            if 'weekly_rent' in list_place_dict and list_place_dict.get('weekly_rent'):
                print('999999999999999999999999999999999999')
                vals.update({
                    'weekly_budget': float(list_place_dict.get('weekly_rent'))
                })

            if 'bond' in list_place_dict and list_place_dict.get('bond'):
                print('10000000000000000000000000000000000000')
                bond_id = int(list_place_dict.get('bond'))

                bond_id = request.env['bond.bond'].sudo().browse(bond_id)
                if bond_id:
                        vals.update({
                            'bond_id':bond_id.id
                        })

            if 'bill' in list_place_dict and list_place_dict.get('bill'):
                print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa')
                bill_id = int(list_place_dict.get('bill'))

                bill_id = request.env['bill.bill'].sudo().browse(bill_id)
                if bill_id:
                    vals.update({
                        'bill_id': bill_id.id
                    })

            if 'avail_date' in list_place_dict and list_place_dict.get('avail_date'):
                print('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBb')
                vals.update({
                    'avil_date':list_place_dict.get('avail_date')
                })

            if 'min_length_of_stay' in list_place_dict and list_place_dict.get('min_length_of_stay'):
                print('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC')
                min_stay_id = int(list_place_dict.get('min_length_of_stay'))

                min_len_stay_id = request.env['minimum.length.stay'].sudo().browse(min_stay_id)
                if min_len_stay_id:
                    vals.update({
                        'min_len_stay_id':min_len_stay_id.id
                    })

            if 'max_length_of_stay' in list_place_dict and list_place_dict.get('max_length_of_stay'):
                print('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')
                max_stay_id = int(list_place_dict.get('max_length_of_stay'))

                max_len_stay_id = request.env['maximum.length.stay'].sudo().browse(max_stay_id)
                if max_len_stay_id:
                    vals.update({
                        'max_len_stay_id': max_len_stay_id.id
                    })

            if 'flatmate_preference_type' in list_place_dict and list_place_dict.get('flatmate_preference_type'):
                print('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe')
                vals.update({
                    'pref':list_place_dict.get('flatmate_preference_type')
                })

            if 'accepting' in list_place_dict and list_place_dict.get('accepting'):
                print('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFf')
                # values = {}
                accept_list = []
                for accept in list_place_dict.get('accepting'):
                    if accept == 'backpackers':
                        vals.update({'backpackers':True})
                    if accept == 'students':
                        vals.update({'students': True})
                    if accept == 'smokers':
                        vals.update({'smokers': True})
                    if accept == 'LGBTI':
                        vals.update({'LGBTI': True})
                    if accept == '40_year_old':
                        vals.update({'fourty_year_old': True})
                    if accept == 'children':
                        vals.update({'children': True})
                    if accept == 'pets':
                        vals.update({'pets': True})
                    if accept == 'retirees':
                        vals.update({'retirees': True})
                    if accept == 'on_welfare':
                        vals.update({'on_welfare': True})

                # accept_obj = request.env['property.accepting']
                # for accept in list_place_dict.get('accepting'):
                #     values.update({
                #         'name':accept.capitalize()
                #     })
                #
                #     accept_id = accept_obj.sudo().create(values)
                #     accept_list.append(accept_id.id)
                #
                # if accept_list:
                #     vals.update({
                #         'accepting_ids': [( 6, 0, accept_list)]
                #     })

            if 'about_you_and_your_flatmates' in list_place_dict and list_place_dict.get('about_you_and_your_flatmates'):
                print('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')
                vals.update({
                    'description_about_user': list_place_dict.get('about_you_and_your_flatmates')
                })

            if 'comment_about_property' in list_place_dict and list_place_dict.get('comment_about_property'):
                # print('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh')
                vals.update({
                    'description_about_property':list_place_dict.get('comment_about_property')
                })

        vals.update({
            'user_id':request.env.user.id,
            'listing_type':'list'
        })

        if request.env.user.partner_id.mobile:
            vals.update({'state' :'active'})
        else:
            vals.update({'state' :'pending'})

        print('\n\nVals :: \n\n',vals,'\n\n\n')
        if vals:
            flat_mates_id = flat_mates_obj.sudo().create(vals)
            request.session['new_listing_id'] = flat_mates_id.id
            if flat_mates_id:
                lisitng_created = True
            if flat_mates_id and 'rooms_data' in list_place_dict and list_place_dict.get('rooms_data'):

                print('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII Method call for create line')
                self.create_about_rooms_lines(list_place_dict.get('rooms_data'),flat_mates_id)

            if 'property_images' in list_place_dict and list_place_dict.get('property_images'):
                images = self.create_property_images(list_place_dict.get('property_images'), flat_mates_id)

                if images:
                    flat_mates_id.write({
                        'property_image_ids': [( 6, 0, images)]
                    })

        if lisitng_created:
            result = {'new_list_id':flat_mates_id.id}
            request.session['new_listing_id'] = flat_mates_id.id

        else:
            result={}

        print('\n\n+++++++++++++++++++++++++++++++++++++++++++++\n\n')
        print('Result :: ',result)
        print('\n\n+++++++++++++++++++++++++++++++++++++++++++++\n\n')

        return result

    def create_about_rooms_lines(self,rooms_data,flat_mates_id):
        print('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ')
        print('Roomds Data :n',rooms_data,'\n\n')
        print('Flatmates Newly created id :',flat_mates_id)
        if rooms_data and flat_mates_id:
            values = {}
            rooms_count = len(rooms_data)
            about_rooms_obj = request.env['about.rooms']
            counter = 1
            for room in rooms_data:
                if counter > rooms_count:
                    break

                each_room = room.get('Room_'+str(counter))
                if 'room_type' in each_room:
                    room_typ_id = int(each_room['room_type'])

                    room_type_id =request.env['room.types'].sudo().browse(room_typ_id)
                    if room_type_id:
                        values = {
                            'room_type_id':room_type_id.id
                        }
                if 'room_furnishing_types' in each_room:
                    room_furn_id = int(each_room['room_furnishing_types'])

                    room_furnishing_id = request.env['room.furnishing'].sudo().browse(room_furn_id)
                    if room_furnishing_id:
                        values.update({
                            'room_furnishing_id': room_furnishing_id.id
                        })

                if 'bathroom_types' in each_room:
                    bath_room_type_id = int(each_room['bathroom_types'])

                    bath_room_type_id = request.env['bathroom.types'].sudo().browse(bath_room_type_id)
                    if bath_room_type_id:
                        values.update({
                            'bath_room_type_id': bath_room_type_id.id
                        })

                values.update({
                    'flatmate_id':flat_mates_id.id
                })

                if values:
                    print('values 2121: ',values)
                    about_rooms_obj.sudo().create(values)

                counter = counter+1

        return True

    def create_property_images(self, images_data, flatmate_id):
        # print (images_data,"Imagedsssssssssssssssss Data")

        property_image_obj = request.env['property.image']

        cnt=1

        images_list = []
        for image in images_data:
            vals={'flat_mates_id': flatmate_id.id,
                  'name':cnt,
                  'image':image
                  }
            new_image_id = property_image_obj.sudo().create(vals)
            images_list.append(new_image_id.id)
            cnt +=1
        print ("\n\n\n Image list ",images_list,'\n\n')

        return images_list

    # ================== Create finding Property in Odoo ===================================#
    @http.route('/create/find_place', auth='public', type='json', website=True)
    def create_find_property(self, find_place_data):
        print('\n\n\n\n Find Property \n',find_place_data[0],'\n\n\n')
        flat_mates_obj = request.env['house.mates']
        find_proprty_created = False
        vals = {}

        if find_place_data:
            find_place_dict = find_place_data[0]


            if 'find_property_looking_for' in find_place_dict and find_place_dict.get('find_property_looking_for'):
                accomodation_id_list=[]
                for accomodation_type in find_place_dict.get('find_property_looking_for'):
                    accomodation_id= request.env['property.type'].sudo().search([('property_type','=',accomodation_type)])
                    if accomodation_id.id:
                        accomodation_id_list.append(accomodation_id.id)
                if accomodation_id_list:
                        vals.update({
                            'property_type': [(6,0,accomodation_id_list)] #need to update ,static accommodation type added
                        })
                print("====accomodation_id_list====",accomodation_id_list)
            if 'find_teamups_status' in find_place_dict and find_place_dict.get('find_teamups_status'):
                vals.update({
                    'is_teamups':True
                })

            if 'find_weekly_budget' in find_place_dict and find_place_dict.get('find_weekly_budget'):
                vals.update({
                    'weekly_budget':float(find_place_dict.get('find_weekly_budget'))
                })

            if 'find_move_date' in find_place_dict and find_place_dict.get('find_move_date'):
                vals.update({
                    'avil_date':find_place_dict.get('find_move_date')
                })

            if 'find_preferred_length_stay' in find_place_dict and find_place_dict.get('find_preferred_length_stay'):
                vals.update({
                    'max_len_stay_id':int(find_place_dict.get('find_preferred_length_stay'))
                })

            if 'find_parking_type' in find_place_dict and find_place_dict.get('find_parking_type'):
                vals.update({
                    'parking_id': int(find_place_dict.get('find_parking_type'))
                })

            if 'find_internet_type' in find_place_dict and find_place_dict.get('find_internet_type'):
                    vals.update({
                        'internet_id' : int(find_place_dict.get('find_internet_type'))
                    })

            if 'find_comment' in find_place_dict and find_place_dict.get('find_comment'):
                    vals.update({
                        'description_about_property' : find_place_dict.get('find_comment')
                    })
            if 'find_no_of_flatmates' in find_place_dict and find_place_dict.get('find_no_of_flatmates'):
                vals.update({
                    'total_no_flatmates_id': int(find_place_dict.get('find_no_of_flatmates'))
                })

            if 'find_employment_status' in find_place_dict and find_place_dict.get('find_employment_status'):
                for status in find_place_dict.get('find_employment_status'):
                    if status == 'working_full_time':
                        vals.update({
                            'f_full_time' : True
                        })
                    if status == 'working_part_time':
                        vals.update({
                            'f_part_time': True
                        })
                    if status == 'working_holiday':
                        vals.update({
                            'f_working_holiday': True
                        })
                    if status == 'retired':
                        vals.update({
                            'f_retired': True
                        })
                    if status == 'unemployed':
                        vals.update({
                            'f_unemployed': True
                        })
                    if status == 'backpacker':
                        vals.update({
                            'f_backpacker': True
                        })
                    if status == 'student':
                        vals.update({
                            'f_student': True
                        })
            if 'find_lifestyle' in find_place_dict and find_place_dict.get('find_lifestyle'):
                for lifestyle_status in find_place_dict.get('find_lifestyle'):
                    if lifestyle_status == 'pets':
                        vals.update({
                            'fpets' : True
                        })
                    if lifestyle_status == 'smoker':
                        vals.update({
                            'fsmoker': True
                        })
                    if lifestyle_status == 'lgbti':
                        vals.update({
                            'flgbti': True
                        })
                    if lifestyle_status == 'children':
                        vals.update({
                            'fchildren': True
                        })

            if 'about_you' in find_place_dict and find_place_dict.get('about_you'):
                about_you=find_place_dict.get('about_you')
                if 'place_for' in about_you and about_you.get('place_for'):
                        vals.update({
                            'place_for' : about_you.get('place_for')
                        })


            vals.update({'listing_type':'find',
                         'user_id':request.env.user.id
                         })


        if vals:
            print('\n\n\n Final Find Place Vals :',vals,'\n\n')
            print('--------------------------------------------------------------')
            new_flat_mate_id =  flat_mates_obj.sudo().create(vals)
            find_proprty_created = True
            request.session['new_listing_id'] = new_flat_mate_id.id
            if new_flat_mate_id:
                find_proprty_created = True

            print('Newly Created Object :',new_flat_mate_id)

            flatmate_line_obj = request.env['about.rooms']
            line_dict = {}
            if 'find_room_furnishing' in find_place_dict and find_place_dict.get('find_room_furnishing'):
                line_dict.update({
                    'room_furnishing_id':int(find_place_dict.get('find_room_furnishing'))
                })
            if 'find_bathroom_type' in find_place_dict and find_place_dict.get('find_bathroom_type'):
                line_dict.update({
                    'bath_room_type_id':int(find_place_dict.get('find_bathroom_type'))
                })
            line_dict.update({
                'flatmate_id': new_flat_mate_id.id
            })

            if line_dict:
                print('++++++++++++++++++++ Line Dict ++++++++++++++++\n\n', line_dict)
                new_line_id = flatmate_line_obj.sudo().create(line_dict)
                print('+++++++++++++++++ New Line Id ::: ', new_line_id)

            # image_line_obj = request.env['property.image']
            # image_dict = {}
            # if 'usre_image' in find_place_data and find_place_data('user_image'):
            #     user_data = base64.encodestring(find_place_data.get('user_image').read())
            #     image_dict.update({'image': user_data,'flat_mates_id':new_flat_mate_id.id})
            # if image_dict:
            #     new_image_id= image_line_obj.sudo().create(image_dict)
            #     print("fgfgfgkjdszgbjhfsdgjh",new_image_id)

            if 'suburbs' in find_place_dict and find_place_dict.get('suburbs') :
                    self.create_suburbs_line(new_flat_mate_id,find_place_dict.get('suburbs'))

            if about_you :
                about_list = about_you.get('record')
                for data in about_list:
                    person_line_obj = request.env['about.person']
                    person_line_dict = {}
                    if 'name' in data and data.get('name'):
                        person_line_dict.update({
                            'name': data.get('name')
                        })
                    if 'age' in data and data.get('age'):
                        person_line_dict.update({
                            'age': int(data.get('age'))
                        })
                    if 'gender' in data and data.get('gender'):
                        person_line_dict.update({
                            'gender': data.get('gender')
                        })
                    person_line_dict.update({
                        'housemate_id': new_flat_mate_id.id
                    })

                    if person_line_dict:
                        new_line_id = person_line_obj.sudo().create(person_line_dict)
                        print('++++++++person_line_obj+++++++++ New Line Id ::: ', new_line_id)


                    print ("Record--------------------------",about_list[0])
                    if 'user_image' in about_list[0] and about_list[0].get('user_image'):
                        images = self.create_property_images(about_list[0].get('user_image'), new_flat_mate_id)

                        if images:
                            new_flat_mate_id.write({
                                'property_image_ids': [(6, 0, images)]
                            })

        if find_proprty_created:
            result = {'new_flatmate_id':new_flat_mate_id.id}
        else:
            result = {}

        return result

    def create_suburbs_line(self, house_mate_id, suburbs):

        for rec in suburbs:
            for data in suburb_data:
                # print("HHHHHHHHHHHHHHHHHHHHH", data, suburbs)
                if data['longitude'] == rec['longitude']:
                    vals = {}
                    vals ={
                        'housemate_id' : house_mate_id.id,
                        'subrub_name' : data['suburb_name'],
                        'city' : data['city'],
                        'state' : data['state'],
                        'post_code' : data['post_code'],
                        'latitude' : data['latitude'],
                        'longitude' : data['longitude']
                    }
                    request.env['find.suburbs'].sudo().create(vals)



    @http.route(['/list_place_preview<id>'], type='http', auth="public", website=True, csrf=False)
    def list_place_preview(self,id, **kwargs):
        print('\n\n----------------------------------------------------------------------\n')
        print('Kwargs : ', kwargs)

        values = {}

        property = None
        print('\n\nRequest session :\n ',request.session,'\n\n\n')

        # if 'id' in kwargs and kwargs.get('id'):
        #     property = request.env['house.mates'].browse(int(kwargs.get('id')))

        if id:
            property = request.env['house.mates'].sudo().browse(int(id))

        elif request.session.get('new_listing_id'):
            new_listing_id = request.session.get('new_listing_id')

            property = request.env['house.mates'].sudo().browse(int(new_listing_id))

        if property:
            print('\n\nRequest session :\n ', property, '\n\n\n')
            if property.street:
                property_address = property.street
            else:
                property_address = ''

            if property.street2:
                property_address = property.street2
            if property.street3:
                property_address += ', ' + property.street3
            if property.city:
                property_address += ', ' + property.city
            print('\n\n $$$ Propert Address : ',property_address,'\n\n')
            values = {'property': property, 'property_address': property_address, 'street': property.street,
                      'street2': property.street2, 'city': property.city,'state':property.state}
            if property.listing_type == 'list':
                values.update({'listing_type': 'List'})
            if property.listing_type == 'find':
                values.update({'listing_type': 'Find'})
            if property.user_id:
                values.update({'user_name': property.user_id.name})
            if property.user_id:
                values.update({'user_id': property.user_id})
            if property.total_bedrooms_id.name:
                values.update({'total_bedrooms': property.total_bedrooms_id.name})
            if property.total_bathrooms_id.name:
                values.update({'total_bathrooms': property.total_bathrooms_id.name})
            if property.total_no_flatmates_id.name:
                values.update({'total_no_flatmates': property.total_no_flatmates_id.name})
            if property.type == 'house':
                values.update({'listing_type': 'House'})
            if property.type == 'flat':
                values.update({'listing_type': 'Flat'})
            # if property.description_about_property:
            #     # property_des=property.description_about_property
            #     # new_property_des=property_des.replace('\n','<br/>')
            #     values.update({'description_about_property': property.description_about_property})
            # if property.description_about_user:
            #     values.update({'description_about_user': property.description_about_user})

            if property.backpackers == True:
                values.update({'property_new': 'property preferences'})
                values.update(({'backpackers': 'Backpackers'}))
            if property.smokers == True:
                values.update({'property_new': 'property preferences'})
                values.update({'smokers': 'Smokers'})
            if property.fourty_year_old == True:
                values.update({'property_new': 'property preferences'})
                values.update({'fourty_year_old': '40+ years olds'})
            if property.pets == True:
                values.update({'property_new': 'property preferences'})
                values.update({'pets': 'Pets'})
            if property.on_welfare == True:
                values.update({'property_new': 'property preferences'})
                values.update({'on_welfare': 'On welfare'})
            if property.students == True:
                values.update({'property_new': 'property preferences'})
                values.update(({'students': 'Students'}))
            if property.LGBTI == True:
                values.update({'property_new': 'property preferences'})
                values.update({'LGBTI': 'LGBTI'})
            if property.children == True:
                values.update({'property_new': 'property preferences'})
                values.update({'children': 'Children'})
            if property.retirees == True:
                values.update({'property_new': 'property preferences'})
                values.update({'retirees': 'Retirees'})
            if property.min_len_stay_id:
                values.update({'min_len_stay_id': property.min_len_stay_id.id})
                values.update({'min_len_stay_name': property.min_len_stay_id.name})
            if property.avil_date:
                date_string = str(property.avil_date)
                new_date = datetime.strptime(date_string, '%Y-%m-%d')
                available_date = datetime.strftime(new_date, '%d %b %G')
                values.update({'avil_date': available_date})
            if property.weekly_budget:
                values.update({'weekly_budget': int(property.weekly_budget)})
            if property.bond_id:
                values.update({'bond_id': int(property.weekly_budget * property.bond_id.number_of_week)})
            if property.bill_id:
                values.update({'bill_id': property.bill_id.name})
            print(property.parking_id.name)
            if property.parking_id:
                values.update({'parking_id': property.parking_id.name})
            if property.pref:
                value_key = property.selection_value(property.pref)
                print("=====kAHSfdjsaD====", value_key)
                values.update({'pref': property.pref})
            if property.person_ids:
                if property.person_ids[0].age:
                    values.update({'age': property.person_ids[0].age})
                if property.person_ids[0].gender:
                    values.update({'gender': property.person_ids[0].gender})
            if property.max_len_stay_id:
                values.update({'stay_lenget': property.max_len_stay_id.name})

            if property.f_full_time == True:
                values.update({'f_full_time': 'Working Full time'})
            if property.f_part_time == True:
                values.update({'f_part_time': 'Working Part Time'})
            if property.f_working_holiday == True:
                values.update({'f_working_holiday': 'Working Holiday'})
            if property.f_retired == True:
                values.update({'f_retired': 'Retired'})
            if property.f_unemployed == True:
                values.update({'f_unemployed': 'Unemployed'})
            if property.f_backpacker == True:
                values.update({'f_backpacker': 'Backpacker'})
            if property.f_student == True:
                values.update({'f_student': 'Student'})

            if property.rooms_ids:
                if property.rooms_ids[0].room_furnishing_id:
                    values.update({'room_furnishing_id': property.rooms_ids[0].room_furnishing_id.name})
                if property.rooms_ids[0].bath_room_type_id:
                    values.update({'bath_room_type_id': property.rooms_ids[0].bath_room_type_id.name})
                if property.rooms_ids[0].room_type_id:
                    values.update({'room_type_id': property.rooms_ids[0].room_type_id.name})

            if property.internet_id:
                values.update({'internet_id': property.internet_id.name})
            if property.property_type:
                values.update({'accomodation_type': property.property_type})

            # if request.session.get('new_listing_id'):
            #     request.session['new_listing_id'] = ''

            matches = request.env['house.mates'].sudo().search([('id','!=',property.id),('listing_type','=','find'),'|',('suburbs_ids.city','=',property.city),('suburbs_ids.post_code','=',property.zip)])
            print('\n\nMATCHES :\n',matches,'\n\n')
            if matches:
                values.update({
                    'matches':matches
                })

            last_login = self.get_last_login_date(property.user_id)
            print('\n\n======== last login :: ', last_login)
            if last_login:
                values.update({'last_login': last_login})

        if property:
            print("\n\n\n===== <<<<< Values >>>====\n", values, '\n\n\n')

            return request.render("pragtech_housemates.list_place_preview_template", values)

    ##################################################################
    # --------------  End of Routes for list my place -------------- #
    ##################################################################

    ###########################################################
    # --------------  Routes for find my place -------------- #
    ###########################################################

    @http.route(['/find-place/describe-your-ideal-place/start'], type='http', auth="public", website=True, csrf=True)
    def find_place_start(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_place", )

    @http.route(['/find-place/describe-your-ideal-place/accommodation'], type='http', auth="public", website=True,
                csrf=False)
    def find_place_accommodation(self, **kwargs):
        is_user_public = request.env.user.has_group('base.group_public')
        property_type=request.env['property.type'].sudo().search([])

        values={}
        for property_type in property_type:
            if property_type.property_type=='Rooms in an existing share house':
                values.update({'rooms_in_existing_share_house':'Rooms in an existing share house'})
            if property_type.property_type=='Whole property for rent':
                values.update({'whole_property':'Whole property for rent'})
            if property_type.property_type == 'Student accommodation':
                values.update({'student_accommodation': 'Student accommodation'})
            if property_type.property_type == 'Homestay':
                values.update({'homestay': 'Homestay'})
            if property_type.property_type == 'Shared Room':
                values.update({'shared_room': 'Shared Room'})
            if property_type.property_type == '2+ bedrooms	':
                values.update({'two_pluse_bedrooms': '2+ bedrooms'})
            if property_type.property_type == 'One Bed Flat':
                values.update({'one_bed_flat': 'One Bed Flat'})
            if property_type.property_type == 'Studio':
                values.update({'studio': 'Studio'})
            if property_type.property_type == 'Granny Flats':
                values.update({'granny_flat': 'Granny Flats'})
        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_place_accommodation",values)

    @http.route(['/find-place/describe-your-ideal-place/about-flatmates'], type='http', auth="public", website=True,
                csrf=False)
    def find_place_about_flatmates(self, **kwargs):
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_about_template", )

    @http.route(['/find-place/describe-your-ideal-place/rent-timing'], type='http', auth="public", website=True,
                csrf=False)
    def find_rent_timing(self, **kwargs):
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            max_len_stay_ids = request.env['minimum.length.stay'].sudo().search([])
            data = {
                    'max_len_stay_ids': max_len_stay_ids,
                   }
            return request.render("pragtech_housemates.find_rent_timimg", data )

    @http.route(['/find-place/describe-your-ideal-place/property-preferences'], type='http', auth="public",
                website=True, csrf=False)
    def find_property_preferences(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            room_furnishing = request.env['room.furnishing'].sudo().search([('view_for','=','Find')])
            bathroom_types = request.env['bathroom.types'].sudo().search([('view_for','=','Find')])
            internet = request.env['internet'].sudo().search([('view_for','=','Find')])
            parking = request.env['parking'].sudo().search([('view_for','=','Find')])
            no_of_flatmates = request.env['total.flatmates'].sudo().search([('view_for', '=', 'Find')])
            data = {'room_furnishings': room_furnishing, 'bathroom_types': bathroom_types, 'internet': internet, 'parking':parking, 'no_of_flatmates':no_of_flatmates}

            return request.render("pragtech_housemates.find_property_preferences", data )

    @http.route(['/find-place/describe-your-ideal-place/introduce-yourself'], type='http', auth="public", website=True,
                csrf=False)
    def find_introduce_yourself(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_introduce_yourself", )

    @http.route(['/find-place/describe-your-ideal-place/introduce-flatmates'], type='http', auth="public", website=True,
                csrf=False)
    def find_introduce_flatmates(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_introduce_flatmates", )

    @http.route(['/find-place/describe-your-ideal-place/employment'], type='http', auth="public", website=True,
                csrf=False)
    def find_employment(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_employment", )

    @http.route(['/find-place/describe-your-ideal-place/lifestyle'], type='http', auth="public", website=True,
                csrf=False)
    def find_lifestyle(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_lifestyle", )

    @http.route(['/find-place/describe-your-ideal-place/about-yourself'], type='http', auth="public", website=True,
                csrf=False)
    def find_about_yourself(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_housemates.find_about_yourself", )

    @http.route(['/find_place_preview<id>'], type='http', auth="public", website=True, csrf=False)
    def find_place_preview(self,id, **kwargs):
        values = {}

        property = None
        print("\n\npppppppppp--------------ppppppppppppppp", request.uid)

        if 'id' in kwargs and kwargs.get('id'):
            property = request.env['house.mates'].sudo().browse(int(kwargs.get('id')))

        if id:
            property = request.env['house.mates'].sudo().browse(int(id))

        elif request.session.get('new_listing_id'):
            new_listing_id = request.session.get('new_listing_id')

            property = request.env['house.mates'].sudo().browse(int(new_listing_id))

        if property:
            if property.street:
                property_address = property.street
            else:
                property_address = ''

            if property.street2:
                property_address = property.street2
            if property.city:
                property_address += ', ' + property.city

            values = {'property': property, 'property_address': property_address, 'street': property.street,
                      'street2': property.street2, 'city': property.city,'state':property.state}
            if property.listing_type == 'list':
                values.update({'listing_type': 'List'})
            if property.listing_type == 'find':
                values.update({'listing_type': 'Find'})
                if property.description_about_property:
                    values.update({'description_about_property': property.description_about_property})
            if property.user_id:
                values.update({'user_name': property.user_id.name})
            if property.user_id:
                values.update({'user_id': property.user_id})
            if property.total_bedrooms_id.name:
                values.update({'total_bedrooms': property.total_bedrooms_id.name})
            if property.total_bathrooms_id.name:
                values.update({'total_bathrooms': property.total_bathrooms_id.name})
            if property.total_no_flatmates_id.name:
                values.update({'total_no_flatmates': property.total_no_flatmates_id.name})
            if property.type == 'house':
                values.update({'listing_type': 'House'})
            if property.type == 'flat':
                values.update({'listing_type': 'Flat'})

            if property.backpackers == True:
                values.update({'property_new': 'property preferences'})
                values.update(({'backpackers': 'Backpackers'}))
            if property.smokers == True:
                values.update({'property_new': 'property preferences'})
                values.update({'smokers': 'Smokers'})
            if property.fourty_year_old == True:
                values.update({'property_new': 'property preferences'})
                values.update({'fourty_year_old': '40+ years olds'})
            if property.pets == True:
                values.update({'property_new': 'property preferences'})
                values.update({'pets': 'Pets'})
            if property.on_welfare == True:
                values.update({'property_new': 'property preferences'})
                values.update({'on_welfare': 'On welfare'})
            if property.students == True:
                values.update({'property_new': 'property preferences'})
                values.update(({'students': 'Students'}))
            if property.LGBTI == True:
                values.update({'property_new': 'property preferences'})
                values.update({'LGBTI': 'LGBTI'})
            if property.children == True:
                values.update({'property_new': 'property preferences'})
                values.update({'children': 'Children'})
            if property.retirees == True:
                values.update({'property_new': 'property preferences'})
                values.update({'retirees': 'Retirees'})
            if property.min_len_stay_id:
                values.update({'min_len_stay_id': property.min_len_stay_id.name})
            if property.avil_date:
                date_string = str(property.avil_date)
                new_date = datetime.strptime(date_string, '%Y-%m-%d')
                available_date = datetime.strftime(new_date, '%d %b %G')
                values.update({'avil_date': available_date})
            if property.weekly_budget:
                values.update({'weekly_budget': property.weekly_budget})
            if property.bond_id:
                values.update({'bond_id': property.weekly_budget * property.bond_id.number_of_week})
            if property.bill_id:
                values.update({'bill_id': property.bill_id.name})
            print(property.parking_id.name)
            if property.parking_id:
                values.update({'parking_id': property.parking_id.name})
            if property.pref:
                value_key = property.selection_value(property.pref)
                print("=====kAHSfdjsaD====", value_key)
                values.update({'pref': property.pref})
            if property.person_ids:
                if property.person_ids[0].age:
                    values.update({'age': property.person_ids[0].age})
                if property.person_ids[0].gender:
                    values.update({'gender': property.person_ids[0].gender})
            if property.max_len_stay_id:
                values.update({'stay_lenget': property.max_len_stay_id.name})

            if property.f_full_time == True:
                values.update({'f_full_time': 'Working Full time'})
            if property.f_part_time == True:
                values.update({'f_part_time': 'Working Part Time'})
            if property.f_working_holiday == True:
                values.update({'f_working_holiday': 'Working Holiday'})
            if property.f_retired == True:
                values.update({'f_retired': 'Retired'})
            if property.f_unemployed == True:
                values.update({'f_unemployed': 'Unemployed'})
            if property.f_backpacker == True:
                values.update({'f_backpacker': 'Backpacker'})
            if property.f_student == True:
                values.update({'f_student': 'Student'})
            if property.fsmoker == True:
                values.update({'fsmoker': 'Smoker'})
            if property.flgbti == True:
                values.update({'flgbti': 'LGBTI+'})
            if property.fpets == True:
                values.update({'fpets': 'Pets'})
            if property.fchildren == True:
                values.update({'fchildren': 'Children'})

            if property.rooms_ids:
                if property.rooms_ids[0].room_furnishing_id:
                    values.update({'room_furnishing_id': property.rooms_ids[0].room_furnishing_id.name})
                if property.rooms_ids[0].bath_room_type_id:
                    values.update({'bath_room_type_id': property.rooms_ids[0].bath_room_type_id.name})
                if property.rooms_ids[0].room_type_id:
                    values.update({'room_type_id': property.rooms_ids[0].room_type_id.name})

            if property.internet_id:
                values.update({'internet_id': property.internet_id.name})
            if property.property_type:
                values.update({'accomodation_type': property.property_type})
            print("\n\n\n===== <<<<< Values >>>====\n", values, '\n\n\n')

            # print('CITY \n\n : ',property.suburbs_ids.city)

            matches = request.env['house.mates'].sudo().search([('id', '!=', property.id), ('listing_type', '=', 'list')])
                                                                # '|',('city', '=', property.suburb_ids.city), ('zip', '=',property.suburbs_ids.post_code)])

            print('match searches : ',matches)

            if matches:
                matches_list = []
                for match in matches:
                    for suburb in property.suburbs_ids:
                        if suburb.city == match.city:
                            matches_list.append(match)
                            break

                print('\n\nMATCH LIST :\n', matches_list, '\n\n')

                if matches_list:
                    values.update({
                        'matches': matches_list
                    })

            last_login = self.get_last_login_date(property.user_id)
            print('\n\n======== last login :: ', last_login)
            if last_login:
                values.update({'last_login': last_login})

            # if request.session.get('new_listing_id'):
            #     request.session['new_listing_id'] = ''

        return request.render("pragtech_housemates.find_place_preview_template", values)


    ##################################################################
    # --------------  End of Routes for find my place -------------- #
    ##################################################################

    ###########################################################
    # --------------  Routes for info -------------- #
    ###########################################################

    # @http.route([
    #     '/web_editor/font_to_img/<icon>',
    #     '/web_editor/font_to_img/<icon>/<color>',
    #     '/web_editor/font_to_img/<icon>/<color>/<int:size>',
    #     '/web_editor/font_to_img/<icon>/<color>/<int:size>/<int:alpha>',
    #     ], type='http', auth="none")

    @http.route(['/messages'], type='http', auth="public", website=True, csrf=True)
    def messages(self, **kwargs):
        print('\n\n\n +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')
        msg_hstry_obj = request.env['messages.history']
        current_user = request.uid
        value = {}
        unread_msg_count = 0
        user_records = msg_hstry_obj.sudo().search(['|',('msg_from', '=', current_user),('msg_to','=',current_user)])

        last_login = []
        chats_with = []
        for rec in user_records:
            if rec.msg_from.id == current_user:
                if rec.msg_to not in chats_with:
                    chats_with.append(rec.msg_to)
                    last_login_date = self.get_last_login_date(rec.msg_to)
                    last_message = self.get_last_message(rec.msg_to)
                    if last_login_date:
                        detail_dict = {'id':rec.msg_to.id,'login_date':last_login_date,'last_message':last_message if last_message else ""}
                        last_login.append(detail_dict)
            elif rec.msg_to.id == current_user:
                if rec.msg_from not in chats_with:
                    chats_with.append(rec.msg_from)
                    last_login_date = self.get_last_login_date(rec.msg_from)
                    last_message = self.get_last_message(rec.msg_from)
                    if last_login_date:
                        detail_dict = {'id':rec.msg_from.id,'login_date':last_login_date,'last_message':last_message if last_message else ""}
                        last_login.append(detail_dict)

        unread_msg = msg_hstry_obj.sudo().search([('msg_to','=',current_user),('is_seen','=',False)])

        if unread_msg:
            unread_msg_count = len(unread_msg)

        if chats_with:
            value = { 'chats_with':chats_with,'last_login':last_login,'unread_msg_count':unread_msg_count}
        print('CHats with : ',chats_with,value,'++++++++++++++++++++++++++++++++++++++++++++++\n\n\n\n')
        print('last login dict : ',last_login)

        return request.render("pragtech_housemates.messages_template",value)

    def get_last_message(self,chat_user):
        current_user = request.uid
        new_msg = ''
        new_msg = request.env['messages.history'].sudo().search([('msg_to','=',current_user),('msg_from','=',chat_user.id),('is_seen','=',False)],)

        if new_msg:
            return new_msg[0].message





    @http.route(['/get_unread_msg_count'], type='json', auth="public", website=True)
    def get_unread_msg_count(self, **kwargs):
        print('In methoddddddddddddddddddddddddddddd')
        unread_msg_count = 0
        msg_hstry_obj = request.env['messages.history']
        current_user = request.uid
        value = {}

        unread_msg = msg_hstry_obj.sudo().search([('msg_to', '=', current_user), ('is_seen', '=', False)])

        if unread_msg:
            unread_msg_count = len(unread_msg)
            value.update({'unread_msg_count':unread_msg_count})
        else:
            value.update({'unread_msg_count': 0})
        print("\n\nUnread msg count :",unread_msg_count,'\n\n')

        return value

    def get_last_login_date(self,user_id):
        print('User ID: ',user_id)
        login = ''
        if user_id:
            # print('User name: ',user_id,user_id.name)
            login_detail_id = request.env['login.detail'].sudo().search([('user_id','=',int(user_id.id))],order='id desc')

            if login_detail_id:

                last_login_date = (login_detail_id[0].date_time).date()

                if last_login_date == date.today():
                    login = "Online Today"
                    print('TRueeeeeeeeeeeeeeeeee')
                else:
                    # diff = date.today()-last_login_date
                    # days = diff.days
                    today_date = datetime.now()
                    last_login_date = login_detail_id[0].date_time

                    difference = relativedelta.relativedelta(today_date,last_login_date)
                    years = difference.years
                    months = difference.months
                    days = difference.days

                    if years and years != 0:
                        login = "Online about {} years ago".format(years)
                    elif months and months != 0:
                        login = "Online {} months ago".format(months)
                    elif days and days != 0:
                        login = "Online {} days ago".format(days)

                    print('Falseeeeeeeeeeeeeeeeeeee',login)
                # login ="Online {} days ago".format(days)

        return login

    def _get_datetime_based_timezone(self,msg_time):
        dt = False
        if msg_time:
            timezone = pytz.timezone(request.env['res.users'].
                                     sudo().browse([int(2)]).tz or 'UTC')
            print('TIMEZONE  ',timezone)
            dt = pytz.UTC.localize(msg_time)
            dt = dt.astimezone(timezone)
            dt = ustr(dt).split('+')[0]
            print('\n\ndt ::: ',dt,'\n\n')

        return dt

    @http.route(['/get_msg_history'], type='json', auth="public", website=True)
    def get_msg_history(self, **kwargs):
        print('\n\n get_msg_history :',kwargs,'\n\n\n')
        msg_history_list = []
        if kwargs:
            if kwargs.get("selected_user"):
                selected_user = request.env['res.users'].sudo().browse(int(kwargs.get("selected_user")))

                msg_history = request.env['messages.history'].sudo().search([('msg_from','in',[request.uid,int(kwargs.get("selected_user"))]),('msg_to','in',[request.uid,int(kwargs.get("selected_user"))])])

                if msg_history:
                    for msg in msg_history:
                        print("MSG TIME IN DB :",msg.msg_time)
                        formated_time = self._get_datetime_based_timezone(msg.msg_time)
                        mobile_number = selected_user.partner_id.mobile
                        mobile=mobile_number[:7]+"***"
                        print("Formated Time :",formated_time,mobile)
                        formated_time = fields.Datetime.from_string(formated_time)
                        msg_time = formated_time.strftime("%d %B %H:%M %p")


                        msg_dict = {
                            'message':msg.message,
                            'time':msg_time,
                            'char_user_name':selected_user.name,
                            'chat_user_id':selected_user.id,
                            'mobile_number':mobile,
                            'image':selected_user.image,
                            'property_id':msg.property_id.id
                        }
                        if msg.msg_from.id == request.uid:
                            msg_dict.update({'from':True,
                                             'is_seen':True if msg.is_seen else False,
                                             })

                        else:
                            msg_dict.update({'from':False})
                            msg.sudo().write({'is_seen':True})

                        if selected_user.id in request.env.user.block_user_ids.ids:
                            msg_dict.update({'is_blocked': True})
                        else:
                            msg_dict.update({'is_blocked': False})

                        unread_msg = request.env['messages.history'].sudo().search([('msg_to', '=',request.uid ), ('is_seen', '=', False)])
                        print("-------- Unread Msg cont ----------- ",len(unread_msg))

                        if unread_msg:
                            unread_msg_count = len(unread_msg)
                            msg_dict.update({'unread_msg_count': unread_msg_count})
                        else:
                            msg_dict.update({'unread_msg_count': 0})

                        msg_history_list.append(msg_dict)

        # print('Message History List : ',msg_history_list,'\n\n')
        if msg_history_list:
            return msg_history_list

        return False

    #message from preview page
    @http.route('/save_msg_in_db', auth='public', type='json', website=True)
    def save_msg_in_db(self, **kwargs):
        print('\n\n++++++++++++++++++++++++++ : ',kwargs,'\n\n\n')
        chat_user = request.env["res.users"].sudo().browse(int(kwargs.get('property_owner')))

        msg_hstry_obj = request.env['messages.history']

        if chat_user.block_user_ids:
            if request.uid in chat_user.block_user_ids.ids:
                return False

        if kwargs:
            new_msg_history_id = msg_hstry_obj.sudo().create({
                'msg_from':request.env.user.id,
                'msg_to':kwargs.get('property_owner'),
                'message':kwargs.get('message'),
                'msg_time':datetime.now(),
                'property_id':kwargs.get('property_id')
            })

            if new_msg_history_id:
                return True
            else:
                return  False

        return False

    #message from Message Page(Chat Box)
    @http.route('/save_msg_in_database', auth='public', type='json', website=True)
    def save_msg_in_database(self, **kwargs):
        print('\n\n+++++++++++++++++ save_msg_in_database +++++++++ : ', kwargs,request.env.user, '\n\n\n')
        chat_user = request.env["res.users"].sudo().browse(int(kwargs.get('chat_user_id')))

        msg_hstry_obj = request.env['messages.history']
        value = {}
        if chat_user.block_user_ids:
            if request.uid in chat_user.block_user_ids.ids:
                return value

        if kwargs:

            new_msg_history_id = msg_hstry_obj.sudo().create({
                'msg_from': request.env.user.id,
                'msg_to': int(kwargs.get('chat_user_id')),
                'message': kwargs.get('message'),
                'msg_time': datetime.now(),
            })

            if new_msg_history_id:
                formated_time = self._get_datetime_based_timezone(new_msg_history_id.msg_time)
                formated_time = fields.Datetime.from_string(formated_time)
                time = formated_time.strftime("%d %B %H:%M %p")

                value =  {
                   'message': new_msg_history_id.message,
                   'time':time,
                   'from':True,
                }
        print("msg time : ",new_msg_history_id.msg_time.strftime("%d %B %H:%M %p"))

        print('values : ',value)

        return value


    @http.route('/delete_conversation', auth='public', type='json', website=True)
    def delete_conversation(self, **kwargs):
        print('Delete Conversation >>>>>>> ',kwargs)
        msg_hstry_obj = request.env['messages.history']
        current_user = request.uid
        all_conversations = request.env['messages.history'].sudo().search(
            [('msg_from', 'in', [current_user, int(kwargs.get("chat_user_id"))]),
             ('msg_to', 'in', [current_user, int(kwargs.get("chat_user_id"))])])

        print("\n\n\nAll conversatios ::: ",all_conversations,len(all_conversations),'\n\n\n')
        if all_conversations:
            for conversation in all_conversations:
                conversation.sudo().unlink()

            return True

        else:
            return False



    @http.route('/block_this_member', auth='public', type='json', website=True)
    def block_this_member(self, **kwargs):
        print('\n\n\n BLOCK USER :',kwargs,'\n\n\n')
        block_user_id = None
        current_user_id = request.env['res.users'].sudo().browse(request.uid)
        if kwargs.get("chat_user_id"):
            block_user_id = int(kwargs.get("chat_user_id"))
        print('Crret user >>> ',current_user_id)
        if current_user_id and block_user_id:
            current_user_id.sudo().write({'block_user_ids':[(4, block_user_id)]})

        return True

    @http.route('/unblock_this_member', auth='public', type='json', website=True)
    def unblock_this_member(self, **kwargs):
        block_user_id = None
        current_user_id = request.env['res.users'].sudo().browse(request.uid)
        if kwargs.get("chat_user_id"):
            block_user_id = int(kwargs.get("chat_user_id"))
        if current_user_id and block_user_id:
            current_user_id.sudo().write({'block_user_ids': [(3, block_user_id)]})


        return True



    @http.route('/submit_feedback', auth='public', type='json', website=True)
    def submit_feedback(self, **kwargs):
        print('\n\n\nsubmit !!!!!!!!!!!!!!!!!!!!!!!!!!!!',kwargs,'\n\n')
        vals = {}

        vals.update({'report_from':request.uid,
                     'user_id':2
                     })

        if kwargs.get("chat_user_id"):
            vals.update({'about_user':int(kwargs.get("chat_user_id"))})

        if kwargs.get("feedback_category"):
            if kwargs.get("feedback_category") == "no_longer_available":
                vals.update({'feedback_category':'no_longer_available'})

            if kwargs.get("feedback_category") == "incorrect_information":
                vals.update({'feedback_category':'incorrect_information'})

            if kwargs.get("feedback_category") == "suspected_scammer":
                vals.update({'feedback_category':'suspected_scammer'})

            if kwargs.get("feedback_category") == "offensive_content":
                vals.update({'feedback_category':'offensive_content'})

            if kwargs.get("feedback_category") == "contact_information":
                vals.update({'feedback_category':'contact_information'})

            if kwargs.get("feedback_category") == "copyright_material":
                vals.update({'feedback_category':'copyright_material'})

            if kwargs.get("feedback_category") == "bug":
                vals.update({'feedback_category':'bug'})

            if kwargs.get("feedback_category") == "spam":
                vals.update({'feedback_category':'spam'})

        if kwargs.get("feedback_detail"):
            vals.update({'feedback_detail': kwargs.get("feedback_detail") })


        if vals:
            print('Valss: ',vals)
            member_report_obj = request.env['member.report'].sudo().create(vals)
        return  True



    @http.route(['/info'], type='http', auth="public", website=True, csrf=True)
    def info(self, **kwargs):

        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        print('\n\n\n===================================================\n\n')
        print('BLOGS :',BlogPost)
        print('\n\n\n===================================================\n\n')

        values = {
            'blog_posts1':BlogPost,
        }

        return request.render("pragtech_housemates.info_template",values)

    @http.route(['/info/flatmate-inspections'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_inspection(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_flatmate_inspection",values)

    @http.route(['/info/home-share-melbourne'], type='http', auth="public", website=True, csrf=True)
    def info_home_share_melbourne(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_home_share_melbourne",values)

    @http.route(['/info/message-response-rate'], type='http', auth="public", website=True, csrf=True)
    def info_message_response_rate(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_message_response_rate",values)

    @http.route(['/info/verification'], type='http', auth="public", website=True, csrf=True)
    def info_verification(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_verification",values)

    @http.route(['/info/frequently-asked-questions'], type='http', auth="public", website=True, csrf=True)
    def info_frequently_asked_questions(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_frequently_asked_questions",values)

    @http.route(['/info/why-upgrade'], type='http', auth="public", website=True, csrf=True)
    def info_why_upgrade(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_why_upgrade",values)

    @http.route(['/info/how-does-it-work'], type='http', auth="public", website=True, csrf=True)
    def info_how_does_it_work(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_how_does_it_work",values)

    @http.route(['/info/find-share-accommodation'], type='http', auth="public", website=True, csrf=True)
    def info_find_share_accommodation(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_find_share_accommodation",values)

    @http.route(['/info/rent-your-spare-room'], type='http', auth="public", website=True, csrf=True)
    def info_rent_your_spare_room(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_rent_your_spare_room",values)

    @http.route(['/info/teamups'], type='http', auth="public", website=True, csrf=True)
    def info_teamups(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_teamups",values)

    @http.route(['/info/how-to-contact'], type='http', auth="public", website=True, csrf=True)
    def info_how_to_contact(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_how_to_contact",values)

    @http.route(['/value-my-room'], type='http', auth="public", website=True, csrf=True)
    def info_value_my_room(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_value_my_room",values)

    @http.route(['/info/legal-introduction'], type='http', auth="public", website=True, csrf=True)
    def info_legal_introduction(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_legal_introduction",values)

    @http.route(['/info/holding-deposits'], type='http', auth="public", website=True, csrf=True)
    def info_holding_deposits(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_holding_deposits",values)

    @http.route(['/info/share-accommodation-legal-situations'], type='http', auth="public", website=True, csrf=True)
    def info_share_accommodation_legal_situations(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_share_accommodation_legal_situations",values)

    @http.route(['/info/planning-rules'], type='http', auth="public", website=True, csrf=True)
    def info_planning_rules(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_planning_rules",values)

    @http.route(['/info/pre-agreement-checklist'], type='http', auth="public", website=True, csrf=True)
    def info_pre_agreement_checklist(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_pre_agreement_checklist",values)

    @http.route(['/info/flatmate-agreement'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_agreement(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_flatmate_agreement",values)


    @http.route(['/info/bonds'], type='http', auth="public", website=True, csrf=True)
    def info_bonds(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_bonds",values)

    @http.route(['/info/condition-reports'], type='http', auth="public", website=True, csrf=True)
    def info_condition_reports(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_condition_reports",values)

    @http.route(['/info/tenancy-agreements'], type='http', auth="public", website=True, csrf=True)
    def info_tenancy_agreements(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_tenancy_agreements",values)

    @http.route(['/info/rent-payments'], type='http', auth="public", website=True, csrf=True)
    def info_rent_payments(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_rent_payments",values)

    @http.route(['/info/rights-obligations'], type='http', auth="public", website=True, csrf=True)
    def info_rights_obligations(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_rights_obligations",values)

    @http.route(['/info/ending-tenancy'], type='http', auth="public", website=True, csrf=True)
    def info_ending_tenancy(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_ending_tenancy",values)

    @http.route(['/info/resolving-disputes'], type='http', auth="public", website=True, csrf=True)
    def info_resolving_disputes(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_resolving_disputes",values)

    @http.route(['/info/about'], type='http', auth="public", website=True, csrf=True)
    def info_about(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_about",values)

    @http.route(['/info/terms'], type='http', auth="public", website=True, csrf=True)
    def info_terms(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_terms",values)

    @http.route(['/live-rent-free'], type='http', auth="public", website=True, csrf=True)
    def info_live_rent_free(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_live_rent_free",values)

    @http.route(['/info/press'], type='http', auth="public", website=True, csrf=True)
    def info_press(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_press",values)

    @http.route(['/info/community-charter'], type='http', auth="public", website=True, csrf=True)
    def info_community_charter(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_community_charter",values)

    @http.route(['/info/privacy'], type='http', auth="public", website=True, csrf=True)
    def info_privacy(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_privacy",values)

    @http.route(['/contact'], type='http', auth="public", website=True, csrf=True)
    def info_contact(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog_posts1': BlogPost,
        }
        return request.render("pragtech_housemates.info_contact",values)

    ##################################################################
    # --------------  End of Routes for info -------------- #
    ##################################################################

    ###########################################################
    # --------------  Routes for AJAX -------------- #
    ###########################################################

    @http.route('/get_aboutroom', auth='public', type='json', website=True)
    def get_aboutroom(self):
        room_types = request.env['room.types'].sudo().search_read(fields=['id', 'name'])
        room_furnishing = request.env['room.furnishing'].sudo().search_read(domain=[('view_for','=','List')],fields=['id', 'name'])
        bathroom_types = request.env['bathroom.types'].sudo().search_read(domain=[('view_for','=','List')],fields=['id', 'name'])

        print("Recordddddddddddddddddd-------", room_types)
        print("Recordddddddddddddddddd-------", room_furnishing)
        print("Recordddddddddddddddddd-------", bathroom_types)

        data = [{'room_types': room_types, 'room_furnishing': room_furnishing, 'bathroom_types': bathroom_types}]
        return data

    def list_providers_custom(self):
        try:
            providers = request.env['auth.oauth.provider'].sudo().search_read([('enabled', '=', True)])
        except Exception:
            providers = []
        for provider in providers:
            return_url = request.httprequest.url_root + 'auth_oauth/signin'
            state = self.get_state_custom(provider)
            params = dict(
                response_type='token',
                client_id=provider['client_id'],
                redirect_uri=return_url,
                scope=provider['scope'],
                state=json.dumps(state),
            )
            provider['auth_link'] = "%s?%s" % (provider['auth_endpoint'], werkzeug.url_encode(params))
        return providers

    def get_state_custom(self, provider):
        redirect = request.params.get('redirect') or 'web'
        if not redirect.startswith(('//', 'http://', 'https://')):
            redirect = '%s%s' % (request.httprequest.url_root, redirect[1:] if redirect[0] == '/' else redirect)
        state = dict(
            d=request.session.db,
            p=provider['id'],
            r=werkzeug.url_quote_plus(redirect),
        )
        token = request.params.get('token')
        if token:
            state['t'] = token
        return state

    # if type == 'google':
    #     URL2 = 'https://www.googleapis.com/oauth2/v4/token'
    #     r2 = requests.post(url=URL2, headers=headers, data=payload, verify=False)
    #     if r2.status_code == 200:
    #         temp = r2.json()
    #         updated_access_token = temp.get('access_token')
    #         # print "\n\nNew Token \n", updated_access_token
    #         self.write({'access_token': str(updated_access_token)})
    #         return 200
    #     else:
    #         return 400

    @http.route('/verification_action_social_media', auth='public', type='json', website=False)
    def get_verification_action_social_media(self):
        print ("Insideeeeeeeeeee")
        instagram = None

        base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')

        insta_url = 'https://api.instagram.com/oauth/authorize/?client_id='
        insta_client_id = request.env['ir.config_parameter'].sudo().get_param('pragtech_housemates.insta_client_id')
        insta_redirect_uri = '&redirect_uri='+base_url+'/verify_instagram_token'
        response_type = '&response_type=code'

        print('CLIKKK : ',insta_client_id)
        if insta_client_id:
            instagram = insta_url+insta_client_id+insta_redirect_uri+response_type
        mobile=request.env.user.partner_id.mobile

        facebook = "https://www.facebook.com/v3.3/dialog/oauth?client_id=578866759262786&redirect_uri=http://localhost:8023/verify_facebook_token&scope=user_link"

        linkedin = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81mgxq1r3s06ht&state=thisisthetestingofcyz&redirect_uri=http://localhost:8023/verify_token"

        return [facebook, linkedin, instagram, mobile,'']

    @http.route('/verify_<type>_token', auth='public', type='http', website=True)
    def get_social_media_token(self, type, **kwarg):
        print ("Insideeeeeeeeeee Token")

        print ("\n\nIN TOKEN-----------------------------------------------",type)
        print ("\n\n\n",kwarg)

        base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')
        res_user = request.env['res.users'].search([('id', '=', request.env.user.id)])

        print ("\n\nRES USER-----------------------------------------------", res_user.name)
        body = {}
        params = {}
        data = {}

        if type == 'instagram':
            if kwarg.get('code'):
                insta_client_id = request.env['ir.config_parameter'].sudo().get_param('pragtech_housemates.insta_client_id')
                insta_client_secret = request.env['ir.config_parameter'].sudo().get_param('pragtech_housemates.insta_client_secret')
                insta_redirect_uri = base_url + '/verify_instagram_token'

                insta_access_token_url = 'https://api.instagram.com/oauth/access_token'


                body['client_id'] = insta_client_id
                body['client_secret'] = insta_client_secret
                body['grant_type'] = 'authorization_code'
                body['redirect_uri'] = insta_redirect_uri
                body['code'] = kwarg.get('code')


                params['Content-Type'] = 'application/x-www-form-urlencoded'

                insta_profile_data = requests.post(insta_access_token_url, params=params, data=body)
                if insta_profile_data.text:
                    parsed_json = json.loads(str(insta_profile_data.text))
                    user_info = parsed_json.get('user')
                    print ("Prased JSON",user_info.get('username'))

                    data['insta_profile_url'] = 'https://www.instagram.com/'+user_info.get('username')
                    res_user.write(data)
                    return "Verification done Sucessfully. You can close this window now."
                else:
                    return "Verification Failed. Please try again later."

                return "Verification done Sucessfully. You can close this window now."
            else:
                return "Verification Cancelled. You can close this window now."
        if type == 'facebook':
            print (kwarg.get('code'))


    @http.route('/get_suburbs', auth='public', type='json', website=True)
    def get_suburbs(self, suburb_to_search, type_of_data,**kwargs) :
        records = []
        print ("data ---------------------------- ",kwargs)

        if type_of_data == "integer":
            for data in suburb_data:
                # print (" =-------------------------= ", data['post_code'] ,int(suburb_to_search))
                if data['post_code'] == int(suburb_to_search):
                    # records.append(data['suburb_search'])
                    records.append ({ "label":data['suburb_search'], "value": [data['suburb_name']+', '+str(data['post_code']), str(data['latitude']), str(data['longitude'])] })
            print (" =-------------------------= ",records)
            return records


        if type_of_data == "string":
            my_regex = "^" + suburb_to_search
            # print ("aaaaaaaaaaa", suburb_to_search)
            for data in suburb_data:
                if re.search(my_regex, data['suburb_name'], re.IGNORECASE):
                    # print ("aaaaaaaaaaa",re.search(my_regex, data['suburb_name'], re.IGNORECASE))
                    # print ("aaaaaaaaaaa",re.match(my_regex, data['suburb_name']))
                    records.append ({ "label":data['suburb_search'], "value": [data['suburb_name']+', '+str(data['post_code']), str(data['latitude']), str(data['longitude'])] })
            print (" =-------------------------= ",records)
            return records

    @http.route('/get_suburbss', auth='none',methods=['GET'])
    def get_suburbss(self, **kwargs):
        print("data ---------------------------- ", kwargs)
        records = []

        if kwargs.get('q').isdigit():
            # print('in iffffffffffffffff')
            suburb_to_search = kwargs.get('q')
            cnt = 1
            for data in suburb_data:
                # print (" =-------------------------= ", data['post_code'] ,int(suburb_to_search))
                if data['post_code'] == int(suburb_to_search):
                    cnt +=1
                    # records.append(data['suburb_search'])
                    records.append({"label": data['suburb_search'],
                                    "value": [data['suburb_name'] + ', ' + str(data['post_code']),
                                              str(data['latitude']), str(data['longitude'])]})

                    if cnt > 5:
                        break
            # print(" =-------------------------= ", records)
            return json.dumps(records)

        else:
            # print('in elseeeeeeeeeeeeeeeeee')
            suburb_to_search = kwargs.get('q')
            my_regex = "^" + suburb_to_search
            # print ("aaaaaaaaaaa", suburb_to_search)
            if kwargs.get('current_url') == "/" or kwargs.get('current_url').find("/search/records") != -1:
                for data in suburb_data:
                    if data['suburb_name'] == "" and re.search(my_regex, data['city'], re.IGNORECASE)  :
                        records.append({"label": data['suburb_search'],
                                        "value": [data['post_code'],data['latitude'],data['longitude']]})
                        break

                cnt = 2
                for data in suburb_data:
                    if data['suburb_name'] and re.search(my_regex, data['city'], re.IGNORECASE) or re.search(my_regex, data['suburb_search'], re.IGNORECASE) :
                        cnt +=1
                        # print ("aaaaaaaaaaa",re.search(my_regex, data['suburb_name'], re.IGNORECASE))
                        # print ("aaaaaaaaaaa",re.match(my_regex, data['suburb_name']))
                        records.append({"label": data['suburb_search'],
                                        "value": [data['suburb_name'] + ', ' + str(data['post_code']),
                                                  str(data['latitude']), str(data['longitude'])]})
                        if cnt > 5:
                            break
            else:
                cnt = 1
                for data in suburb_data:
                    if data['suburb_name'] and re.search(my_regex, data['city'], re.IGNORECASE) or re.search(my_regex,data['suburb_search'],re.IGNORECASE):
                        cnt += 1
                        # print ("aaaaaaaaaaa",re.search(my_regex, data['suburb_name'], re.IGNORECASE))
                        # print ("aaaaaaaaaaa",re.match(my_regex, data['suburb_name']))
                        records.append({"label": data['suburb_search'],
                                        "value": [data['suburb_name'] + ', ' + str(data['post_code']),
                                                  str(data['latitude']), str(data['longitude'])]})
                        if cnt > 5:
                            break
            print("\n\n Match Records : \n\n", records,'\n\n')
            return json.dumps(records)

    @http.route('/get_details_of_suburb', auth='none', methods=['GET'])
    def get_details_of_suburb(self, **kwargs):
        record = []
        print("get_details_of_suburb ---------------------------- ", kwargs)
        if 'suburb_label' in kwargs and kwargs.get('suburb_label'):
            suburb_label = kwargs.get('suburb_label')
            # print ("aaaaaaaaaaa", suburb_to_search)
            res_dict =  next((item for item in suburb_data if item["suburb_search"] == suburb_label),None)

            print('\n\n\nRES DICT : ',res_dict,'\n\n\n')

            return json.dumps(res_dict)

    @http.route('/add/image/data', auth='public', type='json', website=True)
    def add_image_data(self, property_id, array_of_image, filters=None):


        if filters == 'list_place':
            images = []
            print ("\n\nArray Of Image -------------- ", property_id)
            property_obj = request.env['house.mates'].sudo().search([('id', '=', property_id)])
            print ("\n\nArray Of Image -------------- ", property_obj.property_image_ids)

            if len(array_of_image)!=0:
                images = self.create_property_images(array_of_image, property_obj)
            return True

        if filters == 'find_place':
            images = []
            print ("\n\nArray Of Image -------------- ", property_id)
            property_obj = request.env['house.mates'].sudo().search([('id', '=', property_id)])
            print ("\n\nArray Of Image -------------- ", property_obj.property_image_ids)

            property_obj.property_image_ids.unlink()
            if len(array_of_image)!=0:
                images = self.create_property_images(array_of_image, property_obj)
            return True
            return True

    @http.route('/delete/image/data', auth='public', type='json', website=True)
    def delete_image_data(self, property_id, array_of_image, filters=None):

        if filters == 'list_place':
            print ("\n\nArray Of Image -------------- ", property_id)
            property_obj = request.env['house.mates'].sudo().search([('id', '=', property_id)])
            print ("Inside Deleteeeeeeeeeeeee")

            for images in property_obj.property_image_ids:
                # print ("\n\n",len(images.image.decode('ascii').strip()), len(array_of_image))
                # print (len(images.image.decode('ascii')), len(array_of_image))
                if images.image.decode('ascii').strip() == array_of_image:
                    images.unlink()
                    print ("Match found")
            return True

        if filters == 'find_place':
            # print ("\n\nArray Of Image -------------- ", property_id)
            # property_obj = request.env['house.mates'].sudo().search([('id', '=', property_id)])
            # print ("Inside Deleteeeeeeeeeeeee")
            #
            # for images in property_obj.property_image_ids:
            #     if images.image.decode('ascii').strip() == array_of_image:
            #         images.unlink()
            #         print ("Match found")
            return True



    @http.route('/get_id_of_last_record', auth='public', type='json', website=True)
    def get_id_of_last_record(self, **kwargs):
        properties = request.env['house.mates'].sudo().search([],order='id desc',limit=1)
        print("\n\n\n\nin controllar",properties)
        data={'id':properties.id}
        return data

    @http.route('/get_product', auth='public', type='json', website=True)
    def get_product(self, record_id, filters=None) :
        property_list = []
        property_data = {}
        domain = []
        properties=''
        fields = ['id', 'street2', 'city', 'listing_type', 'state', 'weekly_budget', 'suburbs_ids','description_about_property', 'property_image_ids', 'total_bathrooms_id', 'total_bedrooms_id', 'total_no_flatmates_id', 'person_ids', 'is_short_list','property_type','rooms_ids']

        print ("\n\n\n88888888888888888888",filters[0])
        print ("\n\n\n", filters[0].get('max_age'))
        if filters[0].get('listing_type') =='home':
            print ("Homeeeeeeeeeeeeeeee")

            properties = request.env['house.mates'].sudo().search_read(domain=[('id', '<', record_id),('state','=','active')], fields=fields, order='id desc', limit=12)
            print("Homeeeeeeeeeeeeeeee", properties)
        if not filters[0].get('listing_type'):
            # print ("Homeeeeeeeeeeeeeeee")
            if filters[0].get('search_city'):
                properties_list = []
                city = filters[0].get('search_city')
                # suburb_string=str(filters[0].get('suburbs%5B%5D')).replace('+',' ')
                # suburb_string2=suburb_string.replace('%2C',',')
                # suburb_list=suburb_string2.split(',')
                # properties_ids = request.env['house.mates'].sudo().search_read(domain=[('id', '>', record_id), ('state', '=', 'active'),('listing_type','=','find')])
                # for id in properties_ids:
                # properties = request.env['house.mates'].sudo().search_read(domain=[('id', '>', record_id), ('state', '=', 'active'),('listing_type','=','find'),('suburbs_ids.subrub_name','=',suburb_list[0]),('suburbs_ids.city','=',str(suburb_list[1]).strip()),('suburbs_ids.state','=',str(suburb_list[2]).strip()),('suburbs_ids.post_code','=',str(suburb_list[3]).strip())])
                properties = request.env['house.mates'].sudo().search_read(
                    domain=[('id', '<', record_id),('state', '=', 'active'),'|',('city','=',city.strip()),('suburbs_ids.city', '=', city.strip()),
                            ])
                print("\n\nProprties if Search :",len(properties), properties,'\n\n')

                # properties = request.env['house.mates'].sudo().search_read(
                # domain=[('id', '>', record_id), ('state', '=', 'active')], fields=fields, order='id', limit=16)
            elif filters[0].get('search_suburbs'):
                search_suburbs = filters[0].get('search_suburbs').replace('+',' ')
                search_suburbs = search_suburbs.replace('%2C',',')
                search_suburbs_list = search_suburbs.split(',')
                print('\n\n\nSEARCH SUBURBS : ',search_suburbs,search_suburbs_list)

                properties = request.env['house.mates'].sudo().search_read(
                    domain=[('state', '=', 'active'), '|','|','|','|', ('city', 'in',search_suburbs_list),('street3', 'in',search_suburbs_list),
                            ('street2', 'in',search_suburbs_list),('suburbs_ids.subrub_name', 'in', search_suburbs_list),('suburbs_ids.city', 'in', search_suburbs_list)
                            ])

                print("\n\nProprties else if Search :",len(properties), properties,'\n\n')


            else:
                print('goooooooooooooessssssssssssssss')
                properties = request.env['house.mates'].sudo().search_read(domain=[('id', '<', record_id),('state','=','active')], fields=fields, order='id desc', limit=12)





        domain=[('id', '<', record_id),('state','=','active')]
        if filters[0].get('listing_type') == 'find':
            # print ("Finddddddddddddddddd",filters[0])

            domain.append(('listing_type','=','find'))
            # if filters[0].get('suburbs%5B%5D'):
            #     suburb_string=str(filters[0].get('suburbs%5B%5D')).replace('+',' ')
            #     suburb_string2=suburb_string.replace('%2C',',')
            #     suburb_list=suburb_string2.split(',')
            #     domain.append(('suburbs_ids.subrub_name','=',suburb_list[0]),('suburbs_ids.city','=',str(suburb_list[1]).strip()),('suburbs_ids.state','=',str(suburb_list[2]).strip()),('suburbs_ids.post_code','=',str(suburb_list[3]).strip()))
            if filters[0].get('search_city'):
                city = filters[0].get('search_city')
                domain.append(('suburbs_ids.city', '=', city.strip()))

            if filters[0].get('search_suburbs'):
                search_suburbs = filters[0].get('search_suburbs').replace('+', ' ')
                search_suburbs = search_suburbs.replace('%2C', ',')
                search_suburbs_list = search_suburbs.split(',')
                domain.append(('|'))
                domain.append(('suburbs_ids.subrub_name', 'in', search_suburbs_list))
                domain.append(('suburbs_ids.city', 'in', search_suburbs_list))


            if filters[0].get('property_preference_location'):
                property_preference=str(filters[0].get('property_preference_location')).replace('%20',' ')
                print("\n\n------uuuu----uuuu--- ",property_preference.split(','))
                suburb_location = property_preference.split(',')
                if property_preference.lstrip():
                    domain.append(('suburbs_ids.subrub_name','=',suburb_location[0]))
            if filters[0].get('subrub_name'):
                subrub_name = str(filters[0].get('subrub_name')).replace('%20', ' ')
                if subrub_name:
                    domain.append(('suburbs_ids.subrub_name','=',subrub_name.lstrip()))


            if filters[0].get('find_min_age'):
                domain.append(('person_ids.age','>=',int(filters[0].get('find_min_age'))))
            if filters[0].get('find_max_age'):
                domain.append(('person_ids.age', '<=', int(filters[0].get('find_max_age'))))
            if filters[0].get('gender_selection'):
                if filters[0].get('gender_selection') == 'Females':
                    domain.append(('person_ids.gender', '=', 'female'))
                if filters[0].get('gender_selection') == 'Males':
                    domain.append(('person_ids.gender','=','male'))
                if filters[0].get('gender_selection') == 'Females + % 26 + males + % 28no + couple % 29':
                    # domain.append(('person_ids.gender','=','male'))
                    # domain.append(('person_ids.gender', '=', 'female'))
                    domain.append(('place_for', '!=', 'couple'))
                if filters[0].get('gender_selection') == 'Couples':
                    domain.append(('place_for','=','couple'))
            if filters[0].get('find_property_type'):
                domain.append(('property_type', '=', int(filters[0].get('find_property_type'))))
            if filters[0].get('find_min_rent'):
                domain.append(('weekly_budget', '>=', int(filters[0].get('find_min_rent'))))
            if filters[0].get('find_max_rent'):
                domain.append(('weekly_budget', '<=', int(filters[0].get('find_max_rent'))))
            if filters[0].get('find_max_stay'):
                domain.append(('max_len_stay_id', '=', int(filters[0].get('find_max_stay'))))
            if filters[0].get('flat_avail_date_id'):
                date_string=filters[0].get('flat_avail_date_id')
                date=date_string.replace('%2F','/')
                formated_date=datetime.strptime(date, '%m/%d/%Y')
                domain.append(('avil_date', '<=', formated_date))
            if filters[0].get('flgbti') == 'flgbti':
                domain.append(('flgbti','=',True))
            if filters[0].get('fchildern') == 'fchildern':
                domain.append(('fchildern','=',True))
            if filters[0].get('fpets') == 'fpets':
                domain.append(('fpets','=',True))
            if filters[0].get('fsmoker') == 'fsmoker':
                domain.append(('fsmoker','=',True))
            if filters[0].get('f_full_time') == 'f_full_time':
                domain.append(('f_full_time','=',True))
            if filters[0].get('f_part_time') == 'f_part_time':
                domain.append(('f_part_time','=',True))
            if filters[0].get('f_student') == 'f_student':
                domain.append(('f_student','=',True))
            if filters[0].get('f_backpacker') == 'f_backpacker':
                domain.append(('f_backpacker','=',True))
            if filters[0].get('f_retired') == 'f_retired':
                domain.append(('f_retired','=',True))
            if filters[0].get('f_unemployed') == 'f_unemployed':
                domain.append(('f_unemployed','=',True))
            if filters[0].get('f_working_holiday') == 'f_working_holiday':
                domain.append(('f_working_holiday','=',True))
            if filters[0].get('city'):
                domain.append(('suburbs_ids.city', '=', filters[0].get('city')))

            # print ("Recordddddddddddddddddd-------",domain)

            if filters[0].get('photo_first'):
                if filters[0].get('photo_first') == 'Budget+%28lowest+to+highest%29':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='weekly_budget asc', limit=12)
                elif filters[0].get('photo_first') == 'Move+date+soonest':
                    domain.append(('avil_date', '>=', datetime.now()))
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='avil_date asc', limit=12)
                elif filters[0].get('photo_first') == 'Newest+listings':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='create_date desc', limit=12)
                elif filters[0].get('photo_first') == 'Photos+first':
                    peoperty_dict=[]
                    print("\n\n in photo first")
                    domain.append(('property_image_ids','!=',False))
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                        limit=12)
                elif filters[0].get('photo_first') == 'Active+most+recently':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='latest_active_date desc', limit=12)



            else:
                properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                           order='id desc', limit=12)

        domain= [('id', '<', record_id),('state','=','active')]
        if filters[0].get('listing_type') == 'list':
            accomodation_type_room = [value for key, value in filters[0].items() if 'room_accommodation' in key]
            print('\n\n\naccomodation_type_room ::\n', accomodation_type_room, '\n\n\n')
            domain.append(('listing_type','=','list'))
            # if filters[0].get('city'):
            #     if "%20" in filters[0].get('city'):
            #         print("listinggggggggggg--------", filters[0].get('city'),type(filters[0].get('city')))
            #
            #         city=str(filters[0].get('city')).replace("%20",' ')
            #         domain.append(('city', '=',city))
            #     else:
            #         domain.append(('city', '=', filters[0].get('city')))

            if filters[0].get('search_city'):
                city = filters[0].get('search_city')
                domain.append(('city', '=', city.strip()))

            if filters[0].get('search_suburbs'):
                search_suburbs = filters[0].get('search_suburbs').replace('+', ' ')
                search_suburbs = search_suburbs.replace('%2C', ',')
                search_suburbs_list = search_suburbs.split(',')
                domain.append('|')
                domain.append('|')
                domain.append(('street3', 'in',search_suburbs_list))
                domain.append(('street2', 'in',search_suburbs_list))
                domain.append(('city', 'in', search_suburbs_list))

            if filters[0].get('property_preference'):
                property_preference=str(filters[0].get('property_preference')).replace('%20',' ')
                print("\n\n------uuuu----uuuu--- ",property_preference.lstrip())

                if property_preference.lstrip() == 'Backpackers welcome':
                    domain.append(('backpackers','=',True))
                if property_preference.lstrip() == 'Smokers accepted':
                    domain.append(('smokers','=',True))
                if property_preference.lstrip() == '40+ years olds welcome':
                    domain.append(('fourty_year_old','=',True))
                if property_preference.lstrip() == 'Pets considered':
                    domain.append(('pets','=',True))
                if property_preference.lstrip() == 'On welfare welcome':
                    domain.append(('on_welfare','=',True))
                if property_preference.lstrip() == 'Students accepted':
                    domain.append(('students','=',True))
                if property_preference.lstrip() == 'LGBTI + friendly':
                    domain.append(('LGBTI','=',True))
                if property_preference.lstrip() == 'Children considered':
                    domain.append(('children','=',True))
                if property_preference.lstrip() == 'Retirees welcome':
                    domain.append(('retirees','=',True))
            if filters[0].get('property_type'):
                property_type=str(filters[0].get('property_type')).replace('%20',' ')
                print("\n\n------uuuu----uuuu--- ",property_type.lstrip())
                if property_type:
                    domain.append(('property_type.property_type','=',property_type.lstrip()))
            if filters[0].get('property_street'):
                property_type=str(filters[0].get('property_street')).replace('%20',' ')
                print("\n\n------uuuu----uuuu--- ",property_type.lstrip())
                if property_type:
                    domain.append(('street3','=',property_type.lstrip()))


            if filters[0].get('min_room_rent'):
                domain.append(('weekly_budget', '>=', int(filters[0].get('min_room_rent'))))
            if filters[0].get('max_room_rent'):
                domain.append(('weekly_budget', '<=', int(filters[0].get('max_room_rent'))))
            if filters[0].get('search_stay_len'):
                domain.append(('max_len_stay_id', '=', int(filters[0].get('search_stay_len'))))
            if filters[0].get('search_bedrooms'):
                domain.append(('total_bedrooms_id', '=', int(filters[0].get('search_bedrooms'))))
            if filters[0].get('search_gender'):
                if filters[0].get('search_gender') == 'females_only':
                    domain.append(('pref', '=', 'females_only'))
                if filters[0].get('search_gender') == 'males_only':
                    domain.append(('pref', '=', 'males_only'))
                if filters[0].get('search_gender') == 'anyone':
                    domain.append(('pref', '=', 'anyone'))
                    # domain.append(('pref', '=', 'female'))
                if filters[0].get('search_gender') == 'couple':
                    domain.append(('pref', '=', 'couple'))
            if filters[0].get('search_room_type'):
                domain.append(('rooms_ids.room_type_id', '=', int(filters[0].get('search_room_type'))))
            if filters[0].get('LGBTI'):
                domain.append(('LGBTI','=',True))
            if filters[0].get('retirees'):
                domain.append(('retirees','=',True))
            if filters[0].get('students'):
                domain.append(('students','=',True))
            if filters[0].get('smokers'):
                domain.append(('smokers','=',True))
            if filters[0].get('backpackers'):
                domain.append(('backpackers','=',True))
            if filters[0].get('children'):
                domain.append(('children','=',True))
            if filters[0].get('fourty_year_old'):
                domain.append(('fourty_year_old','=',True))
            if filters[0].get('on_welfare'):
                domain.append(('on_welfare','=',True))
            if filters[0].get('pets'):
                domain.append(('pets','=',True))
            if filters[0].get('search_room_parking_type'):
                domain.append(('parking_id', '=', int(filters[0].get('search_room_parking_type'))))
            if filters[0].get('search_room_bathroom_type'):
                domain.append(('total_bathrooms_id', '=', int(filters[0].get('search_room_bathroom_type'))))
            if filters[0].get('search_room_avail_date'):
                date_string = filters[0].get('search_room_avail_date')
                date = date_string.replace('%2F', '/')
                print('\n\n date', date_string, 'date', date)
                formated_date = datetime.strptime(date, '%m/%d/%Y')
                domain.append(('avil_date', '<=', formated_date))
            if filters[0].get('search_room_furnsh_type'):
                domain.append(('rooms_ids.room_furnishing_id', '=', int(filters[0].get('search_room_furnsh_type'))))
            if accomodation_type_room:
                property_type_list=[]
                for id in accomodation_type_room:
                    property_type_list.append(int(id))
                    # property_type_id = request.env['property_type'].sudo().search([('id','in',property_type_list)])
                    # print("-----((((((----))))))))--------",property_type_id)
                # if property_type_id:
                domain.append(('property_type', 'in', property_type_list))

                # domain.append(('property_type', '=', int(filters[0].get('accommodation_type'))))

            print ("\n\nDomain :     ",domain)
            if filters[0].get('search_sort'):
                if filters[0].get('search_sort') == 'cheapest':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                           order='weekly_budget asc', limit=12)
                elif filters[0].get('search_sort') == 'most-expensive':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                           order='weekly_budget desc', limit=12)
                elif filters[0].get('search_sort') == 'earliest-available':
                    domain.append(('avil_date', '>=', datetime.now()))
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='avil_date asc', limit=12)
                elif filters[0].get('search_sort') == 'newest':
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='create_date desc', limit=12)
                elif filters[0].get('search_sort') == 'photos':
                    domain.append(('property_image_ids','!=',False))
                    properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,
                                                                               order='id desc', limit=12)
                elif filters[0].get('search_sort') == 'recently-active':
                        properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields,order='latest_active_date desc', limit=12)
            else:
                properties = request.env['house.mates'].sudo().search_read(domain=domain,fields=fields,order='id desc', limit=12)

        print ("\n\n\nSearch Records :     ",len(properties),properties,'\n\n\n')
        if filters[0].get('listing_type') =='shortlist':
            # print ("Homeeeeeeeeeeeeeeee")
            print ("0----------------------------------0",request.env.user.house_mates_ids.ids)
            properties = request.env['house.mates'].sudo().search_read(domain=[('id', 'in', request.env.user.house_mates_ids.ids),('id', '<', record_id),('state','=','active')], fields=fields, order='id desc', limit=12)
            # print("Streettt---------------------------", properties)
        for rec in properties:
            # print("Streettt---------------------------", properties)
            property_image_main = request.env['property.image'].sudo().search_read(
                domain=[('flat_mates_id','=',rec.get('id')),('id', 'in', rec.get('property_image_ids'))], fields=['image'], order='id', limit=1)
            # print ("-------------ddddddddddddd----------------",rec)
            property_data = {}
            property_data['id'] = rec.get('id')

            ## Code added by dhrup
            res_user_id = request.env['res.users'].sudo().search([('id', '=', request.uid)])
            hose_mates_id_list = []

            for id in res_user_id.house_mates_ids:
                hose_mates_id_list.append(id.id)
            if rec.get('id') in hose_mates_id_list:
                property_data['is_short_list'] = True
            else:
                property_data['is_short_list'] = False
            property_data['description'] = rec.get('description_about_property')
            property_data['weekly_budget'] = rec.get('weekly_budget')
            property_data['listing_type'] = rec.get('listing_type')

            if rec.get('listing_type') == 'list':
                property_data['street'] = rec.get('street2')
                property_data['city'] = rec.get('city')

                if rec.get('total_bathrooms_id'):
                    property_data['bathrooms'] = rec.get('total_bathrooms_id')[1]
                if rec.get('total_bedrooms_id'):
                    property_data['bedrooms'] = rec.get('total_bedrooms_id')[1]
                if rec.get('total_no_flatmates_id'):
                    property_data['flatmates'] = rec.get('total_no_flatmates_id')[1]
                if rec.get('property_type'):
                    property_type_id = request.env['property.type'].sudo().search([('id', 'in', rec.get('property_type'))])
                    if len(property_type_id)>1:
                        property_data['display_string']=property_type_id[1].property_type
                    else:
                        room_type = request.env['about.rooms'].sudo().search([('id', 'in', rec.get('rooms_ids'))])
                        property_data['display_string'] = str(property_type_id.property_type) + " with " + str(
                            room_type.room_type_id.name) + " room."



            if rec.get('listing_type') == 'find':
                if rec.get('person_ids'):
                    # print("Personnnnnnnnnnnnnnnn",rec.get('person_ids')[0])
                    about_person = request.env['about.person'].sudo().search([('id','=',rec.get('person_ids')[0])])
                    property_data['name'] = about_person.name
                    property_data['age'] = about_person.age
                    property_data['gender'] = about_person.gender
                    print("\n------------ propety_type------", rec.get('suburbs_ids'))
                    suburbs_ids = request.env['find.suburbs'].sudo().search([('id', 'in', rec.get('suburbs_ids'))])
                    for id in suburbs_ids:
                        property_data['display_string'] = "Looking in : "+id.subrub_name+","






            #
            # if rec.get('is_listing'):
            #     print('44444444444444444444444444444')
            #     property_data['is_listing'] = True
            #     property_data['weekly_rent'] = rec.get('weekly_rent')
            # if rec.get('is_finding'):
            #     print('5555555555555555555')
            #     property_data['is_finding'] = True
            #     property_data['weekly_budget'] = rec.get('weekly_budget')

            # print('\n\n\nProperty Data : \n',property_data.copy(),'\n\n\n')
            if property_image_main:
                property_data['image'] = property_image_main[0].get('image')

            property_list.append(property_data.copy())

        # print ("----------------end--------------------",property_list)
        return property_list

        # properties1 = request.env['product.product'].sudo().search_read(domain=[('id','>',record_id)],fields=['id','name','default_code','image_medium','description'], order='id', limit=16)
        # # print ("Recordddddddddddddddddd-------",properties)
        # return properties1

    @http.route(['/blogs_for_login'], type='json', auth="public", website=True)
    def blogs_for_login(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search_read(fields=['id','name','blog_id'], order='id desc', limit=4)
        data = {
            'blogs': BlogPost
        }
        listings = request.env['house.mates'].sudo().search([('user_id.id', '=', request.uid)])
        list = []

        property_address=''
        status=''
        if listings:
            for listing in listings:
                if  listing.state != 'deleted':
                    suburb_data = 'Looking for accommodation in'
                    if listing.property_address:
                        property_address = property_address


                    if listing.suburbs_ids:
                        if len(listing.suburbs_ids) == 1:
                            suburb_data = suburb_data + ' ' + listing.suburbs_ids.subrub_name
                        else:
                            suburb_data = suburb_data +' '+listing.suburbs_ids[0].subrub_name +' and ' +listing.suburbs_ids[1].subrub_name


                    if listing.user_id.partner_id.mobile_no_is_verified == True and listing.state == 'active':
                        status = 'live'
                    elif listing.state == 'deactive':
                        status = 'not_live'
                    else:
                        status = 'pending'

                    dict = {'id': listing.id, 'address': listing.property_address,'type':listing.listing_type,'suburb_data':suburb_data,'status':status}
                    list.append(dict)
            print("\n\n\n00000000088890", list)

        data.update({'listings': list})

        user_profile_pic = request.env.user.image
        if user_profile_pic:
            data.update({'user_profile_pic':user_profile_pic})

        is_verified = request.env.user.partner_id.mobile_no_is_verified

        if is_verified:
            data.update({'is_mobile_verified':True})

        return data

    @http.route('/get_info_webpages', auth='public', type='json', website=True)
    def get_info_webpages(self, record_id):

        print("qw rrrrrrrrrrrrrrrrrrrr yt ut tttttttttttt")
        webpage_data_id = request.env['webpage.extension'].sudo().browse(int(record_id))
        if webpage_data_id:
            return {'html_content': webpage_data_id.description}

    @http.route('/load/search/data', auth='public', type='json', website=True)
    def load_search_data(self, type ,**post):
        data = {}


        if type == 'search-mode-rooms':
            listing_category = request.env['property.listing.category'].sudo().search([('property_listing_category', '=', 'List')])
            property_types = request.env['property.type'].sudo().search([('listing_category', '=', listing_category.id)])
            room_types = request.env['room.types'].sudo().search([])
            bathroom_types = request.env['bathroom.types'].sudo().search([('view_for','=','List')])
            room_furnishing_types = request.env['room.furnishing'].sudo().search([('view_for','=','List')])
            max_len_stay = request.env['maximum.length.stay'].sudo().search([])
            parking_types = request.env['parking'].sudo().search([('view_for','=','List')])
            bedrooms = request.env['bedrooms'].sudo().search([])

            data['property_types'] = [[i.id, i.property_type] for i in property_types]
            data['room_types'] = [[i.id, i.name] for i in room_types]
            data['bathroom_types'] = [[i.id, i.name] for i in bathroom_types]
            data['room_furnishing_types'] = [[i.id, i.name] for i in room_furnishing_types]
            data['max_len_stay'] = [[i.id, i.name] for i in max_len_stay]
            data['parking_types'] = [[i.id, i.name] for i in parking_types]
            data['bedrooms'] = [[i.id, i.name] for i in bedrooms]

        if type=='search-mode-flatmates':
            listing_category = request.env['property.listing.category'].sudo().search([('property_listing_category', '=', 'Find')])
            property_types = request.env['property.type'].sudo().search([('listing_category', '=', listing_category.id)])
            min_stay = request.env['minimum.length.stay'].sudo().search([])
            max_stay = request.env['maximum.length.stay'].sudo().search([])

            data['property_types'] = [[i.id, i.property_type] for i in property_types]
            data['min_stay'] = [[i.id, i.name] for i in min_stay]
            data['max_stay'] = [[i.id, i.name] for i in max_stay]




        print('\n\n\n Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee !!!!!!!!!!!!! ', data, '\n\n\n')

        return data



    @http.route(['/email_alert_settings'], type='json', auth="public", website=True,)
    def email_alert_settings(self,**kwargs):
        res_user=request.env['res.users'].search([('id','=',request.env.user.id)])

        res_user.sudo().write({'listing_alerts': kwargs['listing_alerts']})
        if kwargs['new_device_alerts'] == 'on':
            res_user.sudo().write({'new_device_alerts': True})
        else:
            res_user.sudo().write({'new_device_alerts':False})

        if kwargs['community_notices'] == 'on':
            res_user.sudo().write({'community_notices': True})
        else:
            res_user.sudo().write({'community_notices': False})

        if kwargs['special_offers'] == 'on':
            res_user.sudo().write({'special_offers': True})
        else:
            res_user.sudo().write({'special_offers': False})

        res_user.sudo().write({'message_alerts': True})

    @http.route(['/deactivate_account'], type='json', auth="public", website=True, )
    def deactivate_account(self, **kwargs):
        print("\n\n------in active")

        res_user = request.env['res.users'].search([('id', '=', request.env.user.id)])
        if 'deactivate_account' in kwargs and kwargs['deactivate_account'] == True:
            deactive_listing_ids = request.env['house.mates'].sudo().search([('user_id','=', request.env.user.id)])
            for id in deactive_listing_ids:
                id.sudo().write({'state':'deactive'})
            res_user.sudo().write({'deactivate_account': True})

        if 'activate_account' in kwargs and kwargs['activate_account'] == True:
            res_user.sudo().write({'deactivate_account': False})
            active_listing_ids = request.env['house.mates'].sudo().search([('user_id', '=', request.env.user.id)])
            for id in active_listing_ids:
                id.sudo().write({'state': 'active'})

    @http.route(['/account_active_status'], type='json', auth="public", website=True, )
    def account_active_status(self, **kwargs):

        res_user = request.env['res.users'].sudo().search([('id', '=', request.env.user.id)])
        account_active_status=res_user.deactivate_account
        print("\n\n------in active",account_active_status)
        return {'status':account_active_status}

    @http.route(['/delete_account'], type='json', auth="public", website=True, )
    def delete_account(self, **kwargs):

        print("\n\n------in active delete_account")
        res_user = request.env['res.users'].sudo().search([('id', '=', request.env.user.id)])
        delete_listing_ids = request.env['house.mates'].sudo().search([('user_id', '=', request.env.user.id)])
        for id in delete_listing_ids:
            id.unlink()
        res_user.sudo().write({'active':False})
        res_user.unlink()


    @http.route(['/account_settings'], type='json', auth="public", website=True, )
    def account_settings(self, **kwargs):
        print("\n\ndeactivate_account-----",  kwargs)

        res_user = request.env['res.users'].sudo().search([('id', '=', request.env.user.id)])
        if 'name' in kwargs :
            res_user.sudo().write({'name': kwargs['name']})
        if 'email' in kwargs:
            res_user.sudo().write({'login': kwargs['email']})
            res_user.partner_id.sudo().write({'email':kwargs['email']})
        if 'mobile' in kwargs:
            res_user.partner_id.sudo().write({'mobile':kwargs['mobile']})
        if 'image' in kwargs:
            data  = kwargs['image'].split(',')
            res_user.sudo().write({'image': data[1]})

        if 'is_allowed_to_contact' in kwargs and kwargs.get('is_allowed_to_contact'):
            print('trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            if res_user.partner_id.mobile and not res_user.partner_id.allowed_to_contact:
                print('not checkeddddddddddddddddddddddddddddd')
                res_user.partner_id.sudo().write({'allowed_to_contact':True})

        if kwargs.get('is_allowed_to_contact') == False and res_user.partner_id.mobile:
            res_user.partner_id.sudo().write({'allowed_to_contact': False})

    @http.route(['/set_user_profile_pic'], type='json', auth="public", website=True, )
    def set_user_profile_pic(self, **kwargs):
        res_user = request.env['res.users'].search([('id', '=', request.env.user.id)])
        if 'image' in kwargs:
            data  = kwargs['image'].split(',')
            res_user.sudo().write({'image': data[1]})

    @http.route(['/get_users_default_data'], type='json', auth="public", website=True, )
    def get_users_default_data(self, **kwargs):
        user_name = request.env.user.name
        user_email = request.env.user.login
        user_mobile = request.env.user.partner_id.mobile
        is_mobile_verified = request.env.user.partner_id.mobile_no_is_verified
        is_allowed_to_contact = request.env.user.partner_id.allowed_to_contact

        user_image = request.env.user.image

        data = {
                'user_name':user_name,
                'user_email':user_email,

                }
        if user_mobile:
            data.update({'user_mobile':user_mobile})
        if user_image:
            data.update({'user_image':user_image})
        if is_mobile_verified:
            data.update({'is_mobile_verified': True})
        else:
            data.update({'is_mobile_verified': False})
        if is_allowed_to_contact:
            data.update({'is_allowed_to_contact': True})
        else:
            data.update({'is_allowed_to_contact': False})
        return data

    @http.route(['/country'], type='json', auth="public", website=True, )
    def country_code(self, **kwargs):
        res_country = request.env['res.country'].search([('id','!=',13)])
        value = {}
        value['country'] = [[i.id, i.name+" (+"+str(i.phone_code)+")"] for i in res_country]
        return value

    @http.route(['/send_sms'], type='json', auth="public", website=True)
    def send_sms(self, **kwargs):
        print('\n\n\n22222222222222222222222 ::', kwargs, '\n\n\n')
        country_id = None
        phone_code = None
        mobile_no = None
        send = False
        if 'country_id' in kwargs and kwargs.get('country_id'):
            country_id = request.env['res.country'].browse(int(kwargs.get('country_id')))
            if country_id:
                phone_code = country_id.phone_code

        if 'mobile_no' in kwargs and kwargs.get('mobile_no'):
            mobile_no = kwargs.get('mobile_no')

        if 'allowed_to_contact' in kwargs and kwargs.get('allowed_to_contact'):
            request.session['allowed_to_contact']= True

        if phone_code and mobile_no:
            send = self.send_otp_to_verify_mobile_no(phone_code,mobile_no)
            pass
        print('\n\n\n------------------- Is send :: ',send,'\n\n\n')
        return send

    def send_otp_to_verify_mobile_no(self,phone_code,mobile_no):
        user_name = request.env['ir.config_parameter'].sudo().search([('key', '=', 'pragtech_housemates.sms_user_name')])
        user_password = request.env['ir.config_parameter'].sudo().search([('key', '=', 'pragtech_housemates.sms_user_password')])
        is_sms_send = False

        print('\n\n\n------------------------------------------------------------\n\n',)
        print('\n\n User Name : ',user_name.value)
        print('\n\n User Password : ', user_password.value)
        print('\n\n\n------------------------------------------------------------\n\n')
        if not user_name and not user_password:
            raise ValidationError(_('Please Configure User Name and Password'))

        totp = pyotp.TOTP('base32secret3232')
        random_otp = totp.now()
        message_to_send = "Your Beome.com.au code: "+random_otp+" . Never share this code. Beome will never ask you to login or disclose account information via SMS."
        # message_to_send = "Your OTP is "+random_otp
        mobile_number = "+"+str(phone_code)+str(mobile_no)

        request.session['random_otp'] = random_otp
        request.session['mobile_no'] = mobile_no
        print('\n\n\nRandom OTP :',random_otp)

        configuration = clicksend_client.Configuration()
        configuration.username = str(user_name.value) #user_name
        configuration.password = str(user_password.value) #password

        # create an instance of the API class
        api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))
        sms_message = SmsMessage(source="python",
                                 body=message_to_send,
                                 to=mobile_number)#"+61411111111"
        sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])

        try:
            # Send sms message(s)
            api_response = api_instance.sms_send_post(sms_messages)
            print('\n\nResponse\n',api_response)
            ret_response = ast.literal_eval((api_response))

            if ret_response['http_code'] == 200 and ret_response['response_code'] == 'SUCCESS':
                if ret_response['data']['messages'][0]['status'] == 'SUCCESS':
                    data = {
                        'is_sms_send': True,
                        'status': 'SUCCESS',
                        'mobile_number':mobile_number,
                    }

                elif ret_response['data']['messages'][0]['status'] == 'INVALID_RECIPIENT':
                    is_sms_send = False
                    data = {
                        'is_sms_send':False,
                        'status': 'INVALID_RECIPIENT',
                    }
                else:
                    data = {
                        'is_sms_send': False,
                        'status': 'SOMETHING_WENT_WRONG',
                    }

        except ApiException as e:
            print("Exception when calling SMSApi->sms_send_post: %s\n" % e)

        print('<<<<<< Data >>>>>>>>>>> ',data)
        return data

    @http.route(['/sms_messgae_to_owner'], type='json', auth="public", website=True)
    def sms_messgae_to_owner(self, **kwargs):
        """Send message to owner of property, using property id get its partner
        Send Message only if Owner's plan have that feature
        """
        mobile_no = False
        phone_code = False
        flag = 0
        if 'property_id' in kwargs and kwargs.get('property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs['property_id']))
            #Check if owner's plan include receiving enquires feature
            receive_enquiry_feature = request.env.ref('pragtech_housemates.feature1')

            if not receive_enquiry_feature:
                receive_enquiry_feature = request.env['plan.faeture'].sudo.search([('feature_type', '=', 'enquiries')], limit=1)
            transaction_ids = request.env['transaction.history'].sudo().search(
                [('partner_id', '=', property_id.user_id.partner_id.id)])
            for transaction in transaction_ids:
                if date.today() <= datetime.strptime(transaction.end_date, '%d-%m-%Y').date():
                    for feature in transaction.plan.feature_ids:
                        if feature.id == receive_enquiry_feature.id:
                            flag = 1

            if flag:
                mobile_no = property_id.user_id.partner_id.mobile
                if property_id.user_id.partner_id.country_id:
                    phone_code = property_id.user_id.partner_id.country_id.phone_code
        if mobile_no and phone_code:
            user_name = request.env['ir.config_parameter'].sudo().search(
                [('key', '=', 'pragtech_housemates.sms_user_name')])
            user_password = request.env['ir.config_parameter'].sudo().search(
                [('key', '=', 'pragtech_housemates.sms_user_password')])

            mobile_number = "+" + str(phone_code) + str(mobile_no)


            configuration = clicksend_client.Configuration()
            configuration.username = str(user_name.value)  # user_name
            configuration.password = str(user_password.value)  # password

            # create an instance of the API class
            api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))

            sms_message = SmsMessage(source="python",
                                     body=kwargs.get('message_owner'),
                                     to=mobile_number)  # "+61411111111"
            sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])

            try:
                # Send sms message(s)
                api_response = api_instance.sms_send_post(sms_messages)
                print('\n\nResponse\n', api_response)
                ret_response = ast.literal_eval((api_response))
                if ret_response['data']['messages'][0]['status'] == 'SUCCESS':
                    data = {
                        'is_sms_send': True,
                        'status': 'SUCCESS',
                        'mobile_number':mobile_number,
                    }

                elif ret_response['data']['messages'][0]['status'] == 'INVALID_RECIPIENT':
                    is_sms_send = False
                    data = {
                        'is_sms_send':False,
                        'status': 'INVALID_RECIPIENT',
                    }
                else:
                    data = {
                        'is_sms_send': False,
                        'status': 'SOMETHING_WENT_WRONG',
                    }
            except ApiException as e:
                print("Exception when calling SMSApi->sms_send_post: %s\n" % e)
            return data
        return False


    @http.route(['/verify_otp'], type='json', auth="public", website=True)
    def verify_otp(self, **kwargs):
        print('\n\n\nVERIFY OTP ::', kwargs, '\n\n\n')
        entered_otp = None
        sent_otp = None
        is_verified = False

        sent_otp = str(request.session.get('random_otp'))

        if 'entered_otp' in kwargs and kwargs.get('entered_otp'):
            entered_otp = kwargs.get('entered_otp')

        if sent_otp == entered_otp:
            print('66666666666666666666666666666666666')
            is_verified = True
            properties = request.env['house.mates'].sudo().search([('user_id','=',request.env.user.id)])

            request.env.user.partner_id.mobile = str(request.session.get('mobile_no'))
            request.env.user.partner_id.mobile_no_is_verified = True
            if properties:
                for property in properties:
                    property.sudo().write({'state':'active'})

            if request.session.get('allowed_to_contact'):
                request.env.user.partner_id.allowed_to_contact = True

            request.session['random_otp'] = ""
            request.session['mobile_no'] = ""
            request.session['allowed_to_contact'] = False


        data = {
            'is_verified':is_verified
        }


        return data

    @http.route(['/remove_partner_mobile_no'], type='json', auth="public", website=True)
    def remove_partner_mobile_no(self, **kwargs):
        print('\n\n-------------------------------------------------------------------')
        partner_id = request.env.user.partner_id
        print('\n Partner :',partner_id,partner_id.name)
        if partner_id:
            # if partner_id.mobile:
            #     print('Partner Mobile : ',partner_id.mobile)
            #     partner_id.mobile=""
            # if partner_id.mobile_no_is_verified:
            #     print('Parnter Is Verified :',partner_id.mobile_no_is_verified)
            #     partner_id.mobile_no_is_verified = False
            # if partner_id.allowed_to_contact:
            #     partner_id.allowed_to_contact = False

            if partner_id.mobile:
                partner_id.sudo().write({"mobile":""})

            if partner_id.mobile_no_is_verified:
                partner_id.sudo().write({"mobile_no_is_verified" : False})
                properties = request.env['house.mates'].sudo().search([('user_id', '=', request.env.user.id)])
                if properties:
                    for property in properties:
                        property.sudo().write({'state': 'pending'})



            if partner_id.allowed_to_contact:
                partner_id.sudo().write({"allowed_to_contact" : False})

        return True

    ############## Edit List Preview Routes ##################

    @http.route(['/get_about_room_data_of_current_property'], type='json', auth="public", website=True)
    def get_about_room_data_of_current_property(self, **kwargs):
        print('--------------------------------------------------------------')
        print('\nKwargs : ', kwargs)
        data = {}

        bill_ids = request.env['bill.bill'].sudo().search([])
        bond_ids = request.env['bond.bond'].sudo().search([])
        room_furnishing_ids = request.env['room.furnishing'].sudo().search([('view_for','=','List')])
        room_types = request.env['room.types'].sudo().search([])
        bath_room_types = request.env['bathroom.types'].sudo().search([('view_for','=','List')])
        min_stay_ids = request.env['minimum.length.stay'].sudo().search([])
        max_stay_ids = request.env['maximum.length.stay'].sudo().search([])

        data.update({
            'bill_ids': [[i.id, i.name] for i in bill_ids],
            'bond_ids': [[i.id, i.name] for i in bond_ids],
            'room_furnishing_ids': [[i.id, i.name] for i in room_furnishing_ids],
            'room_types': [[i.id, i.name] for i in room_types],
            'bath_room_types': [[i.id, i.name] for i in bath_room_types],
            'min_stay_ids': [[i.id, i.name] for i in min_stay_ids],
            'max_stay_ids': [[i.id, i.name] for i in max_stay_ids],
        })

        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:
                if house_mates_id.weekly_budget:
                    data.update({
                        'weekly_budget': house_mates_id.weekly_budget,
                    })
                if house_mates_id.bill_id:
                    data.update({
                        'existing_bill_id': house_mates_id.bill_id.id,
                    })
                if house_mates_id.bond_id:
                    data.update({
                        'existing_bond_id': house_mates_id.bond_id.id,
                    })

                if house_mates_id.min_len_stay_id:
                    data.update({
                        'existing_min_stay_id': house_mates_id.min_len_stay_id.id
                    })

                if house_mates_id.max_len_stay_id:
                    data.update({
                        'existing_max_stay_id': house_mates_id.max_len_stay_id.id
                    })

                if house_mates_id.avil_date:
                    data.update({
                        'avil_date': house_mates_id.avil_date
                    })

                if house_mates_id.pref:
                    data.update({
                        'existing_preference': house_mates_id.pref
                    })

                for room in house_mates_id.rooms_ids:
                    if room[0].room_furnishing_id:
                        data.update({
                            'existing_room_furnishing_id': room[0].room_furnishing_id.id
                        })
                    if room[0].room_type_id:
                        data.update({
                            'existing_room_type_id': room[0].room_type_id.id
                        })
                    if room[0].bath_room_type_id:
                        data.update({
                            'existing_bath_room_type_id': room[0].bath_room_type_id.id
                        })

        print('dataaaa edit :', data)

        return data

    @http.route(['/update_about_rooms_data'], type='json', auth="public", website=True)
    def update_about_rooms_data(self, **kwargs):
        print('----------------------- update_about_rooms_data ---------------------------------------')
        print('\nKwargs : ', kwargs)
        data_dict = {}
        if kwargs.get('current_property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs.get('current_property_id')))

            if property_id:

                if kwargs.get('update_weekly_budget'):
                    data_dict.update({
                        'weekly_budget': kwargs.get('update_weekly_budget')
                    })

                if kwargs.get('update_bond'):
                    data_dict.update({
                        'bond_id': int(kwargs.get('update_bond'))
                    })

                if kwargs.get('update_bill'):
                    data_dict.update({
                        'bill_id': int(kwargs.get('update_bill'))
                    })

                if kwargs.get('update_min_stay'):
                    data_dict.update({
                        'min_len_stay_id': int(kwargs.get('update_min_stay'))
                    })

                if kwargs.get('update_max_stay'):
                    data_dict.update({
                        'max_len_stay_id': int(kwargs.get('update_max_stay'))
                    })

                if kwargs.get('update_available_date'):
                    data_dict.update({
                        'avil_date': kwargs.get('update_available_date')
                    })

                if kwargs.get('update_preference'):
                    data_dict.update({
                        'pref': kwargs.get('update_preference')
                    })

                if data_dict:
                    property_id.sudo().write(data_dict)

                for room in property_id.rooms_ids:
                    if kwargs.get('update_room_type'):
                        room[0].room_type_id = int(kwargs.get('update_room_type'))
                    if kwargs.get('update_room_furnishing'):
                        room[0].room_furnishing_id = int(kwargs.get('update_room_furnishing'))
                    if kwargs.get('update_bath_room_type'):
                        room[0].bath_room_type_id = int(kwargs.get('update_bath_room_type'))

        print('\n--------------------------------------------------------------\n\n\n')

        return True

    @http.route(['/get_about_property_data'], type='json', auth="public", website=True)
    def get_about_property_data(self, **kwargs):
        print('--------------------------------------------------------------')
        print('\nKwargs 1234 : ', kwargs)
        data = {}
        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:
                if house_mates_id.description_about_property:
                    data = {
                        'about_property_description': house_mates_id.description_about_property
                    }
        print('\nKwargs 1234 : ', data)


        return data

    @http.route(['/update_about_property_data'], type='json', auth="public", website=True)
    def update_about_property_data(self, **kwargs):
        print('--------------------------------------------------------------')
        print('\nupdate_about_property_data 1234 : ', kwargs, '\n\n\n')
        if kwargs.get('current_property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs.get('current_property_id')))

            if property_id:

                if kwargs.get('update_about_property_desc'):
                    property_id.sudo().write({
                        'description_about_property': kwargs.get('update_about_property_desc')
                    })
        return True

    @http.route(['/get_about_flatmates_data'], type='json', auth="public", website=True)
    def get_about_flatmates_data(self, **kwargs):
        print('--------------------------------------------------------------')
        print('\nKwargs 7657675 : ', kwargs)
        data = {}
        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:
                if house_mates_id.description_about_user:
                    data = {
                        'about_user_description': house_mates_id.description_about_user
                    }
        print('\nData 1234 : ', data)

        return data

    @http.route(['/update_about_user_data'], type='json', auth="public", website=True)
    def update_about_user_data(self, **kwargs):
        print('------------------- update_about_user_data -------------------------------------------')
        print('\nupdate_about_user_data 1234 : ', kwargs, '\n\n\n')
        if kwargs.get('current_property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs.get('current_property_id')))

            if property_id:

                if kwargs.get('update_about_user_desc'):
                    property_id.sudo().write({
                        'description_about_user': kwargs.get('update_about_user_desc')
                    })
        return True

    @http.route(['/get_property_descp_data_of_current_property'], type='json', auth="public", website=True)
    def get_property_descp_data_of_current_property(self, **kwargs):
        print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        data = {}

        total_bedrooms = request.env['bedrooms'].sudo().search([])
        total_bathrooms = request.env['bathrooms'].sudo().search([])
        total_flatmates = request.env['total.flatmates'].sudo().search([('view_for','=','List')])
        internet = request.env['internet'].sudo().search([('view_for','=','List')])
        parking = request.env['parking'].sudo().search([('view_for','=','List')])

        data.update({
            'total_bedrooms': [[i.id,i.name] for i in total_bedrooms],
            'total_bathrooms': [[i.id,i.name] for i in total_bathrooms],
            'total_flatmates': [[i.id,i.name] for i in total_flatmates],
            'internet': [[i.id,i.name] for i in internet],
            'parking': [[i.id,i.name] for i in parking],
        })

        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id.total_bathrooms_id:
                data.update({
                    'existing_bathroom_id': house_mates_id.total_bathrooms_id.id
                })
            if house_mates_id.total_bedrooms_id:
                data.update({
                    'existing_bedroom_id': house_mates_id.total_bedrooms_id.id
                })
            if house_mates_id.total_no_flatmates_id:
                data.update({
                    'existing_no_of_flatmates': house_mates_id.total_no_flatmates_id.id
                })
            if house_mates_id.internet_id:
                data.update({
                    'existing_internet_id': house_mates_id.internet_id.id
                })
            if house_mates_id.parking_id:
                data.update({
                    'existing_parking_id': house_mates_id.parking_id.id
                })

            if house_mates_id.type:
                data.update({
                    'existing_property_type':house_mates_id.type
                })
        print('$$$$ : ',data)
        return data



    @http.route(['/update_property_descp'], type='json', auth="public", website=True)
    def update_property_descp(self, **kwargs):
        print('1111111111111111111111111111111111111111111 \n\n',kwargs,'\n\n\n')
        data_dict = {}
        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:

                if 'property_address' in kwargs and kwargs.get('property_address'):
                    pass

                if 'street_number' in kwargs and kwargs.get('street_number'):
                    data_dict.update({
                        'street': kwargs.get('street_number'),
                    })
                else:
                    if 'street1' in kwargs and kwargs.get('street1'):
                        data_dict.update({
                            'street': kwargs.get('street1'),
                        })
                    else:
                        pass

                if 'street2' in kwargs and kwargs.get('street2'):
                    data_dict.update({
                        'street2': kwargs.get('street2'),
                    })
                if 'city' in kwargs and kwargs.get('city'):
                    data_dict.update({
                        'city': kwargs.get('city'),
                    })
                if 'state' in kwargs and kwargs.get('state'):
                    state_name = kwargs.get('state')
                    state_id = request.env['res.country.state'].sudo().search([('name', '=', state_name)], limit=1)
                    print('State Id and name :', state_id, state_id.name)
                    if state_id:
                        data_dict.update({
                            'state_id': state_id.id,
                        })
                if 'zip_code' in kwargs and kwargs.get('zip_code'):
                    data_dict.update({
                        'zip': kwargs.get('zip_code'),
                    })
                if 'country' in kwargs and kwargs.get('country'):
                    country_name = kwargs.get('country')
                    country_id = request.env['res.country'].sudo().search([('name', '=', country_name)], limit=1)
                    print('Country Id and name :', country_id, country_id.name)
                    if country_id:
                        data_dict.update({
                            'country_id': country_id.id,
                        })
                if 'latitude' in kwargs and kwargs.get('latitude'):
                    data_dict.update({
                        'latitude': kwargs.get('latitude')
                    })
                if 'longitude' in kwargs and kwargs.get('longitude'):
                    data_dict.update({
                        'longitude': kwargs.get('longitude')
                    })
                if 'north' in kwargs and kwargs.get('north'):
                    data_dict.update({
                        'north': kwargs.get('north')
                    })
                if 'east' in kwargs and kwargs.get('east'):
                    data_dict.update({
                        'east': kwargs.get('east')
                    })
                if 'south' in kwargs and kwargs.get('south'):
                    data_dict.update({
                        'south': kwargs.get('south')
                    })
                if 'west' in kwargs and kwargs.get('west'):
                    data_dict.update({
                        'west': kwargs.get('west')
                    })

                if kwargs.get('update_property_type'):
                    data_dict.update({
                        'type': kwargs.get('update_property_type')
                    })

                if kwargs.get('update_bedrooms'):
                    data_dict.update({
                        'total_bedrooms_id': int(kwargs.get('update_bedrooms'))
                    })

                if kwargs.get('update_bathrooms'):
                    data_dict.update({
                        'total_bathrooms_id': int(kwargs.get('update_bathrooms'))
                    })

                if kwargs.get('update_flatmates'):
                    data_dict.update({
                        'total_no_flatmates_id': int(kwargs.get('update_flatmates'))
                    })

                if kwargs.get('update_internet'):
                    data_dict.update({
                        'internet_id': int(kwargs.get('update_internet'))
                    })

                if kwargs.get('update_parking'):
                    data_dict.update({
                        'parking_id': int(kwargs.get('update_parking'))
                    })



                if data_dict:
                    house_mates_id.sudo().write(data_dict)

        return True

    @http.route(['/get_accepting_data'], type='json', auth="public", website=True)
    def get_accepting_data(self, **kwargs):
        print('\n\n\nGet Accepting Data : \n\n', kwargs, '\n\n\n')
        accepting_dict = {}
        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:
                if house_mates_id.backpackers:
                    accepting_dict.update({
                        'backpackers':True
                    })

                if house_mates_id.students:
                    accepting_dict.update({
                        'students': True
                    })

                if house_mates_id.smokers:
                    accepting_dict.update({
                        'smokers': True
                    })

                if house_mates_id.LGBTI:
                    accepting_dict.update({
                        'LGBTI': True
                    })

                if house_mates_id.fourty_year_old:
                    accepting_dict.update({
                        'fourty_year_old': True
                    })

                if house_mates_id.children:
                    accepting_dict.update({
                        'children': True
                    })

                if house_mates_id.pets:
                    accepting_dict.update({
                        'pets': True
                    })

                if house_mates_id.retirees:
                    accepting_dict.update({
                        'retirees': True
                    })

                if house_mates_id.on_welfare:
                    accepting_dict.update({
                        'on_welfare': True
                    })

                print('\n\nACCEPTING DICT TO RETURN :\n',accepting_dict)
        return accepting_dict

    @http.route(['/update_accepting_data'], type='json', auth="public", website=True)
    def update_accepting_data(self, **kwargs):
        print('\n\n\nAccepting Data : \n\n', kwargs, '\n\n\n')
        data_dict = {}
        if kwargs.get('current_property_id'):
            current_property_id = kwargs.get('current_property_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_property_id))

            if house_mates_id:
                if kwargs.get('update_accepting'):
                    print('|||||||||||||||||||||||||||||||||||||||||||||||||||')
                    house_mates_id.pets = False
                    house_mates_id.LGBTI = False
                    house_mates_id.students = False
                    house_mates_id.children = False
                    house_mates_id.smokers = False
                    house_mates_id.fourty_year_old = False
                    house_mates_id.backpackers = False
                    house_mates_id.retirees = False
                    house_mates_id.on_welfare = False

                    for accept in kwargs.get('update_accepting'):
                        if accept == 'pets':
                            house_mates_id.pets = True

                        if accept == 'LGBTI':
                            house_mates_id.LGBTI = True

                        if accept == 'students':
                            house_mates_id.students = True

                        if accept == 'children':
                            house_mates_id.children = True

                        if accept == 'smokers':
                            house_mates_id.smokers = True

                        if accept == 'all_females':
                            pass

                        if accept == 'fourty_year_old':
                            house_mates_id.fourty_year_old = True

                        if accept == 'backpackers':
                            house_mates_id.backpackers = True

                        if accept == 'retirees':
                            house_mates_id.retirees = True

                        if accept == 'on_welfare':
                            house_mates_id.on_welfare = True

        return True


    ############## Edit Find Preview Routes ################

    @http.route(['/get_general_information_of_current_property'], type='json', auth="public", website=True)
    def get_general_information_of_current_property(self, **kwargs):
        print('\n\n-----------------------------------------------------\n\n',kwargs,'\n\n')
        data_dict= {}
        max_stay_ids = request.env['maximum.length.stay'].sudo().search([])

        data_dict.update({
            'max_stay_ids': [[i.id, i.name] for i in max_stay_ids],
        })

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if house_mates_id.avil_date:
                    data_dict.update({
                        'exiting_move_date':house_mates_id.avil_date
                    })
                if house_mates_id.weekly_budget:
                    data_dict.update({
                        'existing_weekly_budget':house_mates_id.weekly_budget
                    })

                if house_mates_id.max_len_stay_id:
                    data_dict.update({
                        'existing_max_stay_id':house_mates_id.max_len_stay_id.id
                    })
        print('\nData Dict : \n',data_dict,'\n\n')

        return data_dict

    @http.route(['/update_general_info'], type='json', auth="public", website=True)
    def update_general_info(self, **kwargs):
        print('\n\n##### : ',kwargs,'\n\n')
        update_dict = {}

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if kwargs.get('update_max_budget'):
                    update_dict.update({
                        'weekly_budget':kwargs.get('update_max_budget')
                    })
                if kwargs.get('update_move_date'):
                    update_dict.update({
                        'avil_date':kwargs.get('update_move_date')
                    })
                if kwargs.get('update_max_stay_id'):
                    update_dict.update({
                        'max_len_stay_id':int(kwargs.get('update_max_stay_id'))
                    })

                if update_dict:
                   house_mates_id.sudo().write(update_dict)

        return True

    @http.route(['/get_preferred_locations'], type='json', auth="public", website=True)
    def get_preferred_locations(self, **kwargs):
        """Get all suburbs from house mates"""
        suburbs = []
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                for s in house_mates_id.suburbs_ids:
                    data = {
                        'city':s.city,
                        'post_code': s.post_code,
                        'longitude': s.longitude,
                        'latitude': s.latitude,
                        'subrub_name': s.subrub_name,
                        'state': s.state,
                        'id': s.id

                    }
                    suburbs.append(data)
        return suburbs

    @http.route(['/get_about_me_data'], type='json', auth="public", website=True)
    def get_about_me_data(self, **kwargs):
        print('\n\n-----------------------------------------------------\n\n', kwargs, '\n\n')

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if house_mates_id.description_about_property:
                    data = {
                        'description_about_me':house_mates_id.description_about_property
                    }
        print('Data about me : ',data)
        return data

    @http.route(['/update_find_about_me'], type='json', auth="public", website=True)
    def update_find_about_me(self, **kwargs):
        print('\n\n---------------------- update_find_about_me -------------------------------\n\n', kwargs, '\n\n')

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                print('House mate eeee : ',house_mates_id)
                if kwargs.get('update_about_me_data'):
                    house_mates_id.sudo().write({
                        'description_about_property':kwargs.get('update_about_me_data')
                    })
        return True

    @http.route(['/get_property_pref_data'], type='json', auth="public", website=True)
    def get_property_pref_data(self, **kwargs):
        print('\n\n---------------------- get_property_pref_data -------------------------------\n\n', kwargs, '\n\n')

        internet = request.env['internet'].sudo().search([('view_for', '=', 'Find')])
        parking = request.env['parking'].sudo().search([('view_for', '=', 'Find')])
        bathroom_typs = request.env['bathroom.types'].sudo().search([('view_for', '=', 'Find')])
        room_furnishing_types = request.env['room.furnishing'].sudo().search([('view_for', '=', 'Find')])
        total_flatmates = request.env['total.flatmates'].sudo().search([('view_for', '=', 'Find')])

        data = {
            'internet':[[i.id,i.name] for i in internet],
            'parking':[[i.id,i.name] for i in parking],
            'bathroom_typs':[[i.id,i.name] for i in bathroom_typs],
            'room_furnishing_types':[[i.id,i.name] for i in room_furnishing_types],
            'total_flatmates': [[i.id,i.name] for i in total_flatmates],
        }

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if house_mates_id.internet_id:
                    data.update({
                        'existing_internet_id':house_mates_id.internet_id.id
                    })
                if house_mates_id.parking_id:
                    data.update({
                        'existing_parking_id': house_mates_id.parking_id.id
                    })
                if house_mates_id.total_no_flatmates_id:
                    data.update({
                        'existing_total_no_flatmates_id': house_mates_id.total_no_flatmates_id.id
                    })

                if house_mates_id.rooms_ids:
                    for room in house_mates_id.rooms_ids:
                        if room[0].room_furnishing_id:
                            data.update({
                                'existing_room_furnishing_id':room[0].room_furnishing_id.id
                            })
                        if room[0].bath_room_type_id:
                            data.update({
                                'existing_bath_room_type_id': room[0].bath_room_type_id.id
                            })
        print('\n\nProperty Pref Data :\n',data)
        return  data



    @http.route(['/update_property_pref'], type='json', auth="public", website=True)
    def update_property_pref(self, **kwargs):
        print('\n\n---------------------- update_property_pref -------------------------------\n\n', kwargs, '\n\n')
        update_dict= {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if kwargs.get('update_internet_id'):
                    update_dict.update({
                        'internet_id':int(kwargs.get('update_internet_id'))
                    })

                if kwargs.get('update_parking_id'):
                    update_dict.update({
                        'parking_id': int(kwargs.get('update_parking_id'))
                    })

                if kwargs.get('update_total_flatmate_id'):
                    update_dict.update({
                        'total_no_flatmates_id': int(kwargs.get('update_total_flatmate_id'))
                    })

                if update_dict:
                    house_mates_id.sudo().write(update_dict)

                for room in house_mates_id.rooms_ids:
                    if kwargs.get('update_room_furnishing_type_id'):
                        room[0].sudo().write({'room_furnishing_id':int(kwargs.get('update_room_furnishing_type_id'))})

                    if kwargs.get('update_bathroom_type_id'):
                        room[0].sudo().write({'bath_room_type_id':int(kwargs.get('update_bathroom_type_id'))})

        return True

    @http.route(['/get_life_stlye_data'], type='json', auth="public", website=True)
    def get_life_stlye_data(self, **kwargs):
        print('\n\n---------------------- get_life_stlye_data -------------------------------\n\n', kwargs, '\n\n')
        data_dict = {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if house_mates_id.f_full_time:
                    data_dict.update({
                        'working_full_time':True
                    })
                if house_mates_id.f_part_time:
                    data_dict.update({
                        'working_part_time': True
                    })
                if house_mates_id.f_working_holiday:
                    data_dict.update({
                        'working_holiday': True
                    })
                if house_mates_id.f_student:
                    data_dict.update({
                        'student': True
                    })
                if house_mates_id.f_backpacker:
                    data_dict.update({
                        'backpacker': True
                    })
                if house_mates_id.f_retired:
                    data_dict.update({
                        'retired': True
                    })
                if house_mates_id.f_unemployed:
                    data_dict.update({
                        'unemployed': True
                    })
                if house_mates_id.flgbti:
                    data_dict.update({
                        'LGBT': True
                    })
                if house_mates_id.fpets:
                    data_dict.update({
                        'pets': True
                    })
                if house_mates_id.fsmoker:
                    data_dict.update({
                        'smokers': True
                    })
                if house_mates_id.fchildren:
                    data_dict.update({
                        'children': True
                    })

        if data_dict:
            return data_dict

    @http.route(['/get_preferred_accommodation_data'], type='json', auth="public", website=True)
    def get_preferred_accommodation_data(self, **kwargs):
        print('\n\n---------------------- edit_preferred_accommodation -------------------------------\n\n', kwargs, '\n\n')
        data_dict = {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_ids = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_ids:
                for property_type_id in house_mates_ids.property_type:
                    print("\n\nproprty type",id)
                    if property_type_id.property_type == 'Granny Flats':
                        data_dict.update({
                            'granny_flats': True
                        })
                    if property_type_id.property_type == 'Homestay':
                        data_dict.update({
                            'homestay': True
                        })
                    if property_type_id.property_type == 'One Bed Flat':
                        data_dict.update({
                            'one_bed_flat': True
                        })
                    if property_type_id.property_type == 'Rooms in an existing share house':
                        data_dict.update({
                            'rooms_in_existing_share': True
                        })
                    if property_type_id.property_type == 'Shared Room':
                        data_dict.update({
                            'shared_room': True
                        })
                    if property_type_id.property_type == 'Student accommodation':
                        data_dict.update({
                            'student_accommodation': True
                        })
                    if property_type_id.property_type == 'Whole property for rent':
                        data_dict.update({
                            'whole_property_for_rent': True
                        })

        if data_dict:
            return data_dict

    @http.route(['/update_life_style_data'], type='json', auth="public", website=True)
    def update_life_style_data(self, **kwargs):
        print('\n\n---------------------- update_life_style_data -------------------------------\n\n', kwargs, '\n\n')
        update_dict = {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if kwargs.get('life_style_data'):
                    house_mates_id.f_full_time = False
                    house_mates_id.f_part_time = False
                    house_mates_id.f_working_holiday = False
                    house_mates_id.f_retired = False
                    house_mates_id.f_unemployed = False
                    house_mates_id.f_backpacker = False
                    house_mates_id.f_student = False
                    house_mates_id.fsmoker = False
                    house_mates_id.flgbti = False
                    house_mates_id.fpets = False
                    house_mates_id.fchildren = False

                    for type in kwargs.get('life_style_data'):
                        if type == "working_full_time":
                            house_mates_id.f_full_time = True
                        if type == "working_part_time":
                            house_mates_id.f_part_time = True
                        if type == "working_holiday":
                            house_mates_id.f_working_holiday = True
                        if type == "student":
                            house_mates_id.f_student = True
                        if type == "backpacker":
                            house_mates_id.f_backpacker = True
                        if type == "retired":
                            house_mates_id.f_retired = True
                        if type == "unemployed":
                            house_mates_id.f_unemployed = True
                        if type == "LGBT":
                            house_mates_id.flgbti = True
                        if type == "smokers":
                            house_mates_id.fsmoker = True
                        if type == "children":
                            house_mates_id.fchildren = True
                        if type == "pets":
                            house_mates_id.fpets = True

        return True

    @http.route(['/update_pref_accommodation_type'], type='json', auth="public", website=True)
    def update_pref_accommodation_type(self, **kwargs):
        print('\n\n---------------------- update_pref_accommodation_type -------------------------------\n\n', kwargs, '\n\n')
        data_dict = {}
        accomodation_id_list = []

        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if kwargs.get("pref_accommodation_type"):
                    for accomodation_type in kwargs.get("pref_accommodation_type"):
                        accomodation_id = request.env['property.type'].sudo().search([('property_type', '=', accomodation_type)])
                        if accomodation_id.id:
                            accomodation_id_list.append(accomodation_id.id)
                    if accomodation_id_list:
                        house_mates_id.sudo().write({
                            'property_type': [(6, 0, accomodation_id_list)]
                        })

        return True

    @http.route(['/get_applicant_data'], type='json', auth="public", website=True)
    def get_applicant_data(self, **kwargs):
        print('\n\n---------------------- get_applicant_data -------------------------------\n\n', kwargs,'\n\n')
        data_dict = {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if house_mates_id.place_for == "me":
                    for person in house_mates_id.person_ids:
                        data_dict.update({
                            'me': [person[0].name,person[0].gender,person[0].age]
                        })
                if house_mates_id.place_for == "couple":
                    if len(house_mates_id.person_ids) == 2:
                        person_list = []
                        for person in house_mates_id.person_ids:
                            person_list.append([person.name,person.gender,person.age])

                        data_dict.update({
                            'couple': person_list
                        })
                if house_mates_id.place_for == "group":
                    person_list = []
                    for person in house_mates_id.person_ids:
                        person_list.append([person.name, person.gender, person.age])

                    data_dict.update({
                        'group': person_list
                    })

        return data_dict

    @http.route(['/update_applicant_info'], type='json', auth="public", website=True)
    def update_applicant_info(self, **kwargs):
        print('\n\n---------------------- update_applicant_info -------------------------------\n\n', kwargs, '\n\n')
        data_dict = {}
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if kwargs.get('place_for'):
                    if kwargs.get('place_for') == 'me':

                        print('111111111111111111')
                        for person in house_mates_id.person_ids:
                            print('222222222222')
                            person.sudo().unlink()

                        house_mates_id.place_for = "me"
                        line_dict1 = {
                            'name': kwargs.get('person_name'),
                            'gender': kwargs.get('person_gender'),
                            'age': int(kwargs.get('person_age')),
                            'housemate_id': house_mates_id.id,
                        }

                        new_line_id = request.env['about.person'].sudo().create(line_dict1)

                    if kwargs.get('place_for') == 'couple':
                        print('3333333333')
                        for person in house_mates_id.person_ids:
                            person.unlink()

                        house_mates_id.place_for = "couple"

                        line_dict1 = {
                            'name': kwargs.get('person1_name'),
                            'gender':kwargs.get('person1_gender'),
                            'age':int(kwargs.get('person1_age')),
                            'housemate_id':house_mates_id.id,
                        }

                        line_dict2 = {
                            'name': kwargs.get('person2_name'),
                            'gender': kwargs.get('person2_gender'),
                            'age': int(kwargs.get('person2_age')),
                            'housemate_id': house_mates_id.id
                        }

                        new_line_id = request.env['about.person'].sudo().create(line_dict1)
                        new_line_id = request.env['about.person'].sudo().create(line_dict2)

                    if kwargs.get('place_for') == 'group':
                        for person in house_mates_id.person_ids:
                            person.sudo().unlink()
                        for key in kwargs:
                            if isinstance(kwargs[key], dict):
                                line_dict_custom = kwargs[key]
                                line_dict_custom['housemate_id'] = house_mates_id.id
                                request.env['about.person'].sudo().create(line_dict_custom)
                        pass
        return True

    @http.route(['/update_suburbs'], type='json', auth="public", website=True)
    def update_suburbs(self, **kwargs):

        print('\n\n----------------------------------------------------------------\n\n',kwargs)
        if kwargs.get('current_finding_id'):
            current_finding_id = kwargs.get('current_finding_id')

            house_mates_id = request.env['house.mates'].sudo().browse(int(current_finding_id))

            if house_mates_id:
                if 'update_suburbs' in kwargs and kwargs.get('update_suburbs'):
                    print("\n\n\nSUBURBS:\n\n",kwargs.get('update_suburbs'))

                    #delete all previous suburbs before update
                    if house_mates_id.suburbs_ids:
                        for line in house_mates_id.suburbs_ids:
                            line.sudo().unlink()

                    self.create_suburbs_line(house_mates_id, kwargs.get('update_suburbs'))

        return True

    ##################################################################
    # --------------  End of Routes for AJAX -------------- #
    ##################################################################

class WebsiteBlogInherit(WebsiteBlog):

    #Inherited for replace the url from /blog to /info
    @http.route([
        '''/info/<model("blog.blog", "[('website_id', 'in', (False, current_website_id))]"):blog>/post/<model("blog.post", "[('blog_id','=',blog[0])]"):blog_post>''',
    ], type='http', auth="public", website=True)
    def blog_post(self, blog, blog_post, tag_id=None, page=1, enable_editor=None, **post):
        print('\n\n\nis hereeeeeeeeeeeeeeeeeeeeeeee 2222\n\n')
        """ Prepare all values to display the blog.

        :return dict values: values for the templates, containing

         - 'blog_post': browse of the current post
         - 'blog': browse of the current blog
         - 'blogs': list of browse records of blogs
         - 'tag': current tag, if tag_id in parameters
         - 'tags': all tags, for tag-based navigation
         - 'pager': a pager on the comments
         - 'nav_list': a dict [year][month] for archives navigation
         - 'next_post': next blog post, to direct the user towards the next interesting post
        """
        if not blog.can_access_from_current_website():
            print('\n\nnot accessssssssssssssssssssssss\n\n\n')
            raise werkzeug.exceptions.NotFound()

        BlogPost = request.env['blog.post']
        date_begin, date_end = post.get('date_begin'), post.get('date_end')

        pager_url = "/blogpost/%s" % blog_post.id

        pager = request.website.pager(
            url=pager_url,
            total=len(blog_post.website_message_ids),
            page=page,
            step=self._post_comment_per_page,
            scope=7
        )
        pager_begin = (page - 1) * self._post_comment_per_page
        pager_end = page * self._post_comment_per_page
        comments = blog_post.website_message_ids[pager_begin:pager_end]

        tag = None
        if tag_id:
            tag = request.env['blog.tag'].browse(int(tag_id))
        blog_url = QueryURL('', ['blog', 'tag'], blog=blog_post.blog_id, tag=tag, date_begin=date_begin,
                            date_end=date_end)

        if not blog_post.blog_id.id == blog.id:
            return request.redirect("/blog/%s/post/%s" % (slug(blog_post.blog_id), slug(blog_post)))

        tags = request.env['blog.tag'].search([])

        # Find next Post
        all_post = BlogPost.search([('blog_id', '=', blog.id)])
        if not request.env.user.has_group('website.group_website_designer'):
            all_post = all_post.filtered(lambda r: r.post_date <= fields.Datetime.now())

        if blog_post not in all_post:
            return request.redirect("/blog/%s" % (slug(blog_post.blog_id)))

        # should always return at least the current post
        all_post_ids = all_post.ids
        current_blog_post_index = all_post_ids.index(blog_post.id)
        nb_posts = len(all_post_ids)
        next_post_id = all_post_ids[(current_blog_post_index + 1) % nb_posts] if nb_posts > 1 else None
        next_post = next_post_id and BlogPost.browse(next_post_id) or False
        BlogPost = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'tags': tags,
            'tag': tag,
            'blog': blog,
            'blog_post': blog_post,
            'blog_posts1':BlogPost,#dynamic blogs added in li info list template
            'blog_post_cover_properties': json.loads(blog_post.cover_properties),
            'main_object': blog_post,
            'nav_list': self.nav_list(blog),
            'enable_editor': enable_editor,
            # 'next_post': next_post,
            # 'next_post_cover_properties': json.loads(next_post.cover_properties) if next_post else {},
            'date': date_begin,
            'blog_url': blog_url,
            'pager': pager,
            'comments': comments,
        }
        response = request.render("website_blog.blog_post_complete", values)

        request.session[request.session.sid] = request.session.get(request.session.sid, [])
        if not (blog_post.id in request.session[request.session.sid]):
            request.session[request.session.sid].append(blog_post.id)
            # Increase counter
            blog_post.sudo().write({
                'visits': blog_post.visits + 1,
            })
        return response

    #Inherited for replace the url from /blog to /info
    @http.route([
        '''/info/<model("blog.blog", "[('website_id', 'in', (False, current_website_id))]"):blog>''',
        '''/info/<model("blog.blog"):blog>/page/<int:page>''',
        '''/info/<model("blog.blog"):blog>/tag/<string:tag>''',
        '''/info/<model("blog.blog"):blog>/tag/<string:tag>/page/<int:page>''',
    ], type='http', auth="public", website=True)
    def blog(self, blog=None, tag=None, page=1, **opt):
        print('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        """ Prepare all values to display the blog.

        :return dict values: values for the templates, containing

         - 'blog': current blog
         - 'blogs': all blogs for navigation
         - 'pager': pager of posts
         - 'active_tag_ids' :  list of active tag ids,
         - 'tags_list' : function to built the comma-separated tag list ids (for the url),
         - 'tags': all tags, for navigation
         - 'state_info': state of published/unpublished filter
         - 'nav_list': a dict [year][month] for archives navigation
         - 'date': date_begin optional parameter, used in archives navigation
         - 'blog_url': help object to create URLs
        """
        if not blog.can_access_from_current_website():
            raise werkzeug.exceptions.NotFound()

        date_begin, date_end, state = opt.get('date_begin'), opt.get('date_end'), opt.get('state')
        published_count, unpublished_count = 0, 0

        domain = request.website.website_domain()

        BlogPost = request.env['blog.post']

        Blog = request.env['blog.blog']
        blogs = Blog.search(domain, order="create_date asc")

        # retrocompatibility to accept tag as slug
        active_tag_ids = tag and [int(unslug(t)[1]) for t in tag.split(',')] or []
        if active_tag_ids:
            domain += [('tag_ids', 'in', active_tag_ids)]
        if blog:
            domain += [('blog_id', '=', blog.id)]
        if date_begin and date_end:
            domain += [("post_date", ">=", date_begin), ("post_date", "<=", date_end)]

        if request.env.user.has_group('website.group_website_designer'):
            count_domain = domain + [("website_published", "=", True), ("post_date", "<=", fields.Datetime.now())]
            published_count = BlogPost.search_count(count_domain)
            unpublished_count = BlogPost.search_count(domain) - published_count

            if state == "published":
                domain += [("website_published", "=", True), ("post_date", "<=", fields.Datetime.now())]
            elif state == "unpublished":
                domain += ['|', ("website_published", "=", False), ("post_date", ">", fields.Datetime.now())]
        else:
            domain += [("post_date", "<=", fields.Datetime.now())]

        blog_url = QueryURL('', ['blog', 'tag'], blog=blog, tag=tag, date_begin=date_begin, date_end=date_end)

        blog_posts = BlogPost.search(domain, order="post_date desc")
        pager = request.website.pager(
            url=request.httprequest.path.partition('/page/')[0],
            total=len(blog_posts),
            page=page,
            step=self._blog_post_per_page,
            url_args=opt,
        )
        pager_begin = (page - 1) * self._blog_post_per_page
        pager_end = page * self._blog_post_per_page
        blog_posts = blog_posts[pager_begin:pager_end]

        all_tags = blog.all_tags()[blog.id]

        # function to create the string list of tag ids, and toggle a given one.
        # used in the 'Tags Cloud' template.
        def tags_list(tag_ids, current_tag):
            tag_ids = list(tag_ids)  # required to avoid using the same list
            if current_tag in tag_ids:
                tag_ids.remove(current_tag)
            else:
                tag_ids.append(current_tag)
            tag_ids = request.env['blog.tag'].browse(tag_ids).exists()
            return ','.join(slug(tag) for tag in tag_ids)

        tag_category = sorted(all_tags.mapped('category_id'), key=lambda category: category.name.upper())
        other_tags = sorted(all_tags.filtered(lambda x: not x.category_id), key=lambda tag: tag.name.upper())

        BlogPost1 = request.env['blog.post'].sudo().search([],limit=7,order="post_date desc")

        values = {
            'blog': blog,
            'blogs': blogs,
            'main_object': blog,
            'other_tags': other_tags,
            'state_info': {"state": state, "published": published_count, "unpublished": unpublished_count},
            'active_tag_ids': active_tag_ids,
            'tags_list': tags_list,
            'blog_posts': blog_posts,
            'blog_posts1' :BlogPost1,#to add blog names dynamically in li
            'blog_posts_cover_properties': [json.loads(b.cover_properties) for b in blog_posts],
            'pager': pager,
            'nav_list': self.nav_list(blog),
            'blog_url': blog_url,
            'date': date_begin,
            'tag_category': tag_category,
        }
        response = request.render("website_blog.blog_post_short", values)
        return response

    @http.route(['/get_property_owner_number'], type='json', auth="public", website=True, )
    def get_property_owner_number(self, **kwargs):
        """Get phone number and name of property owner"""
        if kwargs.get('property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs['property_id']))

            if property_id.user_id.partner_id.allowed_to_contact:
                return {'name': property_id.user_id.partner_id.name, 'phone': property_id.user_id.partner_id.mobile}
            else:
                return {'name': property_id.user_id.partner_id.name}
        return False

    @http.route(['/get_current_user_id'], type='json', auth="public", website=True, )
    def get_current_user_id(self, **kwargs):
        if request.env.user.id:
            return {'id':request.env.user.id}



    @http.route(['/edit_deactivate_listing'], type='json', auth="public", website=True, )
    def edit_deactivate_listing(self,**kwargs):
        """Get phone number and name of property owner"""
        print("\n\n----------edit_deactivate_listing-------------",kwargs)
        if kwargs.get('property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs['property_id']))
            property_id.sudo().write({'state':'deactive'})
        return True

    @http.route(['/edit_activate_listing'], type='json', auth="public", website=True, )
    def edit_activate_listing(self, **kwargs):
        """Get phone number and name of property owner"""
        print("\n\n----------edit_activate_listing-------------", kwargs)
        if kwargs.get('property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs['property_id']))
            property_id.sudo().write({'state': 'active'})
        return True

    @http.route(['/edit_delete_listing'], type='json', auth="public", website=True, )
    def edit_delete_listing(self, **kwargs):
        """Get phone number and name of property owner"""
        print("\n\n----------edit_delete_listing-------------", kwargs)
        if kwargs.get('property_id'):
            property_id = request.env['house.mates'].sudo().browse(int(kwargs['property_id']))
            property_id.sudo().write({'state':'deleted'})
        return True

    @http.route(['/replace_page'], type='json', auth="public", website=True, )
    def replace_page(self, **kwargs):
        print("\n\n----------edit_delete_listing-------------", kwargs)
        if kwargs.get('path') and kwargs.get('path') == '/my':
            return True




