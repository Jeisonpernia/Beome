# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class Flatmates(models.Model):
    _name = 'flat.mates'
    _description = 'Flatmates Singup History'

    name = fields.Char(string="Property Name")
    is_listing = fields.Boolean('Listing')
    is_finding = fields.Boolean('Finding')

    # accommodation_type_id = fields.Many2one('accommodation.type',string="Type of Accommodation")
    # property_type_id = fields.Many2one('property.type',string="Type of property")
    total_bedrooms_id = fields.Many2one('bedrooms',string="Total Bedrooms")
    total_bathrooms_id = fields.Many2one('bathrooms', string="Total Bathrooms")
    internet_id = fields.Many2one('internet', string="Internet")
    total_no_flatmates_id = fields.Many2one('total.flatmates', string="Total number of flatmates")
    # flatmate_preference_id = fields.Many2one('flatmate.preference',string="Flatmate Preference")
    parking_id = fields.Many2one('parking',string="Parking")
    min_len_stay_id = fields.Many2one('minimum.length.stay',string="Minimum length of stay")
    max_len_stay_id = fields.Many2one('maximum.length.stay',string="Maximum length of stay")
    description_about_property = fields.Text('Property Description')
    description_about_user = fields.Text('About Flatmates')
    property_image_ids = fields.One2many('property.image', 'flat_mates_id', string='Images')
    # partner_id = fields.Many2one('res.partner',string="Customer")
    user_id = fields.Many2one('res.users',string="User")

    street = fields.Char()
    street2 = fields.Char()
    city = fields.Char()
    state_id = fields.Many2one('res.country.state')
    zip = fields.Char()
    country_id = fields.Many2one('res.country')
    latitude = fields.Char()
    longitude = fields.Char()

    bond_id = fields.Many2one('bond.bond',string="Bond")
    bill_id = fields.Many2one('bill.bill', string="Bill")


    accommodation_type = fields.Selection([('rooms_in_an_existing_sharehouse','Room(s) in an existing sharehouse'),('whole_property_for_rent','Whole property for rent'),('student_accommodation','Student accommodation'),('homestay','Homestay')], string="Type of Accommodation")
    type = fields.Selection([('house','House'),('flat','Flat')], string="Typs of property")
    pref = fields.Selection([('anyone','Anyone'),('females_only','Females only'),('males_only','Males only'),\
                             ('no_couple','Female or male(no couples)'),('couple','Couple')],string="Flatmate Preference")

    # total_bedrooms = fields.Selection([('2','2'),('3','3'),('4','4'),('5','5'),('6+','6+')], string="Total Bedrooms")
    # total_bathrooms = fields.Selection([('1','1'),('2','2'),('3','3'),('4+','4+')], string="Total Bathrooms")
    # parking = fields.Selection([('no parking','No Parking'),('off parking','Off street parking'),('on parking','On street parking')], string="Parking")
    # internet = fields.Selection([('no internet', 'No Internet'),('no inc', 'Available but not inc in rent'),\
    #                              ('incl rent', 'Included in rent'),('un incl rent', 'Unlimited Included in rent')], string="Internet")
    # total_no_flatmates = fields.Selection([('1','1'),('2','2'),('3','3'),('4','4'),('5','5'),('6','6'),('7+','7+')], string="Total number of flatmates")
    rooms_ids = fields.One2many('about.rooms','flatmate_id', string="About the room(s)")
    weekly_rent = fields.Float(string="Weekly rent")
    # bond = fields.Selection([('none','None'),('1week','1 Week'),('2week','2 Week'),('3','3 Week'),('4','4 Week')], string="Bond")
    # bill = fields.Selection([('add to the rent','Additional to the rent'),('some incl.in rent','Some included in the rent'),('included in rent','Included in rent')], string="Bill")
    avil_date = fields.Date(string="Date available")
    accepting_ids = fields.Many2many('property.accepting', 'flatmate_id', 'accepting_id', string="Accepting")
    # min_len_stay = fields.Selection([('no min stay','No minimum stay'),('1week','1 week'),\
    #                                  ('2week','2 week'),('1month','1 month'),('2months','2 months'),\
    #                                  ('3months','3 months'), ('4months','4 months'), ('6months','6 months'),\
    #                                  ('9months', '9 months'),('12months+', '12 months+')], string="Minimum length of stay")
    # max_len_stay = fields.Selection([('no max stay','No maximum stay'),('1week','1 week'),\
    #                                  ('2week','2 week'),('1month','1 month'),('2months','2 months'),\
    #                                  ('3months','3 months'), ('4months','4 months'), ('6months','6 months'),\
    #                                  ('9months', '9 months'),('12months+', '12 months+')], string="Maximum length of stay")

    


class AboutRooms(models.Model):
    
    _name = 'about.rooms'
    _description = 'Rooms details'
    
    
    flatmate_id = fields.Many2one('flat.mates', string="Flatmates")
    # name = fields.Selection([('private','Private'),('shared','Shared')], string="Room Type" ,required=True)
    # room_furnishing = fields.Selection([('flexible','Flexible'),('furnished','Furnished'),('unfurnished','Unfurnished')], string="Room Furnishings",required=True)
    # bath_room = fields.Selection([('shared','Shared'),('own','Own'),('ensuite','Ensuite')], string="Bathroom",required=True)
    bath_room_type_id = fields.Many2one('bathroom.types', string='Bathroom')
    room_furnishing_id = fields.Many2one('room.furnishing', string='Room Furnishings')
    room_type_id = fields.Many2one('room.types', string='Room Type')



class PropertyImage(models.Model):
    _name = 'property.image'
    _description = 'Property Image'

    name = fields.Char('Name')
    image = fields.Binary('Image', attachment=True)
    flat_mates_id = fields.Many2one('flat.mates', 'Related Property', copy=True)

    # @api.model
    # def create(self,vals):
    #     print ("\n\n\nIn create",vals)
    #     return super(PropertyImage,self).create(vals)
