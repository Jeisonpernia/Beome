# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class BathRooms(models.Model):
    _name = 'bathrooms'
    _description = 'BathRooms'

    name = fields.Char(string='BathRooms')

class BathRoomCategories(models.Model):
    _name = 'bathroom.categories'
    _description = 'BathRoom Categories'
    _rec_name = "bathroom_category"

    bathroom_category = fields.Char(string='Bathroom Category')

class BathRoomTypes(models.Model):
    _name = 'bathroom.types'
    _description = 'BathRoom Types'

    name = fields.Char(string='BathRoom Type')
    view_for = fields.Selection([('List', 'List'), ('Find', 'Find')], string="View In", default='Find')
    bathroom_category = fields.Many2many('bathroom.categories', string='Bathroom Category')

class BedRooms(models.Model):
    _name = 'bedrooms'
    _description = 'BedRooms'

    name = fields.Char(string='BedRooms')

class PropertyType(models.Model):
    _name = 'property.type'
    _description = 'Property Type'
    _rec_name = "property_type"

    property_type = fields.Char(string='Property Type')
    listing_category = fields.Many2many('property.listing.category',string='Property Listing Category')

class PropertyListingCategory(models.Model):
    _name = 'property.listing.category'
    _description = 'Property Listing Categories'
    _rec_name = "property_listing_category"

    property_listing_category = fields.Char(string='Property Listing Category')

class RoomFurnishingCategories(models.Model):
    _name = 'room.furnishing.categories'
    _description = 'Room Furnishing Category'
    _rec_name = "room_furnishing_categories"

    room_furnishing_categories = fields.Char(string='Room Furnishing Category')

class RoomFurnishing(models.Model):
    _name = 'room.furnishing'
    _description = 'Room Furnishing'

    name = fields.Char(string='Room Furnishing')
    view_for = fields.Selection([('List', 'List'), ('Find', 'Find')], string="View In", default='Find')
    room_furnishing_category = fields.Many2many('room.furnishing.categories',string='Room Furnishing Category')

class InternetCategories(models.Model):
    _name = 'internet.categories'
    _description = 'Internet Category'
    _rec_name = "internet_categories"

    internet_categories = fields.Char(string='Internet Category')

class Internet(models.Model):
    _name = 'internet'
    _description = 'Internet'

    name = fields.Char(string='Internet')
    view_for = fields.Selection([('List', 'List'), ('Find', 'Find')], string="View In", default='Find')
    internet_category = fields.Many2many('internet.categories',string='Internet Category')

class Parking(models.Model):
    _name = 'parking'
    _description = 'Parking'

    name = fields.Char(string='Parking')
    view_for = fields.Selection([('List', 'List'), ('Find', 'Find')], string="View In", default='Find')
    parking_category = fields.Many2many('parking.categories',string='Parking Category')

class ParkingCategories(models.Model):
    _name = 'parking.categories'
    _description = 'Parking Category'
    _rec_name = "parking_categories"

    parking_categories = fields.Char(string='Parking Category')

class TotalFlatmates(models.Model):
    _name = 'total.flatmates'
    _description = 'Total number of flatmates'

    name = fields.Char(string='Flatmates')
    view_for = fields.Selection([('List', 'List'), ('Find', 'Find')], string="View In", default='Find')
    total_flatmate_category = fields.Many2many('total.flatmates.categories',string='Total Housemate Category')

class TotalFlatmatesCategories(models.Model):
    _name = 'total.flatmates.categories'
    _description = 'Total Number of Housemate Categories'
    _rec_name = "total_flatmate_categories"


    total_flatmate_categories = fields.Char(string='Flatmates')







class AccommodationType(models.Model):
    _name = 'accommodation.type'
    _description = 'Accommodation Types'
    _rec_name = "accommodation_type"

    accommodation_type = fields.Char(string='Accommodation Type')





class FlatmatePreference(models.Model):
    _name = 'flatmate.preference'
    _description = 'Flatmate Preference'

    name = fields.Char(string='Flatmate Preference')






class RoomTypes(models.Model):
    _name = 'room.types'
    _description = 'Room Types'

    name = fields.Char(string='Room Types')


class MinimumLengthStay(models.Model):
    _name = 'minimum.length.stay'
    _description = 'Minimum length of stay'

    name = fields.Char(string='Minimum length of stay')

class MaximumLengthStay(models.Model):
    _name = 'maximum.length.stay'
    _description = 'Maximum length of stay'

    name = fields.Char(string='Maximum length of stay')
#
# class PropertyAccepting(models.Model):
#
#     _name = 'property.accepting'
#
#     name = fields.Char('Accepting')
#     flatmate_id = fields.Many2one('flat.mates', string="Flatmates")

class BondBond(models.Model):
    _name = 'bond.bond'
    _description = 'Bond'

    name = fields.Char(string='Bond')

class BillBill(models.Model):
    _name = 'bill.bill'
    _description = 'Bill'

    name = fields.Char(string='Bill')

