# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class AccommodationType(models.Model):
    _name = 'accommodation.type'
    _description = 'Accommodation Types'
    _rec_name = "accommodation_type"

    accommodation_type = fields.Char(string='Accommodation Type')


class PropertyType(models.Model):
    _name = 'property.type'
    _description = 'Property Types'
    _rec_name = "property_type"

    property_type = fields.Char(string='Property Type')


class BedRooms(models.Model):
    _name = 'bedrooms'
    _description = 'BedRooms'

    name = fields.Char(string='BedRooms')


class BathRooms(models.Model):
    _name = 'bathrooms'
    _description = 'BathRooms'

    name = fields.Char(string='BathRooms')

class TotalFlatmates(models.Model):
    _name = 'total.flatmates'
    _description = 'Total number of flatmates'

    name = fields.Char(string='Flatmates')

class Internet(models.Model):
    _name = 'internet'
    _description = 'Internet'

    name = fields.Char(string='Internet')

class FlatmatePreference(models.Model):
    _name = 'flatmate.preference'
    _description = 'Flatmate Preference'

    name = fields.Char(string='Flatmate Preference')

class Parking(models.Model):
    _name = 'parking'
    _description = 'Parking'

    name = fields.Char(string='Parking')

class BathRoomTypes(models.Model):
    _name = 'bathroom.types'
    _description = 'BathRoom Types'

    name = fields.Char(string='BathRoom Type')

class RoomFurnishing(models.Model):
    _name = 'room.furnishing'
    _description = 'Room Furnishing'

    name = fields.Char(string='Room Furnishing')


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
    
class PropertyAccepting(models.Model):
    
    _name = 'property.accepting'
    
    name = fields.Char('Accepting')
    flatmate_id = fields.Many2one('flat.mates', string="Flatmates")

class BondBond(models.Model):
    _name = 'bond.bond'
    _description = 'Bond'

    name = fields.Char(string='Bond')

class BillBill(models.Model):
    _name = 'bill.bill'
    _description = 'Bill'

    name = fields.Char(string='Bill')

