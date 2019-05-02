odoo.define('pragtech_flatmates.whole_property_property_type_page', function (require) {

$(document).ready(function() {

//    $(".whole-property-type-next-btn").click(function(){
//        console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
//        $('.room_furnishing_in_about').css('display','inline');
//    });

//    Adding And Removing Class for "What type of property is this?" Page
    });

$(document).ready(function() {
	"use strict";

console.log('windowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww1111111111111',window.location.pathname)
	if (window.location.pathname == '/listplace/whole-property/about')
	{
	console.log('windowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
	$('#room_furnishing_in_about_id').show();
	}

  $(".2_bedrooms_property").click(function() {
  console.log('AAtttttttttttttttttttttttttt1111111111')


      $('.2-bedrooms').addClass("bedroom-btn-active")
      $('.1-bedrooms').removeClass("bedroom-btn-active")
      $('.studio').removeClass("bedroom-btn-active")
      $('.granny-flat').removeClass("bedroom-btn-active")
  });

  $(".1_bedrooms_property").click(function() {
  console.log('AAtttttttttttttttttttttttttt222222222')

      $('.1-bedrooms').addClass("bedroom-btn-active")
      $('.2-bedrooms').removeClass("bedroom-btn-active")
      $('.studio').removeClass("bedroom-btn-active")
      $('.granny-flat').removeClass("bedroom-btn-active")
  });

  $(".studio_property").click(function() {
  console.log('AAtttttttttttttttttttttttttt3333333333')

      $('.studio').addClass("bedroom-btn-active")
      $('.1-bedrooms').removeClass("bedroom-btn-active")
      $('.2-bedrooms').removeClass("bedroom-btn-active")
      $('.granny-flat').removeClass("bedroom-btn-active")
  });

  $(".granny_flat_property").click(function() {
  console.log('AAtttttttttttttttttttttttttt4444444444')

      $('.granny-flat').addClass("bedroom-btn-active")
      $('.2-bedrooms').removeClass("bedroom-btn-active")
      $('.1-bedrooms').removeClass("bedroom-btn-active")
      $('.studio').removeClass("bedroom-btn-active")
  });


});


});