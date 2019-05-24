import json
import io
import base64
import logging
import werkzeug
from io import StringIO, BytesIO
from werkzeug.utils import redirect
from datetime import date, datetime, timedelta
from odoo.exceptions import AccessError, UserError
from odoo.addons.auth_signup.models.res_users import SignupError
from odoo.addons.web.controllers.main import ensure_db, Home

try:
    import httpagentparser
except ImportError:
    pass
from time import gmtime, strftime

import odoo
from odoo.http import request
from odoo import http, tools, _
from odoo.addons.web.controllers.main import Home
from odoo.addons.website.controllers.main import Website
from odoo.addons.website_blog.controllers.main import WebsiteBlog
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.http_routing.models.ir_http import slug, unslug
from odoo import http, fields
from odoo.addons.auth_signup.controllers.main import AuthSignupHome
_logger = logging.getLogger(__name__)


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
        return request.render('pragtech_flatmates_system.login_message', values)


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

                template = request.env.ref('pragtech_flatmates_system.mail_login_alert')
                assert template._name == 'mail.template'

                template_values = {
                    #             'email_to': '${object.email|safe}',
                    'email_cc': False,
                    'auto_delete': True,
                    'partner_to': False,
                    'scheduled_date': False,
                }

                template.sudo().write(template_values)
                for user in user_rec:
                    print("===============user==============", user.login)
                    if not user.email:
                        raise UserError(_("Cannot send email: user %s has no email address.") % user.name)
                    with request.env.cr.savepoint():
                        template.sudo().with_context(lang=user.lang).send_mail(user.id, force_send=True, raise_exception=True)
                    _logger.info("Password reset email sent for user <%s> to <%s>", user.login, user.email)


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
        # return http.request.render('pragtech_flatmates_system.home',
        #                             {'length' : data_list })
        return http.request.render('pragtech_flatmates_system.home')

    @http.route(website=True, auth="public")
    def web_login(self, redirect=None, *args, **kw):
        response = super(Website_Inherit, self).web_login(redirect=redirect, *args, **kw)

        print('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ', request.session)
        list_place = False
        find_place = False

        if request.session.get('list_place'):
            list_place = request.session.get('list_place')

        if request.session.get('find_place'):
            find_place = request.session.get('find_place')

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
            # else:
            #     print('treeeeeeeeeeeeeeeeeee 2222222222222222222')
            #     redirect = '/'
            # return http.redirect_with_hash(redirect)
        return response


class FlatMates(http.Controller):

    @http.route(['/shortlist'], type='http', auth="public", website=True, csrf=False)
    def short_listting(self, **kwargs):
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

        # print('\n\n\nKWARGS ::\n',kwargs,'\n\n\n')
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

        return request.render("pragtech_flatmates_system.home")

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
    #     return request.render("pragtech_flatmates_system.property_detail11", values)

    @http.route(['/P<id>'], type='http', auth="public", website=True, csrf=True)
    def property_detail(self, id, **kwargs):
        print("\n\nID -----------------------", id)
        property = request.env['house.mates'].sudo().search([('id', '=', id)], limit=1)
        print (property.street,property.street2,property.city)
        if property.street:
            property_address = property.street
        else:
            property_address = ''

        if property.street2:
                property_address= property.street2
        if property.city:
            property_address+= ', ' + property.city

        values = {'property': property, 'property_address': property_address}
        if property.listing_type == 'list':
            values.update({'listing_type':'List'})
        if property.listing_type == 'find':
            values.update({'listing_type':'Find'})
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
            values.update({'listing_type':'House'})
        if property.type == 'flat':
            values.update({'listing_type':'Flat'})
        if property.description_about_property:
            values.update({'description_about_property': property.description_about_property})
        if property.description_about_user:
            values.update({'description_about_user': property.description_about_user})
        if property.backpackers == True:
            values.update(({'backpackers': 'Backpackers'}))
        if property.smokers == True:
            values.update({'smokers': 'Smokers'})
        if property.fourty_year_old == True:
            values.update({'fourty_year_old': '40+ years olds'})
        if property.pets == True:
            values.update({'pets': 'Pets'})
        if property.on_welfare == True:
            values.update({'on_welfare': 'On welfare'})
        if property.students == True:
            values.update(({'students': 'Students'}))
        if property.LGBTI == True:
            values.update({'LGBTI': 'LGBTI'})
        if property.children == True:
            values.update({'children': 'Children'})
        if property.retirees == True:
            values.update({'retirees': 'Retirees'})
        if property.min_len_stay_id:
            values.update({'min_len_stay_id': property.min_len_stay_id.name})
        if property.avil_date:
            values.update({'avil_date': property.avil_date})
        if property.weekly_budget:
            values.update({'weekly_budget': property.weekly_budget})
        if property.bond_id:
            values.update({'bond_id': property.bond_id.name})
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

        if property.internet_id:
            values.update({'internet_id':property.internet_id.name})
        if property.property_type:
            print("=====ghghghgh====",property.property_type)
            values.update({'accomodation_type':property.property_type})
        return request.render("pragtech_flatmates_system.property_detail11", values)

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
        if request.uid:
            user = request.env['res.users'].sudo().search([('id','=',request.uid)])
            print("\n\n====request.uid===",user.house_mates_ids)
        return request.render("pragtech_flatmates_system.shortlist_page", )

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
            return request.render("pragtech_flatmates_system.list_place")

    @http.route(['/listplace/describe-your-place/accommodation'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_accommodation(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.list_place_accommodation", )

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

        return request.render("pragtech_flatmates_system.about_template", data)

    @http.route(['/listplace/whole-property/property-type'], type='http', auth="public", website=True, csrf=False)
    def list_place_whole_property_property_type(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        else:

            return request.render("pragtech_flatmates_system.whole_property_template", )

    @http.route(['/listplace/<property_type>/who-lives-here'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_who_lives_here(self, property_type, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        if kwargs['type_of_accomodation'] == "whole-property" :
            bond_ids = request.env['bond.bond'].sudo().search([])
            bill_ids = request.env['bill.bill'].sudo().search([])

            data = {'bond_ids': bond_ids,
                    'bill_ids': bill_ids,
                    'type_of_accomodation':kwargs['type_of_accomodation'],
                    }

            return request.render("pragtech_flatmates_system.rent_bond_bills", data)


        total_flatmates = request.env['total.flatmates'].sudo().search([('view_for','=','List')])

        data = {'total_flatmates': total_flatmates,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })


        return request.render("pragtech_flatmates_system.about_who_lives_here_template", data)

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

        return request.render("pragtech_flatmates_system.about_rooms_template", data)

    @http.route(['/listplace/<property_type>/rent-bond-bills'], type='http', auth="public", website=True,
                method=['POST'], csrf=False)
    def list_place_share_house_rent_bond_bills(self, property_type, **kwargs):
        print('\n\n\n Request session List Place Dict  in 4444: \n', request.session.list_place_dict)

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

        return request.render("pragtech_flatmates_system.rent_bond_bills", data)

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

        return request.render("pragtech_flatmates_system.room_availability", data)

    @http.route(['/listplace/<property_type>/property-images'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_property_images(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.property_images", data)

    @http.route(['/listplace/<property_type>/describe-your-flatmate'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_describe_your_flatmate(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_describe_your_flatmate", data)

    @http.route(['/listplace/<property_type>/flatmate-preference'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_flatmate_preference(self, **kwargs):

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

        return request.render("pragtech_flatmates_system.flatmate_preference_template", data)

    @http.route(['/listplace/<property_type>/accepting'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_accepting(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_accepting", data)

    @http.route(['/listplace/<property_type>/introduce-yourself'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_share_house_introduce_yourself(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_describe_yourself", data)

    @http.route(['/listplace/<property_type>/about-others'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_about_others(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_about_others", data)

    @http.route(['/listplace/<property_type>/about-property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_comment_about_property(self, **kwargs):

        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'list_place': True})

            return werkzeug.utils.redirect('/web/login', )

        return request.render("pragtech_flatmates_system.list_place_comment_about_property", )

    @http.route(['/list/my/property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_my_property(self, **kwargs):
        return request.render("pragtech_flatmates_system.list_my_property", )

    @http.route(['/find/a/property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def find_a_property(self, **kwargs):
        return request.render("pragtech_flatmates_system.find_a_property", )

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
                pass

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
            if 'country' in list_place_dict and list_place_dict.get('country'):
                country_name = list_place_dict.get('country')
                country_id = request.env['res.country'].sudo().search([('name','=',country_name)],limit=1)
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
                print('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh')
                vals.update({
                    'description_about_property':list_place_dict.get('comment_about_property')
                })

        vals.update({
            'user_id':request.env.user.id,
            'listing_type':'list'
        })

        print('\n\nVals :: \n\n',vals,'\n\n\n')
        if vals:
            flat_mates_id = flat_mates_obj.sudo().create(vals)

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

        else:
            result={}

        print('\n\n+++++++++++++++++++++++++++++++++++++++++++++\n\n')
        print('Result :: ',result)
        print('\n\n+++++++++++++++++++++++++++++++++++++++++++++\n\n')

        return json.dumps(result)

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
        print('\n\n\n\n Find Property \n',find_place_data,'\n\n\n')
        flat_mates_obj = request.env['house.mates']
        find_proprty_created = False
        vals = {}

        if find_place_data:
            find_place_dict = find_place_data[0]


            if 'find_property_looking_for' in find_place_dict and find_place_dict.get('find_property_looking_for'):
                accomodation_id_list=[]
                for accomodation_type in find_place_dict.get('find_property_looking_for'):
                    accomodation_id= request.env['property.type'].sudo().search([('property_type','=',accomodation_type)])
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

    @http.route(['/list_place_preview'], type='http', auth="public", website=True, csrf=False)
    def list_place_preview(self, **kwargs):
        return request.render("pragtech_flatmates_system.list_place_preview_template", )
        






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
            return request.render("pragtech_flatmates_system.find_place", )

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
            return request.render("pragtech_flatmates_system.find_place_accommodation",values)

    @http.route(['/find-place/describe-your-ideal-place/about-flatmates'], type='http', auth="public", website=True,
                csrf=False)
    def find_place_about_flatmates(self, **kwargs):
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_about_template", )

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
            return request.render("pragtech_flatmates_system.find_rent_timimg", data )

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

            return request.render("pragtech_flatmates_system.find_property_preferences", data )

    @http.route(['/find-place/describe-your-ideal-place/introduce-yourself'], type='http', auth="public", website=True,
                csrf=False)
    def find_introduce_yourself(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_introduce_yourself", )

    @http.route(['/find-place/describe-your-ideal-place/introduce-flatmates'], type='http', auth="public", website=True,
                csrf=False)
    def find_introduce_flatmates(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_introduce_flatmates", )

    @http.route(['/find-place/describe-your-ideal-place/employment'], type='http', auth="public", website=True,
                csrf=False)
    def find_employment(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_employment", )

    @http.route(['/find-place/describe-your-ideal-place/lifestyle'], type='http', auth="public", website=True,
                csrf=False)
    def find_lifestyle(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_lifestyle", )

    @http.route(['/find-place/describe-your-ideal-place/about-yourself'], type='http', auth="public", website=True,
                csrf=False)
    def find_about_yourself(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_about_yourself", )

    @http.route(['/find_place_preview'], type='http', auth="public", website=True, csrf=False)
    def find_place_preview(self, **kwargs):
        return request.render("pragtech_flatmates_system.find_place_preview_template", )
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
    @http.route(['/info'], type='http', auth="public", website=True, csrf=True)
    def info(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([],limit=7)

        values = {
            'blog_posts':BlogPost,
        }

        return request.render("pragtech_flatmates_system.info_template",values)

    @http.route(['/info/flatmate-inspections'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_inspection(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_flatmate_inspection",values)

    @http.route(['/info/home-share-melbourne'], type='http', auth="public", website=True, csrf=True)
    def info_home_share_melbourne(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_home_share_melbourne",values)

    @http.route(['/info/message-response-rate'], type='http', auth="public", website=True, csrf=True)
    def info_message_response_rate(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_message_response_rate",values)

    @http.route(['/info/verification'], type='http', auth="public", website=True, csrf=True)
    def info_verification(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_verification",values)

    @http.route(['/info/frequently-asked-questions'], type='http', auth="public", website=True, csrf=True)
    def info_frequently_asked_questions(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_frequently_asked_questions",values)

    @http.route(['/info/why-upgrade'], type='http', auth="public", website=True, csrf=True)
    def info_why_upgrade(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_why_upgrade",values)

    @http.route(['/info/how-does-it-work'], type='http', auth="public", website=True, csrf=True)
    def info_how_does_it_work(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_how_does_it_work",values)

    @http.route(['/info/find-share-accommodation'], type='http', auth="public", website=True, csrf=True)
    def info_find_share_accommodation(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_find_share_accommodation",values)

    @http.route(['/info/rent-your-spare-room'], type='http', auth="public", website=True, csrf=True)
    def info_rent_your_spare_room(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_rent_your_spare_room",values)

    @http.route(['/info/teamups'], type='http', auth="public", website=True, csrf=True)
    def info_teamups(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_teamups",values)

    @http.route(['/info/how-to-contact'], type='http', auth="public", website=True, csrf=True)
    def info_how_to_contact(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_how_to_contact",values)

    @http.route(['/value-my-room'], type='http', auth="public", website=True, csrf=True)
    def info_value_my_room(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_value_my_room",values)

    @http.route(['/info/legal-introduction'], type='http', auth="public", website=True, csrf=True)
    def info_legal_introduction(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_legal_introduction",values)

    @http.route(['/info/holding-deposits'], type='http', auth="public", website=True, csrf=True)
    def info_holding_deposits(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_holding_deposits",values)

    @http.route(['/info/share-accommodation-legal-situations'], type='http', auth="public", website=True, csrf=True)
    def info_share_accommodation_legal_situations(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_share_accommodation_legal_situations",values)

    @http.route(['/info/planning-rules'], type='http', auth="public", website=True, csrf=True)
    def info_planning_rules(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_planning_rules",values)

    @http.route(['/info/pre-agreement-checklist'], type='http', auth="public", website=True, csrf=True)
    def info_pre_agreement_checklist(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_pre_agreement_checklist",values)

    @http.route(['/info/flatmate-agreement'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_agreement(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_flatmate_agreement",values)


    @http.route(['/info/bonds'], type='http', auth="public", website=True, csrf=True)
    def info_bonds(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_bonds",values)

    @http.route(['/info/condition-reports'], type='http', auth="public", website=True, csrf=True)
    def info_condition_reports(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_condition_reports",values)

    @http.route(['/info/tenancy-agreements'], type='http', auth="public", website=True, csrf=True)
    def info_tenancy_agreements(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_tenancy_agreements",values)

    @http.route(['/info/rent-payments'], type='http', auth="public", website=True, csrf=True)
    def info_rent_payments(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_rent_payments",values)

    @http.route(['/info/rights-obligations'], type='http', auth="public", website=True, csrf=True)
    def info_rights_obligations(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_rights_obligations",values)

    @http.route(['/info/ending-tenancy'], type='http', auth="public", website=True, csrf=True)
    def info_ending_tenancy(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_ending_tenancy",values)

    @http.route(['/info/resolving-disputes'], type='http', auth="public", website=True, csrf=True)
    def info_resolving_disputes(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_resolving_disputes",values)

    @http.route(['/info/about'], type='http', auth="public", website=True, csrf=True)
    def info_about(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_about",values)

    @http.route(['/info/terms'], type='http', auth="public", website=True, csrf=True)
    def info_terms(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_terms",values)

    @http.route(['/live-rent-free'], type='http', auth="public", website=True, csrf=True)
    def info_live_rent_free(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_live_rent_free",values)

    @http.route(['/info/press'], type='http', auth="public", website=True, csrf=True)
    def info_press(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_press",values)

    @http.route(['/info/community-charter'], type='http', auth="public", website=True, csrf=True)
    def info_community_charter(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_community_charter",values)

    @http.route(['/info/privacy'], type='http', auth="public", website=True, csrf=True)
    def info_privacy(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_privacy",values)

    @http.route(['/contact'], type='http', auth="public", website=True, csrf=True)
    def info_contact(self, **kwargs):
        BlogPost = request.env['blog.post'].sudo().search([], limit=7)

        values = {
            'blog_posts': BlogPost,
        }
        return request.render("pragtech_flatmates_system.info_contact",values)

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

    @http.route('/get_product', auth='public', type='json', website=True)
    def get_product(self, record_id, filters=None) :
        property_list = []
        property_data = {}
        domain = []
        properties=''
        fields = ['id', 'street2', 'city', 'listing_type', 'state', 'weekly_budget', 'description_about_property', 'property_image_ids', 'total_bathrooms_id', 'total_bedrooms_id', 'total_no_flatmates_id', 'person_ids', 'is_short_list']

        print ("\n\n\n",filters[0])
        print ("\n\n\n", filters[0].get('max_age'))
        if filters[0].get('listing_type') =='home':
            # print ("Homeeeeeeeeeeeeeeee")
            properties = request.env['house.mates'].sudo().search_read(domain=[('id', '>', record_id),('state','=','active')], fields=fields, order='id', limit=16)
        if not filters[0].get('listing_type'):
            # print ("Homeeeeeeeeeeeeeeee")
            properties = request.env['house.mates'].sudo().search_read(domain=[('id', '>', record_id),('state','=','active')], fields=fields, order='id', limit=16)

        domain=[('id', '>', record_id),('state','=','active')]
        if filters[0].get('listing_type') == 'find':
            # print ("Finddddddddddddddddd",filters[0])

            domain.append(('listing_type','=','find'))
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
                    domain.append(('person_ids.gender','=','male'))
                    domain.append(('person_ids.gender', '=', 'female'))
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
                formated_date=datetime.strptime(date, '%m/%d/%y')
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



            # print ("Recordddddddddddddddddd-------",domain)

            properties = request.env['house.mates'].sudo().search_read(domain=domain, fields=fields, order='id', limit=16)
        domain= [('id', '>', record_id),('state','=','active')]
        if filters[0].get('listing_type') == 'list':
            accomodation_type_room = [value for key, value in filters[0].items() if 'room_accommodation' in key]
            print('\n\n\naccomodation_type_room ::\n', accomodation_type_room, '\n\n\n')
            print ("listinggggggggggg--------",filters[0])
            domain.append(('listing_type','=','list'))
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
                    domain.append(('person_ids.gender', '=', 'female'))
                if filters[0].get('search_gender') == 'males_only':
                    domain.append(('person_ids.gender', '=', 'male'))
                if filters[0].get('search_gender') == 'anyone':
                    domain.append(('person_ids.gender', '=', 'male'))
                    domain.append(('person_ids.gender', '=', 'female'))
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
                formated_date = datetime.strptime(date, '%m/%d/%y')
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

            # print ("Recordddddddddddddddddd-------",domain)

            properties = request.env['house.mates'].sudo().search_read(domain=domain,fields=fields,order='id', limit=16)

        # print ("Recordddddddddddddddddd----8888888888888888888888---",properties)
        if filters[0].get('listing_type') =='shortlist':
            # print ("Homeeeeeeeeeeeeeeee")
            print ("0----------------------------------0",request.env.user.house_mates_ids.ids)
            properties = request.env['house.mates'].sudo().search_read(domain=[('id', 'in', request.env.user.house_mates_ids.ids),('id', '>', record_id),('state','=','active')], fields=fields, order='id', limit=16)
            # print("Streettt---------------------------", properties)
        for rec in properties:
            # print("Streettt---------------------------", properties)
            property_image_main = request.env['property.image'].sudo().search_read(
                domain=[('flat_mates_id','=',rec.get('id')),('id', 'in', rec.get('property_image_ids'))], fields=['image'], order='id', limit=1)
            # print ("-----------------------------",property_image_main)
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

            if rec.get('listing_type') == 'find':
                if rec.get('person_ids'):
                    # print("Personnnnnnnnnnnnnnnn",rec.get('person_ids')[0])
                    about_person = request.env['about.person'].sudo().search([('id','=',rec.get('person_ids')[0])])
                    property_data['name'] = about_person.name
                    property_data['age'] = about_person.age
                    property_data['gender'] = about_person.gender







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

        user_profile_pic = request.env.user.image
        if user_profile_pic:
            data.update({'user_profile_pic':user_profile_pic})

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

        res_user = request.env['res.users'].search([('id', '=', request.env.user.id)])
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
        user_image = request.env.user.image

        data = {
                'user_name':user_name,
                'user_email':user_email,

                }
        if user_mobile:
            data.update({'user_mobile':user_mobile})
        if user_image:
            data.update({'user_image':user_image})

        return data

    @http.route(['/country'], type='json', auth="public", website=True, )
    def country_code(self, **kwargs):
        res_country = request.env['res.country'].search([])
        value = {}
        value['country'] = [[i.id, i.name+" (+"+str(i.phone_code)+")"] for i in res_country]
        return value
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
        BlogPost = request.env['blog.post'].sudo().search([],limit=7)

        values = {
            'tags': tags,
            'tag': tag,
            'blog': blog,
            'blog_post': blog_post,
            'blog_posts':BlogPost,#dynamic blogs added in li info list template
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

        values = {
            'blog': blog,
            'blogs': blogs,
            'main_object': blog,
            'other_tags': other_tags,
            'state_info': {"state": state, "published": published_count, "unpublished": unpublished_count},
            'active_tag_ids': active_tag_ids,
            'tags_list': tags_list,
            'blog_posts': blog_posts,
            'blog_posts_cover_properties': [json.loads(b.cover_properties) for b in blog_posts],
            'pager': pager,
            'nav_list': self.nav_list(blog),
            'blog_url': blog_url,
            'date': date_begin,
            'tag_category': tag_category,
        }
        response = request.render("website_blog.blog_post_short", values)
        return response

