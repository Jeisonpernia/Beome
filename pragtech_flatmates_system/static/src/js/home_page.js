odoo.define('pragtech_flatmates.home_page', function (require) {

$(document).ready(function() {

    //console.log('Button-------------',$('.property_button'))
    $('#lazy_load').on('click','.property_button',function()
    {
    console.log("111111111111111111",$(this).data('button-id'))

    var property_id=$(this).data('button-id')
    var a = "P"+property_id
    window.open(a)

    });


});




 $(document).on('click','.default-shortlist',function()
	{
	  var $child1 = ''
	  if ($(this).hasClass('default-shortlist'))
		  {

		  $(this).addClass('shortlisted');
		  $(this).removeClass('default-shortlist');

		  $child1 = this.parentNode.parentNode
		  $child1 = $child1.childNodes[0].getAttribute('data-button-id')

		  $.ajax({
	  		url : "/shortlist",   // calls to controller method
	  		type : "post",
	  		dataType : 'http',
	 		data : {
	  			'data':$child1
	  			,
	  			'active' : 'True'
	  			   // send to controller method arguments
	  		},
	  		success : function(result) {    // work after controller method return
	  			if (result) {

	  			}
	  		},
	         });

		  }



	});



  $(document).on('click','.shortlisted',function()
	{
	          var $child1 = ''
			  if ($(this).hasClass('shortlisted'))
				  {
					  $(this).addClass('default-shortlist');
					  $(this).removeClass('shortlisted');

					  $child1 = this.parentNode.parentNode
					  $child1 = $child1.childNodes[0].getAttribute('data-button-id')
					  $.ajax({
				  		url : "/shortlist",   // calls to controller method
				  		type : "post",
				  		dataType : 'http',
				 		data : {
				  			'data':$child1,
				  			'active' : 'False'
				  			   // send to controller method arguments
				  		},
				  		success : function(result) {    // work after controller method return
				  			if (result) {

				  			}
				  		},
				         });

				  }
   });





// accommodation listing item Select



//$(document).ready(function() {
//	"use strict";
//  $(".radiocheck1").click(function() {
//
//  console.log( $(".radiocheck1"),'Parent----------', $(".radiocheck1").val())
//  console.log('Parent----------',$("input[name='suhas1']:checked").val())
////  console.log('Parent----------',$(this).siblings())
////  var parent = $(this).parent();
//
////  $(this).parent().addClass("accommodation-listing-item-active")
////  $(this).parent().find("path").css({"stroke": "#fff"});
//
//  });
//
//$(".radiocheck").click(function() {
//
//  console.log( $(".radiocheck"),'Parent----------', $(".radiocheck").val())
//  console.log('Parent----------',$("input[name='suhas']:checked").val())
//
//  });
//});

// List My Place
// Page 2 : Accommodation
$(document).ready(function() {
	"use strict";

//   $('#type_of_accomodation').val("")

  function remove_css(current_obj)
  {
    var parent =current_obj.parent()
    var svg=parent.parent().find("path")
    var active_div=parent.parent().find("div.accommodation-listing-item-active")
    $(".sharehouse").addClass('items-cirle-hover')
    $(".whole-property").addClass('items-cirle-hover')
    $(".student-accomodation").addClass('items-cirle-hover')
    $(".homestay").addClass('items-cirle-hover')

    console.log($(".homestay").hasClass('items-cirle-hover'))

    $("div").remove(".active_tick_icon");
    svg.each(function(){$(this).removeAttr('class','active_svg_icon');});
    active_div.each(function(){$(this).removeClass('accommodation-listing-item-active');});
   }




  $(".sharehouse").click(function()
  {
    $('.accommodation-next-btn').prop("disabled", true);
    $('.porerty-type-group').show()

//  var parent =$(this).parent()
    remove_css($(this))
    $('<div src="" class="active_tick_icon"></div>').prependTo($(".sharehouse"))
//    $(this).parent().addClass("active_tick_icon")
//    console.log("Active 11-----------",$(this).parent())
    $(this).addClass("accommodation-listing-item-active")
    $(this).find("path").attr('class', 'active_svg_icon');
    $(this).removeClass("items-cirle-hover")

    $('#type_of_accomodation').val('sharehouse')
  });

  $(".whole-property").click(function()
  {
    $('.accommodation-next-btn').prop("disabled", false);
    $('.porerty-type-group').hide()

    remove_css($(this))
    $('<div src="" class="active_tick_icon"></div>').prependTo($(".whole-property"))
    $(this).addClass("accommodation-listing-item-active")
    $(this).find("path").attr('class', 'active_svg_icon');
    $(this).removeClass("items-cirle-hover")

    $('#type_of_accomodation').val('whole-property')
  });

  $(".student-accomodation").click(function()
  {
    $('.accommodation-next-btn').prop("disabled", false);
    $('.porerty-type-group').hide()

    remove_css($(this))
    $('<div src="" class="active_tick_icon"></div>').prependTo($(".student-accomodation"))
    $(this).addClass("accommodation-listing-item-active")
    $(this).find("path").attr('class', 'active_svg_icon');
    $(this).removeClass("items-cirle-hover")

    $('#type_of_accomodation').val('student-accomodation')
  });

    $(".homestay").click(function()
  {

    $('.accommodation-next-btn').prop("disabled", false);
    $('.porerty-type-group').hide()

    remove_css($(this))
    $('<div src="" class="active_tick_icon"></div>').prependTo($(".homestay"))
    $(this).addClass("accommodation-listing-item-active")
    $(this).find("path").attr('class', 'active_svg_icon');
    $(this).removeClass("items-cirle-hover")

    $('#type_of_accomodation').val('homestay')

  });


//  //////////////////////////////////////////////////////////////////////////////////////
//  // Validation for Accepting Page
//  /////////////////////////////////////////////////////////////////////////////////////
//
//   $("#set-backpackers").click(function(){
//   $("set-backpackers").toggle();
//    console.log('backpapereeeeeeeeeeessssssssssssssssssssss11111111111111')
//    $('<div src="" class="active_tick_icon"></div>').prependTo($("#set-backpackers"))
//    $(this).addClass("accommodation-listing-item-active")
//    $(this).find("path").attr('class', 'active_svg_icon');
//    $(this).removeClass("items-cirle-hover")
//  });
//
//   $("#set-students").click(function(){
//    console.log('backpapereeeeeeeeeeessssssssssssssssssssss22222222222222222')
//    $('<div src="" class="active_tick_icon"></div>').prependTo($("#set-students"))
//    $(this).addClass("accommodation-listing-item-active")
//    $(this).find("path").attr('class', 'active_svg_icon');
//    $(this).removeClass("items-cirle-hover")
//
//  });
//
// $("#set-smokers").click(function(){
//    console.log('backpapereeeeeeeeeeessssssssssssssssssssss3333333333333')
//    $('<div src="" class="active_tick_icon"></div>').prependTo($("#set-smokers"))
//    $(this).addClass("accommodation-listing-item-active")
//    $(this).find("path").attr('class', 'active_svg_icon');
//    $(this).removeClass("items-cirle-hover")
//
//  });


        $("#view_more_article").click(function(){
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> ::: ',)
            $('#main_column').removeClass('col-md-8');
        })



});

});