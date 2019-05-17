# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class Housemates(models.Model):
    _name = 'house.mates'
    _description = 'House Mates Listing & Finding Master'
    _rec_name = 'name'



    ## Main
    listing_type = fields.Selection([('list', 'List'), ('find', 'Find')], string="Listing type", default='find')
    name = fields.Char(string="Property Name")
    property_type = fields.Many2many('property.type', string="Property type")
    user_id = fields.Many2one('res.users', string="User")

    street = fields.Char()
    street2 = fields.Char()
    city = fields.Char()
    state_id = fields.Many2one('res.country.state')
    zip = fields.Char()
    country_id = fields.Many2one('res.country')
    latitude = fields.Char()
    longitude = fields.Char()

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
    children = fields.Boolean('Children')
    pets = fields.Boolean('Pets')
    retirees = fields.Boolean('Retirees')
    on_welfare = fields.Boolean('On welfare')

    f_full_time = fields.Boolean('Working Full time')
    f_part_time = fields.Boolean('Working Part Time')
    f_working_holiday = fields.Boolean('Working Holiday')
    f_retired = fields.Boolean('Retired')
    f_unemployed = fields.Boolean('Unemployed')
    f_backpacker = fields.Boolean('Backpacker')
    f_student = fields.Boolean('Student')

    fsmoker = fields.Boolean('Smoker')
    flgbti = fields.Boolean('LGBTI+')
    fpets = fields.Boolean('Pets')
    fchildren = fields.Boolean('Children')

    ## Property Images
    property_image_ids = fields.One2many('property.image', 'flat_mates_id', string='Images')

    ## Description
    description_about_property = fields.Text('Description')
    description_about_user = fields.Text('About Flatmates')

    @api.onchange('listing_type')
    def load_dropdown_data(self):
        print ("\n\n\nIn Onchange",self.listing_type)

        listing_category = self.env['property.listing.category'].search([('property_listing_category','=',self.listing_type.capitalize() )])
        print ("\n\n\nIn Onchange", listing_category)

        res = {}
        res['domain'] = {'property_type': [('listing_category', '=', listing_category.id)]}
        return res

    def selection_value(self,key):
        if self.pref == key:
            print("\n====key",dict(self._fields['type'].selection).get(self.pref))
            return dict(self._fields['type'].selection).get(self.pref)



class PropertyImage(models.Model):
    _name = 'property.image'
    _description = 'Property Image'

    name = fields.Char('Name')
    image = fields.Binary('Image', attachment=True)
    flat_mates_id = fields.Many2one('house.mates', 'Related Property', copy=True)


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