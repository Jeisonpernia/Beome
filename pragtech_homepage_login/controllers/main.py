# -*- coding: utf-8 -*-
from odoo import http
import json
from odoo.http import request
import werkzeug
from odoo.addons.pragtech_housemates.controllers.main import Website_Inherit
from odoo.addons.pragtech_housemates.controllers.main import FlatMates
from odoo.addons.web.controllers.main import Home
import odoo
from odoo.tools.translate import _

from werkzeug.urls import url_decode, iri_to_uri
db_monodb = http.db_monodb

def abort_and_redirect(url):
    r = request.httprequest
    response = werkzeug.utils.redirect(url, 302)
    response = r.app.get_response(r, response, explicit_session=False)
    werkzeug.exceptions.abort(response)

def ensure_db(redirect='/web/database/selector'):
    # This helper should be used in web client auth="none" routes
    # if those routes needs a db to work with.
    # If the heuristics does not find any database, then the users will be
    # redirected to db selector or any url specified by `redirect` argument.
    # If the db is taken out of a query parameter, it will be checked against
    # `http.db_filter()` in order to ensure it's legit and thus avoid db
    # forgering that could lead to xss attacks.
    db = request.params.get('db') and request.params.get('db').strip()

    # Ensure db is legit
    if db and db not in http.db_filter([db]):
        db = None

    if db and not request.session.db:
        # User asked a specific database on a new session.
        # That mean the nodb router has been used to find the route
        # Depending on installed module in the database, the rendering of the page
        # may depend on data injected by the database route dispatcher.
        # Thus, we redirect the user to the same page but with the session cookie set.
        # This will force using the database route dispatcher...
        r = request.httprequest
        url_redirect = werkzeug.urls.url_parse(r.base_url)
        if r.query_string:
            # in P3, request.query_string is bytes, the rest is text, can't mix them
            query_string = iri_to_uri(r.query_string)
            url_redirect = url_redirect.replace(query=query_string)
        request.session.db = db
        abort_and_redirect(url_redirect)

    # if db not provided, use the session one
    if not db and request.session.db and http.db_filter([request.session.db]):
        db = request.session.db

    # if no database provided and no database in session, use monodb
    if not db:
        db = db_monodb(request.httprequest)

    # if no db can be found til here, send to the database selector
    # the database selector will redirect to database manager if needed
    if not db:
        werkzeug.exceptions.abort(werkzeug.utils.redirect(redirect, 303))

    # always switch the session to the computed db
    if db != request.session.db:
        request.session.logout()
        abort_and_redirect(request.httprequest.url)

    request.session.db = db

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

    # @http.route('/web/login', type='http', auth="none", sitemap=False)
    # def web_login(self, redirect=None, **kw):
    #     # super(Home, self).web_login(redirect=redirect, **kw)
    #     if not request.uid:
    #         return http.request.render('pragtech_homepage_login.homepage_login')
    #     else:
    #         return super(Home, self).web_login(redirect=redirect, **kw)

    @http.route('/web/login', type='http', auth="none", sitemap=False)
    def web_login(self, redirect=None, **kw):
        ensure_db()
        request.params['login_success'] = False
        if request.httprequest.method == 'GET' and redirect and request.session.uid:
            return http.redirect_with_hash(redirect)

        if not request.uid:
            pass
            # request.uid = odoo.SUPERUSER_ID

        values = request.params.copy()
        try:
            values['databases'] = http.db_list()
        except odoo.exceptions.AccessDenied:
            values['databases'] = None

        if request.httprequest.method == 'POST':
            old_uid = request.uid
            try:
                uid = request.session.authenticate(request.session.db, request.params['login'],
                                                   request.params['password'])
                request.params['login_success'] = True
                return http.redirect_with_hash(self._login_redirect(uid, redirect=redirect))
            except odoo.exceptions.AccessDenied as e:
                request.uid = old_uid
                if e.args == odoo.exceptions.AccessDenied().args:
                    values['error'] = _("Wrong login/password")
                else:
                    values['error'] = e.args[0]
        else:
            if 'error' in request.params and request.params.get('error') == 'access':
                values['error'] = _('Only employee can access this database. Please contact the administrator.')

        if 'login' not in values and request.session.get('auth_login'):
            values['login'] = request.session.get('auth_login')

        if not odoo.tools.config['list_db']:
            values['disable_database_manager'] = True

        # otherwise no real way to test debug mode in template as ?debug =>
        # values['debug'] = '' but that's also the fallback value when
        # missing variables in qweb
        if 'debug' in values:
            values['debug'] = True

        response = request.render('web.login', values)
        response.headers['X-Frame-Options'] = 'DENY'
        return super(Home, self).web_login(redirect=redirect, **kw)