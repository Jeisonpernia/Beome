odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

    "use strict";
    //console.log("In this function ---------------------",$("header.o_affix_enabled"))
    //console.log("In this function ---------------------",$("#oe_main_menu_navbar"))

    $(".go_back").on("click", function()
    {
      window.history.back();
    });

    var top_div = $("#wrapwrap").find('main')
//    var main_div = top_div.second()

    //console.log("In this function ---------------------",top_div.first())

    if ($("#oe_main_menu_navbar").length > 0)
    {
        $("header.o_affix_enabled").addClass("fixed-top-with-edit")
        $(".custom_header").addClass("top_margin")
//        main_div.addClass("top_marign")margin-top: 96px;
    }
    else
    {
        $("header.o_affix_enabled").addClass("fixed-top-without-edit")
//        main_div.addClass("top_marign")
//        $("main").addClass("main-margin")
    }

//    temp code added for redirecting to home page
    if (window.location.pathname == '/web/access_login'){

    window.location.replace('/')
    }

});// End of document
});// End of Odoo Deine
