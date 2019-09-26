odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";
	
	//alert($(window).width());

     var window_pathname = window.location.pathname
     var id;
     console.log ("---------------------------------")
     console.log ("Window Height", $(window).width())
     console.log ("Window width", $(window).height())
     console.log ("---------------------------------")
     console.log ("Div Wrap", $(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-md"))



    $(window).resize(function()
    {
    console.log("----------------",$(document).find(".no_responsive"))
       if ($(document).find(".no_responsive").length == 0)
       {
           if ($(window).width() <= 768 )
           {
             $(".search-dropdown-responsive").css("width", $(window).width() + 17)
                $("#top_menu_collapse").addClass("show")
                $(document).find(".search-box-icon").remove()
                $(document).find(".search-dropdown-txt").remove()

                console.log ("LEngthhhhhhhhhh  111111111111111 h",$(document).find(".search-bar-responsive").length)

                if ($(".search-bar-responsive").length == 2)
                {
                    var text_div = $(document).find(".search-bar-responsive").first().find("div")
                    if (text_div.length == 0)
                        $(".search-bar-responsive").append('<div class="nav-icon mx-auto"><span class="fa fa-search"></span></div><div class="text-center mt-1">Search</div>')
                }

                if ($(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-md"))
                {
                    $(document).find("#wrapwrap").find('nav').removeClass("navbar-expand-md")
                    $(document).find("#wrapwrap").find('nav').addClass("navbar-expand-xs")
                }

                if ($(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-sm"))
                {
                    $(document).find("#wrapwrap").find('nav').removeClass("navbar-expand-sm")
                }

                clearTimeout(id);
                id = setTimeout(doneResizing, 500);

                if (window_pathname == '/info')
                {

                }
                if (window_pathname.includes('/info/'))
                {
                    $("#head_id").css('display','none')
                    $(".info-page").find("#add_html_content").show()
                }

                window.onscroll = function() {myFunction1()};

                function myFunction1() {
                    console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                   if ($(document).scrollTop()>50){
                        console.log('iffffffffffffffffffffffffffffff')
                        $(".navbar-brand").css('display','none')
                   }
                   else{
                        console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee')
                        $(".navbar-brand").css('display','block')
                   }
                }


//               $(".search-dropdown").click(function(event){
//                    var is_shown = $(".modal_shown").hasClass("show")
//                    console.log('Inresponsive jsssssssssssssssssss : ',is_shown)
//                    if (is_shown == false){
//                            console.log('weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
//
//                    }
//                    else{
//                        console.log('Youuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
//                    }
//
//               })
         console.log("in if-----",$('.message_container:visible').length)
            if($('.message_container:visible').length == 0)
            {
            console.log("in if-----")
             $(".inbox-left-conversations").css('display','block')
              $(".message_container").css('display','none')
            }
           else {

           $(".inbox-left-conversations").css('display','none')
              $(".message_container").css('display','block')
           }




           }
		   
		   
		     if ($(window).width() + 17 >= 769 ){
				 console.log("Suhas >= 769");
				 
			   	$('#new-closebutton').addClass('d-none');
            	$('.search-bar-responsive').css('display','block');
			   	$("#dropdownMenuButton").css('margin-top','auto');
				$("#top_menu_collapse .navbar-nav").css('width','75%');
				$(".navbar-brand").css('display','block');
				$("#dropdownMenuButton").css('width','100%');


		  }
		  else{
		  var is_shown = $(".modal_shown").hasClass("show")
		  if (is_shown){
console.log("---------in my else--------------");
			   $('.search-bar-responsive').css('display','none')
			$('#new-closebutton').removeClass('d-none');
			$("#dropdownMenuButton").css('margin-top','65px')
			$(".navbar-brand").css('display','none');
			$("#top_menu_collapse .navbar-nav").css('width','100%');
		  }
		  }


           if ($(window).width() > 768 )
           {
			   console.log("Suhas > 768");
                $(".search-dropdown-responsive").css("width", "100%");

                if ($(".search-bar-responsive").length == 2)
                {
                    var find_div = $(document).find(".search-bar-responsive").find('div')
                    var find_span = $(document).find(".search-bar-responsive").find('span')

                    find_div.each(function(){$(this).remove()});
                    find_span.each(function(){$(this).remove()});


                    var text_div = $(document).find(".search-bar-responsive").first().find("div")
                    console.log ("LEngthhhhhhhhhhh",text_div)
                    if (text_div.length == 0)
                        $(".search-bar-responsive").append('<div class="search-icon search-box-icon"><span class="fa fa-search" id="search-icon"></span></div><span class="search-dropdown-txt" id="search-text-id">Search share accommodation</span>')
                }

                if ($(document).find("#wrapwrap").find('nav').hasClass("navbar-expand-xs"))
                {
                    $(document).find("#wrapwrap").find('nav').removeClass("navbar-expand-xs")
                    $(document).find("#wrapwrap").find('nav').addClass("navbar-expand-md")
                    $(document).find("#wrapwrap").find('nav').addClass("navbar-expand-sm")
                }
                clearTimeout(id);
                id = setTimeout(doneResizing, 2000);
			   

			    $(".inbox-left-conversations").css('display','block')
				  if($('.message_container:visible').length > 0)
                    {
                  $(".message_container").css('display','block')
                  }
                  else{
                  $(".inbox-empty").css('display','block')
                  }

//                  var is_shown = $(".modal_shown").hasClass("show")
//			   if(is_shown == false){
//			   $(".search-btn-close").addClass('d-none')
////			   $(".search-dropdown").removeClass('d-none')
//			   }

/*			    if (window_pathname == '/info')
                {

                }
                if (window_pathname.includes('/info/'))
                {
                    $("#head_id").css('display','block')
                    $(".info-page").find("#add_html_content").show()
                }*/
        }
		   
		   
		   if (($(window).width() > 768) && ($(window).width() <= 975))
	   {	
		   
		   if (window_pathname == '/info')
			{

			}
			if (window_pathname.includes('/info/'))
			{
				$("#head_id").css('display','none')
				$(".info-page").find("#add_html_content").show()
			}

	   	
	   }
		   

   if ($(window).width() >= 976)
	   {

		   if (window_pathname == '/info')
			{

			}
			if (window_pathname.includes('/info/'))
			{
				$("#head_id").css('display','block')
				$(".info-page").find("#add_html_content").show()
			}

	   }
		   
		   	   if ($(window).width() > 976 && $(window).width() < 991)
	   {	
		   
		   if (window_pathname == '/info')
			{

			}
			if (window_pathname.includes('/info/'))
			{
				$("#head_id").css('display','none')
				$(".info-page").find("#add_html_content").show()
			}
	   	
	   }
		   
		   

		   
		   
		   
       }
    });

//    if ($(window).width() > 769)
//
//      {
//       if (window_pathname.includes('/messages')){
//      console.log('----- my test ------ if  ------',$('.inbox-empty:visible').length,$('.inbox-left-conversations:visible').length)
//
//          $(".inbox-left-conversations").css('display','block')
//          $(".inbox-empty").css('display','block')
//      }
//      }
//      else{
//      if (window_pathname.includes('/messages')){
//      console.log('value present in view_conversation_user_id',$('.inbox-empty:visible').length,$('.inbox-left-conversations:visible').length)
//      if($('.inbox-empty:visible').length == 0)
//        {
//         $(".inbox-left-conversations").css('display','block')
//          $(".inbox-empty").css('display','none')
//        }
//       else if($('.inbox-left-conversations:visible').length == 0){
//
//       $(".inbox-left-conversations").css('display','none')
//          $(".inbox-empty").css('display','block')
//       }
//      }
//      }

    function doneResizing()
    {}



//"wrapwrap"

});// End of document
});// End of Odoo Deine