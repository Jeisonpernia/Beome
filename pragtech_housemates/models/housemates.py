# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import UserError
import logging
from _datetime import datetime
_logger = logging.getLogger(__name__)

class Housemates(models.Model):
    _name = 'house.mates'
    _description = 'House Mates Listing & Finding Master'
    _rec_name = 'name'


    ## Main
    state = fields.Selection([('pending','Pending'),('active', 'Active'), ('deactive', 'Deactive'),('deleted','Deleted')])
    listing_type = fields.Selection([('list', 'List'), ('find', 'Find')], string="Listing type", default='find')
    name = fields.Char(string="Housemate ID",index=True,required=True,copy=False,default=lambda self: _('New'))
    property_type = fields.Many2many('property.type', string="Property type")
    user_id = fields.Many2one('res.users', string="User")
    property_address =  fields.Char()
    street = fields.Char()
    street2 = fields.Char()
    street3 = fields.Char()
    city = fields.Char()
    state_id = fields.Many2one('res.country.state' , string='States')
    zip = fields.Char()
    country_id = fields.Many2one('res.country')
    latitude = fields.Char()
    longitude = fields.Char()
    north=fields.Char()
    east=fields.Char()
    south=fields.Char()
    west=fields.Char()
    latest_active_date = fields.Datetime()
    total_bathrooms_id = fields.Many2one('bathrooms', string="Total Bathrooms")
    total_bedrooms_id = fields.Many2one('bedrooms', string="Total Bedrooms")
    total_no_flatmates_id = fields.Many2one('total.flatmates', string="Total number of flatmates")
    type = fields.Selection([('house', 'House'), ('flat', 'Flat')], string="Typs of property")
    pref = fields.Selection([('anyone', 'Anyone'), ('females_only', 'Females only'), ('males_only', 'Males only'), \
                             ('no_couple', 'Female or male(no couples)'), ('couple', 'Couple')],
                            string="Flatmate Preference")
    place_for = fields.Selection([('me', 'Me'), ('couple', 'Couple'), ('group', 'Group')], string="Place For")
    is_teamups = fields.Boolean('Teamups')
    is_short_list = fields.Boolean('Short List')


    ## About the room
    rooms_ids = fields.One2many('about.rooms', 'flatmate_id', string="About the room(s)")

    ## About person
    person_ids = fields.One2many('about.person', 'housemate_id', string="About the person")

    ## Necessity
    internet_id = fields.Many2one('internet', string="Internet")
    parking_id = fields.Many2one('parking',string="Parking")

    ## Rent, Agreements & Details
    weekly_budget = fields.Float('Weekly budget/Weekly Rent')
    avil_date = fields.Date(string="Date available/Preferred move date")
    bond_id = fields.Many2one('bond.bond', string="Bond")
    bill_id = fields.Many2one('bill.bill', string="Bill")
    min_len_stay_id = fields.Many2one('minimum.length.stay',string="Minimum length of stay")
    max_len_stay_id = fields.Many2one('maximum.length.stay',string="Maximum length of stay")

    ## Accepting, Employment Status & Lifestyle
    backpackers = fields.Boolean('Backpackers')
    students = fields.Boolean('Students')
    smokers = fields.Boolean('Smokers')
    LGBTI = fields.Boolean('LGBTI+ ?')
    fourty_year_old = fields.Boolean('40+ years olds')
    children = fields.Boolean('Childrens')
    pets = fields.Boolean('Pets')
    retirees = fields.Boolean('Retirees')
    on_welfare = fields.Boolean('On welfare')
    all_female_flatmates=fields.Boolean('All Female Flatmates')

    f_full_time = fields.Boolean('Working Full time')
    f_part_time = fields.Boolean('Working Part Time')
    f_working_holiday = fields.Boolean('Working Holiday')
    f_retired = fields.Boolean('Retired')
    f_unemployed = fields.Boolean('Unemployed')
    f_backpacker = fields.Boolean('Backpacker')
    f_student = fields.Boolean('Student')

    fsmoker = fields.Boolean('Smoker')
    flgbti = fields.Boolean('LGBTI+')
    fpets = fields.Boolean('Pet')
    fchildren = fields.Boolean('Children')

    ## Property Images
    property_image_ids = fields.One2many('property.image', 'flat_mates_id', string='Images')

    ## Description
    description_about_property = fields.Html('Description')
    description_about_user = fields.Html('About Flatmates')

    ## Suburbs
    suburbs_ids = fields.One2many('find.suburbs', 'housemate_id', string="Suburbs Details")

    @api.model
    def create(self,values):

        if values.get('name', _('New')) == _('New'):
            if values.get('listing_type') == 'list':
                values['name'] = self.env['ir.sequence'].next_by_code('seq_house_mates_list') or _('New')
            elif values.get('listing_type') == 'find':
                values['name'] = self.env['ir.sequence'].next_by_code('seq_house_mates_find') or _('New')
        listing = super(Housemates, self).create(values)
        mail_server_obj = self.env['ir.mail_server'].sudo().search([])
        if mail_server_obj:
            listing.send_listing_alert_email()
        return listing



    @api.onchange('listing_type')
    def load_dropdown_data(self):
        # print ("\n\n\nIn Onchange",self.listing_type)

        listing_category = self.env['property.listing.category'].search([('property_listing_category','=',self.listing_type.capitalize() )])
        # print ("\n\n\nIn Onchange", listing_category)

        res = {}
        res['domain'] = {'property_type': [('listing_category', '=', listing_category.id)]}
        return res

    def selection_value(self,key):
        if self.pref == key:
            # print("\n====key",dict(self._fields['type'].selection).get(self.pref))
            return dict(self._fields['type'].selection).get(self.pref)

    @api.multi
    def send_listing_alert_email(self):

        template = self.env.ref('pragtech_housemates.mail_listing_alert')
        assert template._name == 'mail.template'

        template_values = {
            #             'email_to': '${object.email|safe}',
            'email_cc': False,
            'auto_delete': True,
            'partner_to': False,
            'scheduled_date': False,
        }

        template.write(template_values)
        for user in self.user_id:
            print("===============user==============",user.login)
            if not user.email:
                raise UserError(_("Cannot send email: user %s has no email address.") % user.name)
            with self.env.cr.savepoint():
                template.with_context(lang=user.lang).send_mail(user.id, force_send=True, raise_exception=True)
            _logger.info("Password reset email sent for user <%s> to <%s>", user.login, user.email)

    #To add 'picture' in data URL in Facebook Graph Provider
    @api.model
    def change_data_endpoint(self):

        template_id = self.env['ir.model.data'].get_object_reference('auth_oauth', 'provider_facebook')[1]
        template_id = self.env['auth.oauth.provider'].browse(template_id)


        updated = template_id.write({'data_endpoint': 'https://graph.facebook.com/me?fields=id,name,email,picture'})
        if updated:
            return True

class PropertyImage(models.Model):
    _name = 'property.image'
    _description = 'Property Image'

    name = fields.Char('Name')
    image = fields.Binary('Image', attachment=True)
    flat_mates_id = fields.Many2one('house.mates', 'Related Property', copy=True)
    is_featured = fields.Boolean("Featured")

class AboutRooms(models.Model):
    _name = 'about.rooms'
    _description = 'Rooms details'

    flatmate_id = fields.Many2one('house.mates', string="Housemates")
    bath_room_type_id = fields.Many2one('bathroom.types', string='Bathroom')
    room_furnishing_id = fields.Many2one('room.furnishing', string='Room Furnishings')
    room_type_id = fields.Many2one('room.types', string='Room Type')

class AboutPerson(models.Model):
    _name = 'about.person'
    _description = 'Person details'

    housemate_id = fields.Many2one('house.mates', string="Housemates")
    name = fields.Char(string="Name")
    age = fields.Integer(string='Age')
    gender = fields.Selection([('male','Male'),('female','Female')], string="Gender", default="female")

class Suburbs(models.Model):
    _name = 'find.suburbs'
    _description = 'Suburbs details'

    housemate_id = fields.Many2one('house.mates', string="Housemates")
    subrub_name = fields.Char(string="Suburb Name")
    city = fields.Char(string="City")
    state = fields.Char(string="State")
    post_code = fields.Char(string="Post Code")
    latitude = fields.Char(string="Latitude")
    longitude = fields.Char(string="Longitude")

