odoo.define('pragtech_flatmates.home_page', function (require) {
 var id=0;
 $(document).ready(function()
 {

    $('#lazy_load').on('click','.property_button',function()

    {
            id = $(this).data('button-id')
            var window_pathname = window.location.pathname
            var property_id=id
            var a = "P"+property_id
            if (window_pathname.includes('/search'))
                window.open('/'+a)
            else
                window.open(a)

    });

    $(document).on('click','.property-rounded-btn-location-link',function(){

         console.log("+++++++++ text of a link +++++++++",this.text)
         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         var property_preference_location = this.text
         $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------",result)
                    if (result)
                    {
                    $('.property-rounded-btn-location-link').attr('href','/search/records?listing_type=find&city='+result['result']['suburbs_city']+'&property_preference_location='+property_preference_location)
                    }
                }
         })
    })

     $(document).on('click','.property-rounded-btn-link',function(){

         console.log("+++++++++ text of a link +++++++++",this.text)
         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         var property_preference = this.text
         $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------",result)
                    if (result)
                    {
                    $('.property-rounded-btn-link').attr('href','/search/records?listing_type=list&city='+result['result']['city']+'&property_preference='+property_preference)
                    }
                }
         })
    })

     $(document).on('click','.subrub_name',function(){

         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         else if (path.indexOf('/list_place_preview') !== -1 || path.indexOf('/find_place_preview') !== -1)
         {
                  if (path.indexOf('/list_place_preview') !== -1){
                  var property_id=path.split('list_place_preview').pop()
                  console.log("\n---------")

                  }
                  else{
                  var property_id=path.split('find_place_preview').pop()
                  }

         }
         var subrub_name = this.text
         $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------",result)
                    if (result)
                    {
                    $('.subrub_name').attr('href','/search/records?listing_type=find&city='+result['result']['suburbs_city']+'&subrub_name='+subrub_name)
                    }
                }
         })
    })

    $(document).on('click','.property_type',function(){

         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         else if (path.indexOf('/list_place_preview') !== -1 || path.indexOf('/find_place_preview') !== -1)
         {
                  if (path.indexOf('/list_place_preview') !== -1){
                  var property_id=path.split('list_place_preview').pop()
                  console.log("\n---------")

                  }
                  else{
                  var property_id=path.split('find_place_preview').pop()
                  }

         }
         var property_type = this.text
         $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------",result)
                    if (result)
                    {
                    $('.property_type').attr('href','/search/records?listing_type=list&city='+result['result']['city']+'&property_type='+property_type)
                    }
                }
         })
    })
    $(document).on('click','.property_street',function(){

         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         var property_street = this.text
         $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------",result)
                    if (result)
                    {
                    $('.property_street').attr('href','/search/records?listing_type=list&city='+result['result']['city']+'&property_street='+property_street)
                    }
                }
         })
    })



    if (window.location.href.indexOf("/P") > -1 || window.location.href.indexOf("/list_place_preview") > -1 || window.location.href.indexOf("/find_place_preview") > -1)
    {

         var path=window.location.pathname
         if (path.indexOf('P') !== -1){
         var property_id=path.split('P').pop()
         }
         else if (path.indexOf('/list_place_preview') !== -1 || path.indexOf('/find_place_preview') !== -1)
         {
                  if (path.indexOf('/list_place_preview') !== -1){
                  var property_id=path.split('list_place_preview').pop()
                  console.log("\n---------")

                  }
                  else{
                  var property_id=path.split('find_place_preview').pop()
                  }

         }



        $.ajax({
                url : "/get_html_content_property_detail",   // calls to controller method
                type:'POST',
                dataType: 'json',
                async:false,
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'id':property_id}}),
                success : function(result) {    // work after controller method return
                    console.log("---------result['result']['city']---------")
                    if (result)
                    {
                        $("#description_about_property").html(result['result']['description_about_property'])
                        $("#description_about_user").html(result['result']['description_about_user'])
                        $('.breadcrumb_city').attr('href','/search/records?listing_type=list&city='+result['result']['city'])
                        $('.breadcrumb_suburb_city').attr('href','/search/records?listing_type=find&city='+result['result']['suburbs_city'])
                        $('.view_more_find_property_button').attr('href','/search/records?listing_type=find&city='+result['result']['city'])
                        $('.view_more_property_button').attr('href','/search/records?listing_type=list&city='+result['result']['suburbs_city'])
                        $('.breadcrumb_accomodation').attr('href','/search/records?listing_type=list&city='+result['result']['city']+'&property_type='+result['result']['property_type'])
                        if (result['result']['listing_type'] == 'find')
                        {
                            $("#map_container").css('display','none')
                            $('#map_section').css('display','none')
                            $('.navbar').attr('style', 'background-color: #17a2b8 !important')

                        }
                        else if (result['result']['listing_type'] == 'list'){
                        $('.navbar').attr('style', 'background-color: #e9573e !important')

                        }
                    }
                    if (result['result']['latitude'] && result['result']['longitude'])
                    {
                        initMap()
                    }
                    var map;
                    var marker;

                    function initMap()
                    {
                          var Australia_Bounds = {
                            north: Number(result['result']['north']),
                            south: Number(result['result']['south']),
                            west:  Number(result['result']['west']),
                            east:  Number(result['result']['east']),
                          };

                          console.log("\n----bounds----",Australia_Bounds)

                          var uluru = {lat: Number(result['result']['latitude']), lng: Number(result['result']['longitude'])};
                          map = new google.maps.Map(document.getElementById('map'),
                                        {
                                        zoom: 21,
                                        center:  uluru,
                                        gestureHandling: 'greedy',
                                        mapTypeId: google.maps.MapTypeId.ROADMAP,

                                        restriction: {
                                                        latLngBounds: Australia_Bounds,
                                                        strictBounds: false,
                                                      },

                                        });



                          service = new google.maps.places.PlacesService(map);
                          service.nearbySearch(
                            {location: uluru, radius: 100, type: ['bus_station']},
                            function(results, status, pagination) {
                              if (status !== 'OK') return;
                              createMarkers(results);
                          });

                           service.nearbySearch(
                            {location: uluru, radius: 100, type: ['restaurant']},
                            function(results, status, pagination) {
                              if (status !== 'OK') return;
                               console.log("===========result========",results,results.length)
                               if (path.indexOf('P') !== -1){
                              for (var i=0;i<results.length;i++){
                              $(".map_table_restaurants").append("<tr><td class='border-0 col-8'>" + results[i]['name'] +"</td><td class='border-0 col-4 text-right'>Close by</td></tr>");
                              }
                              $(".map_table_restaurants").append("<tr><td class='col-8'> <a href='#' class='show_more'>+ Show more</a></td><td class='col-4 text-right'></td> </tr>")
                                }
                              createMarkers(results);
                          });
                          service.nearbySearch(
                            {location: uluru, radius: 100, type: ['train_station']},
                            function(results, status, pagination) {
                              if (status !== 'OK') return;

                              createMarkers(results);
                          });
                          service.nearbySearch(
                            {location: uluru, radius: 100, type: ['supermarket']},
                            function(results, status, pagination) {
                            console.log("======resultt--------",status)
                              if (status !== 'OK') return;
                              if (path.indexOf('P') !== -1){
                              for (var i=0;i<results.length;i++){
                              $(".map_table_supermarket").append("<tr><td class='border-0 col-8'>" + results[i]['name'] +"</td><td class='border-0 col-4 text-right'>29 min walk</td></tr>");
                              }
                              $(".map_table_supermarket").append("<tr><td class='col-8'> <a href='#' class='show_more'>+ Show more</a></td><td class='col-4 text-right'></td> </tr>")
                              }
                              createMarkers(results);
                          });

                          service.nearbySearch(
                            {location: uluru, radius: 100, type: ['cafe']},
                            function(results, status, pagination) {
                              if (status !== 'OK') return;

                              createMarkers(results);
                          });

                          var geocoder = new google.maps.Geocoder;
                          var infowindow = new google.maps.InfoWindow;
                          geocodeLatLng(geocoder, map, infowindow);




                    }

                    function geocodeLatLng(geocoder, map, infowindow)
                    {
                          var latlng = {lat: Number(result['result']['latitude']), lng:Number(result['result']['longitude'])};
                          geocoder.geocode({'location': latlng,}, function(results, status)
                          {
                              if (status === 'OK')
                              {
                                    if (results[0])
                                    {
                                        label_info=[results[0].formatted_address]
                                        console.log("====label===",typeof label_info[0])
                                        marker = new google.maps.Circle
                                        ({
                                        position: latlng,
                                        map: map,
                                        radius:3,
                                        fillColor: '#00a693',
                                        fillOpacity: 0.90,
                                        strokeColor: '#00a693',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        center:latlng,
                                        draggable: true,
                                        raiseOnDrag: true,
//                                        label: "Little Mount St",
//                                        labelAnchor: new google.maps.Point(15, 65),
//                                        labelClass: "labels", // the CSS class for the label
//                                        labelInBackground: false,
//                                         icon: pinSymbol('blue')

                                        });



                                      infowindow.setContent(label_info[0]);
                                      infowindow.open(map, marker);


                                    }
                                    else
                                    {
                                      window.alert('No results found');
                                    }
                              }
                              else
                              {
                                window.alert('Geocoder failed due to: ' + status);
                              }
                        });


                    }

//                    function pinSymbol(color) {
//                        return {
//                            path: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
//                            radius:3,
//                                        fillColor: '#00a693',
//                                        fillOpacity: 0.90,
//                                        strokeColor: '#00a693',
//                                        strokeOpacity: 0.8,
//                                        strokeWeight: 2,
//                        };
//                    }


                     function createMarkers(places) {
                     console.log("\n---in create----")
                                var bounds = new google.maps.LatLngBounds();
                                for (var i = 0, place; place = places[i]; i++) {
                                  var image = {
                                    url: place.icon,
//                                    size: new google.maps.Size(21, 21),
//                                    origin: new google.maps.Point(0, 0),
//                                    anchor: new google.maps.Point(17, 34),
                                    scaledSize: new google.maps.Size(21, 21)
                                  };

                                  marker = new google.maps.Marker({
                                    map: map,
                                    icon: image,
                                    title: place.name,
                                    position: place.geometry.location
                                  });

                                  bounds.extend(place.geometry.location);
                                }
                                map.fitBounds(bounds);
                                }





                },


        });
    }



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
	  			console.log(' in short list ',result)

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
				  			console.log(' in short list ',result)

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

    //console.log($(".homestay").hasClass('items-cirle-hover'))

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
            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> ::: ',)
            $('#main_column').removeClass('col-md-8');
        })




//    $(".start-listing").click(function(){
//            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
//            $(".o_affix_enabled").css({"display": "none"});
//            $(".o_header_affix affix").css({"display": "none"});
////            event.preventDefault();
//
//    });
	
	
	

});
	
	
$(window).load(function() {
    $(".loader").fadeOut("slow");
});	


});