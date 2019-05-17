# -*- coding: utf-8 -*-
from odoo import http
import json
from odoo.http import  request
import werkzeug
from odoo.addons.pragtech_flatmates_system.controllers.main import Website_Inherit 
from odoo.addons.pragtech_flatmates_system.controllers.main import FlatMates
from odoo.addons.web.controllers.main import Home 


class HomepageLogin(Website_Inherit):
     
    @http.route('/', auth='public',type="http" ,website=True, csrf=False)
    def index(self, **kw):

        if   'val_password'  not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')

        if  'val_password'  in request.session :
            return http.request.render('pragtech_flatmates_system.home')
        
         
     
    @http.route(website=True, auth="public")
    def web_login(self, redirect=None, *args, **kw):
        response = super(HomepageLogin, self).web_login(redirect=redirect, *args, **kw)
        return response
     
    @http.route('/web/access_login',type="http", auth='public', website=True,csrf=False)
    def access_login(self, **kw):

        request.session['val_password'] = kw
        if request.session['val_password'] :
            return http.request.render('pragtech_flatmates_system.home')
        
class FlatMates(FlatMates):
    
    @http.route(['/info'], type='http', auth="public", website=True, csrf=True)
    def info(self, **kwargs):
        response = super(FlatMates, self).info(**kwargs)
        if   'val_password'  not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else :
            return response
        
class Home(Home):   
    
    @http.route('/web/login', type='http', auth="none", sitemap=False)
    def web_login(self, redirect=None, **kw):
        response = super(Home, self).web_login(redirect=redirect, **kw)

        if 'val_password'  not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else :
            return response
        
        

        
        
        




