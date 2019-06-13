odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";

     var window_pathname = window.location.pathname
     var id;
     console.log ("---------------------------------")
     console.log ("Window Height", $(window).width())
     console.log ("Window width", $(window).height())
     console.log ("---------------------------------")
     console.log ("Div Wrap", $(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-md"))


    $(window).resize(function()
    {
       if ($(window).width() <= 768 )
       {
		   	$(".search-dropdown-responsive").css("width", $(window).width() + 17)
		    $("#top_menu_collapse").addClass("show")
		    $(document).find(".search-box-icon").remove()
		   	$(document).find(".search-dropdown-txt").remove()
		   console.log ("LEngthhhhhhhhhhh",$(document).find(".search-bar-responsive").length)
		   if ($(".search-bar-responsive").length == 2)
			   {
			   var text_div = $(document).find(".search-bar-responsive").first().find("div")
			   if (text_div.length == 0)
			        $(".search-bar-responsive").append('<div class="nav-icon mx-auto"><span class="icon"><svg class="magnifying-glass" viewBox="0 0 50 50" width="20" height="20"><path class="fill" d="M21 3C11.6 3 4 10.6 4 20s7.6 17 17 17 17-7.6 17-17S30.4 3 21 3zm0 30c-7.2 0-13-5.8-13-13S13.8 7 21 7s13 5.8 13 13-5.8 13-13 13z"></path><path class="stroke" stroke-width="6" stroke-miterlimit="10" d="M31.2 31.2l13.3 13.3" style="stroke:#fff"></path></svg></span></div><div class="text-center mt-1">Search</div>')
			   }
		   
            if ($(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-md"))
            {
                $(document).find("#wrapwrap").find('nav').removeClass("navbar-expand-md")
                $(document).find("#wrapwrap").find('nav').addClass("navbar-expand-sm")
            }

//            var search_box_bar = $(document).find(".search-box-bar")
//            var search_box_button = $(document).find(".search-box-button")
//
//            if (search_box_button.first().hasClass("d-none"))
//            {
////                search_box_bar.first().addClass('d-none')
//                search_box_button.first().removeClass("d-none")
//                search_box_bar.first().addClass("d-none")
//                console.log ("sssssssssssssssss",search_box_bar.first())
//            }
        }

        if ($(window).width() > 768 )
        {
			$(".search-dropdown-responsive").css("width", "100%");
			
            if ($(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-sm"))
            {
                $(document).find("#wrapwrap").find('nav').removeClass("navbar-expand-sm")
                $(document).find("#wrapwrap").find('nav').addClass("navbar-expand-md")
            }

//            var search_box_bar = $(document).find(".search-box-bar")
//            var search_box_button = $(document).find(".search-box-button")
//
//            if (search_box_bar.first().hasClass("d-none"))
//            {
//                search_box_bar.first().removeClass("d-none")
//                search_box_button.first().addClass("d-none")
//            }
        }
    clearTimeout(id);
    id = setTimeout(doneResizing, 500);

    function doneResizing()
    {}

    });




//"wrapwrap"

});// End of document
});// End of Odoo Deine