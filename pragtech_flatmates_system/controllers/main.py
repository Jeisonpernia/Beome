import json
import base64
import logging
import werkzeug
from io import StringIO, BytesIO
from werkzeug.utils import redirect

import odoo
from odoo.http import request
from odoo import http, tools, _
from odoo.addons.web.controllers.main import Home
from odoo.addons.website.controllers.main import Website


class Website_Inherit(Website):
    @http.route('/', auth='public', website=True)
    def index(self, **kw):
        print('\n\n\n ################################################ \n\n')
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

    @http.route(['/P<id>'], type='http', auth="public", website=True, csrf=True)
    def property_detail(self, id, **kwargs):
        print("\n\nID -----------------------", id)

        return request.render("pragtech_flatmates_system.property_detail11", {})

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

        parking = request.env['parking'].sudo().search([])
        internet = request.env['internet'].sudo().search([])
        bedrooms = request.env['bedrooms'].sudo().search([])
        bathrooms = request.env['bathrooms'].sudo().search([])
        room_furnishings = request.env['room.furnishing'].sudo().search([])

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


        total_flatmates = request.env['total.flatmates'].sudo().search([])

        data = {'total_flatmates': total_flatmates,
                }

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })


        return request.render("pragtech_flatmates_system.about_who_lives_here_template", data)

    @http.route(['/listplace/<property_type>/about-rooms'], type='http', auth="public", website=True, method=['POST'],
                csrf=False)
    def list_place_about_rooms(self, property_type, **kwargs):

        room_types = request.env['room.types'].sudo().search([])
        room_furnishings = request.env['room.furnishing'].sudo().search([])
        bathroom_types = request.env['bathroom.types'].sudo().search([])

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

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.property_images", data)

    @http.route(['/listplace/<property_type>/describe-your-flatmate'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_describe_your_flatmate(self, **kwargs):

        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_describe_your_flatmate", data)

    @http.route(['/listplace/<property_type>/flatmate-preference'], type='http', auth="public", website=True,
                csrf=False, method=['POST'])
    def list_place_flatmate_preference(self, **kwargs):

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
        data = {}

        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_accepting", data)

    @http.route(['/listplace/<property_type>/introduce-yourself'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_share_house_introduce_yourself(self, **kwargs):
        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_describe_yourself", data)

    @http.route(['/listplace/<property_type>/about-others'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_about_others(self, **kwargs):

        data = {}
        if kwargs.get('type_of_accomodation'):
            data.update({'type_of_accomodation': kwargs['type_of_accomodation']
                         })

        return request.render("pragtech_flatmates_system.list_place_about_others", data)

    @http.route(['/listplace/<property_type>/about-property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def list_place_comment_about_property(self, **kwargs):
        return request.render("pragtech_flatmates_system.list_place_comment_about_property", )

    @http.route(['/list/my/property'], type='http', auth="public", website=True, csrf=False,
                method=['POST'])
    def lisy_my_property(self, **kwargs):
        return request.render("pragtech_flatmates_system.list_my_property", )

    # ================== Create Property in Odoo ===================================#
    @http.route('/create/list_property', auth='public', type='json', website=True)
    def create_list_property(self, list_place_data):

        print('\n\n\n-----------------------------------  create_list_property  ----------------------------------------------\n\n')
        print('List place data :\n',list_place_data[0],'\n\n\n')
        flat_mates_obj = request.env['flat.mates']

        vals = {}

        if list_place_data:
            list_place_dict = list_place_data[0]

            if 'accommodation_type' in list_place_dict and list_place_dict.get('accommodation_type'):
                print('1111111111111111111111111111111111111111')
                if list_place_dict.get('accommodation_type') == 'sharehouse':
                    vals.update({
                        'accommodation_type': 'rooms_in_an_existing_sharehouse'
                    })
                elif list_place_dict.get('accommodation_type') == 'whole-property':
                    vals.update({
                        'accommodation_type': 'whole_property_for_rent'
                    })
                elif list_place_dict.get('accommodation_type') == 'student-accomodation':
                    vals.update({
                        'accommodation_type': 'student_accommodation'
                    })
                elif list_place_dict.get('accommodation_type') == 'homestay':
                    vals.update({
                        'accommodation_type': 'homestay'
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
                    'weekly_rent': float(list_place_dict.get('weekly_rent'))
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
                values = {}
                accept_list = []
                accept_obj = request.env['property.accepting']
                for accept in list_place_dict.get('accepting'):
                    values.update({
                        'name':accept.capitalize()
                    })

                    accept_id = accept_obj.sudo().create(values)
                    accept_list.append(accept_id.id)

                if accept_list:
                    vals.update({
                        'accepting_ids': [( 6, 0, accept_list)]
                    })

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
            'user_id':request.env.user.id
        })

        print('\n\nVals :: \n\n',vals,'\n\n\n')
        if vals:
            flat_mates_id = flat_mates_obj.sudo().create(vals)

            if flat_mates_id and 'rooms_data' in list_place_dict and list_place_dict.get('rooms_data'):
                print('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII Method call for create line')
                self.create_about_rooms_lines(list_place_dict.get('rooms_data'),flat_mates_id)

            if 'property_images' in list_place_dict and list_place_dict.get('property_images'):
                images = self.create_property_images(list_place_dict.get('property_images'), flat_mates_id)

                if images:
                    flat_mates_id.write({
                        'property_image_ids': [( 6, 0, images)]
                    })


        return True

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
        print (images_data,"Imagedsssssssssssssssss Data")

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

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_place_accommodation", )

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
            return request.render("pragtech_flatmates_system.find_rent_timimg", )

    @http.route(['/find-place/describe-your-ideal-place/property-preferences'], type='http', auth="public",
                website=True, csrf=False)
    def find_property_preferences(self, **kwargs):
        print("----------------")
        is_user_public = request.env.user.has_group('base.group_public')

        if is_user_public:
            request.session.update({'find_place': True})

            return werkzeug.utils.redirect('/web/login', )
        else:
            return request.render("pragtech_flatmates_system.find_property_preferences", )

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

    ##################################################################
    # --------------  End of Routes for find my place -------------- #
    ##################################################################

    ###########################################################
    # --------------  Routes for info -------------- #
    ###########################################################

    @http.route(['/info'], type='http', auth="public", website=True, csrf=True)
    def info(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_template")

    @http.route(['/info/flatmate-inspections'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_inspection(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_flatmate_inspection")

    @http.route(['/info/home-share-melbourne'], type='http', auth="public", website=True, csrf=True)
    def info_home_share_melbourne(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_home_share_melbourne")

    @http.route(['/info/message-response-rate'], type='http', auth="public", website=True, csrf=True)
    def info_message_response_rate(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_message_response_rate")

    @http.route(['/info/verification'], type='http', auth="public", website=True, csrf=True)
    def info_verification(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_verification")

    @http.route(['/info/frequently-asked-questions'], type='http', auth="public", website=True, csrf=True)
    def info_frequently_asked_questions(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_frequently_asked_questions")

    @http.route(['/info/why-upgrade'], type='http', auth="public", website=True, csrf=True)
    def info_why_upgrade(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_why_upgrade")

    @http.route(['/info/how-does-it-work'], type='http', auth="public", website=True, csrf=True)
    def info_how_does_it_work(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_how_does_it_work")

    @http.route(['/info/find-share-accommodation'], type='http', auth="public", website=True, csrf=True)
    def info_find_share_accommodation(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_find_share_accommodation")

    @http.route(['/info/rent-your-spare-room'], type='http', auth="public", website=True, csrf=True)
    def info_rent_your_spare_room(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_rent_your_spare_room")

    @http.route(['/info/teamups'], type='http', auth="public", website=True, csrf=True)
    def info_teamups(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_teamups")

    @http.route(['/info/how-to-contact'], type='http', auth="public", website=True, csrf=True)
    def info_how_to_contact(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_how_to_contact")

    @http.route(['/value-my-room'], type='http', auth="public", website=True, csrf=True)
    def info_value_my_room(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_value_my_room")

    @http.route(['/info/legal-introduction'], type='http', auth="public", website=True, csrf=True)
    def info_legal_introduction(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_legal_introduction")

    @http.route(['/info/holding-deposits'], type='http', auth="public", website=True, csrf=True)
    def info_holding_deposits(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_holding_deposits")

    @http.route(['/info/share-accommodation-legal-situations'], type='http', auth="public", website=True, csrf=True)
    def info_share_accommodation_legal_situations(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_share_accommodation_legal_situations")

    @http.route(['/info/planning-rules'], type='http', auth="public", website=True, csrf=True)
    def info_planning_rules(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_planning_rules")

    @http.route(['/info/pre-agreement-checklist'], type='http', auth="public", website=True, csrf=True)
    def info_pre_agreement_checklist(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_pre_agreement_checklist")

    @http.route(['/info/flatmate-agreement'], type='http', auth="public", website=True, csrf=True)
    def info_flatmate_agreement(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_flatmate_agreement")


    @http.route(['/info/bonds'], type='http', auth="public", website=True, csrf=True)
    def info_bonds(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_bonds")

    @http.route(['/info/condition-reports'], type='http', auth="public", website=True, csrf=True)
    def info_condition_reports(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_condition_reports")

    @http.route(['/info/tenancy-agreements'], type='http', auth="public", website=True, csrf=True)
    def info_tenancy_agreements(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_tenancy_agreements")

    @http.route(['/info/rent-payments'], type='http', auth="public", website=True, csrf=True)
    def info_rent_payments(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_rent_payments")

    @http.route(['/info/rights-obligations'], type='http', auth="public", website=True, csrf=True)
    def info_rights_obligations(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_rights_obligations")

    @http.route(['/info/ending-tenancy'], type='http', auth="public", website=True, csrf=True)
    def info_ending_tenancy(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_ending_tenancy")

    @http.route(['/info/resolving-disputes'], type='http', auth="public", website=True, csrf=True)
    def info_resolving_disputes(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_resolving_disputes")

    @http.route(['/info/about'], type='http', auth="public", website=True, csrf=True)
    def info_about(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_about")

    @http.route(['/info/terms'], type='http', auth="public", website=True, csrf=True)
    def info_terms(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_terms")

    @http.route(['/live-rent-free'], type='http', auth="public", website=True, csrf=True)
    def info_live_rent_free(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_live_rent_free")

    @http.route(['/info/press'], type='http', auth="public", website=True, csrf=True)
    def info_press(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_press")

    @http.route(['/info/community-charter'], type='http', auth="public", website=True, csrf=True)
    def info_community_charter(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_community_charter")

    @http.route(['/info/privacy'], type='http', auth="public", website=True, csrf=True)
    def info_privacy(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_privacy")

    @http.route(['/contact'], type='http', auth="public", website=True, csrf=True)
    def info_contact(self, **kwargs):
        return request.render("pragtech_flatmates_system.info_contact")

    ##################################################################
    # --------------  End of Routes for info -------------- #
    ##################################################################

    ###########################################################
    # --------------  Routes for AJAX -------------- #
    ###########################################################

    @http.route('/get_aboutroom', auth='public', type='json', website=True)
    def get_aboutroom(self):

        room_types = request.env['room.types'].sudo().search_read(fields=['id', 'name'])
        room_furnishing = request.env['room.furnishing'].sudo().search_read(fields=['id', 'name'])
        bathroom_types = request.env['bathroom.types'].sudo().search_read(fields=['id', 'name'])

        print("Recordddddddddddddddddd-------", room_types)
        print("Recordddddddddddddddddd-------", room_furnishing)
        print("Recordddddddddddddddddd-------", bathroom_types)

        data = [{'room_types': room_types, 'room_furnishing': room_furnishing, 'bathroom_types': bathroom_types}]
        return data

    @http.route('/get_product', auth='public', type='json', website=True)
    def get_product(self, record_id):
        property_list = []
        property_data = {}

        properties = request.env['flat.mates'].sudo().search_read(domain=[('id', '>', record_id)],
                                                                  fields=['id', 'street2', 'city', 'description',
                                                                          'property_image_ids'], order='id', limit=16)
        # print ("Recordddddddddddddddddd-------",properties)

        for rec in properties:
            # print("Streettt---------------------------", rec.get('street2'))
            property_image_main = request.env['property.image'].sudo().search_read(
                domain=[('flat_mates_id','=',rec.get('id')),('id', 'in', rec.get('property_image_ids'))], fields=['image'], order='id', limit=1)
            # print ("-----------------------------",property_image_main)
            property_data = {}
            property_data['id'] = rec.get('id')
            property_data['street'] = rec.get('street2')
            property_data['city'] = rec.get('city')
            property_data['description'] = rec.get('description')
            if property_image_main:
                property_data['image'] = property_image_main[0].get('image')

            property_list.append(property_data.copy())

        # print (property_list)
        return property_list

        # properties1 = request.env['product.product'].sudo().search_read(domain=[('id','>',record_id)],fields=['id','name','default_code','image_medium','description'], order='id', limit=16)
        # # print ("Recordddddddddddddddddd-------",properties)
        # return properties1

    @http.route('/get_info_webpages', auth='public', type='json', website=True)
    def get_info_webpages(self, record_id):

        print("qw rrrrrrrrrrrrrrrrrrrr yt ut tttttttttttt")
        webpage_data_id = request.env['webpage.extension'].sudo().browse(int(record_id))
        if webpage_data_id:
            return {'html_content': webpage_data_id.description}

    ##################################################################
    # --------------  End of Routes for AJAX -------------- #
    ##################################################################
