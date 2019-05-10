from odoo import api, fields, models, _

class BlogPostInherit(models.Model):
    _inherit = 'blog.post'

    # Override for set defualt blog as "Our Blog"
    @api.model
    def default_get(self, fields):
        res = super(BlogPostInherit, self).default_get(fields)
        print('\n\nRES :: ',res,'\n\n\n')
        print('\n\nContext :: ', self._context, '\n\n\n')
        res['blog_id'] = 1
        return res