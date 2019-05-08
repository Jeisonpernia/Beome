odoo.define('pragtech_flatmates.accommodation_page', function (require) {

$(document).ready(function() {

    var window_pathname = window.location.pathname

    if (window_pathname.includes('info/'))
    {
        var breadcrumb_heading = $('a[href="'+window.location.pathname+'"]').find("span").text()
        $("li.active").replaceWith('<li class="breadcrumb-item active" aria-current="page"><a href="'+window_pathname+'">'+breadcrumb_heading.trim()+'</a></li>');
    }
});
});