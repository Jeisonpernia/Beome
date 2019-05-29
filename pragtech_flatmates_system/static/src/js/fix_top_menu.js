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

    //close button on header
    $(".delete_creating_listing").on('click',function(){
        console.log('222222222222222222222222223333333333333333')

        var list_place_array = JSON.parse(localStorage.getItem('list_place_array'));

        var find_place_array = JSON.parse(localStorage.getItem('find_place_record'));

        if(list_place_array){
            console.log("List Place Beforeeeeeee ",list_place_array[0])
            localStorage.setItem('list_place_array', '[]');

            console.log('List Place Afterrrrrr :',JSON.parse(localStorage.getItem('list_place_array')))
        }
        if(find_place_array){

            console.log("Find Place Beforeeeeeee ",find_place_array[0])
            localStorage.setItem('find_place_record', '[]');

            console.log('find Place Afterrrrrr :',JSON.parse(localStorage.getItem('find_place_record')))
        }

    })


});// End of document
});// End of Odoo Deine
