# -*- coding: utf-8 -*-
from odoo import http
import json
from odoo.http import request
import werkzeug
from odoo.addons.pragtech_housemates.controllers.main import Website_Inherit
from odoo.addons.pragtech_housemates.controllers.main import FlatMates
from odoo.addons.web.controllers.main import Home


class HomepageLogin(Website_Inherit):

    @http.route('/', auth='public', type="http", website=True, csrf=False)
    def index(self, **kw):
        response = super(HomepageLogin, self).index(**kw)
        if 'val_password' not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else:
            return response

    @http.route(website=True, auth="public", csrf="False")
    def web_login(self, redirect=None, *args, **kw):
        response = super(HomepageLogin, self).web_login(redirect=redirect, *args, **kw)
        print("\n\n=-----=---weblogin====", kw, response)
        # if 'password' in kw and kw['password']:
        return response
        # else:
        #     request.session.logout(keep_db=True)

    @http.route('/web/access_login', type="http", auth='public', website=True, csrf=False)
    def access_login(self, **kw):
        val_password = 'Housemates@123'
        if 'validation' in kw and kw['validation']:
            request.session['val_password'] = kw['validation']
        if 'val_password' in request.session and request.session['val_password'] == val_password:
            return http.request.render('pragtech_housemates.home')


class FlatMates(FlatMates):

    @http.route(['/info'], type='http', auth="public", website=True, csrf=True)
    def info(self, **kwargs):
        response = super(FlatMates, self).info(**kwargs)
        if 'val_password' not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else:
            return response

    @http.route(['/shortlists'], type='http', auth="public", website=True, csrf=True)
    def short_list(self, **kwargs):
        response = super(FlatMates, self).short_list(**kwargs)
        if 'val_password' not in request.session:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else:
            return response


class Home(Home):

    @http.route('/web/login', type='http', auth="none", sitemap=False)
    def web_login(self, redirect=None, **kw):
        super(Home, self).web_login(redirect=redirect, **kw)
        if not request.uid:
            return http.request.render('pragtech_homepage_login.homepage_login')
        else:
            return super(Home, self).web_login(redirect=redirect, **kw)