odoo.define('pragtech_flatmates.edit_preview_page', function (require){


    $(document).ready(function(){
var window_pathname = window.location.pathname
        $(".edit_about_the_room").on('click',function(){
            console.log(" !!!!!! Edit About the Room call !!!!!!!!")	
            $('.styles__errorMessage_preview').hide();
            var current_property_id = $("#current_listing_id").val()

            console.log("Current Listing id :",current_property_id)
            $("#edit_weekly_budget").keypress(function(e){
             var keyCode = e.which; /* 8 - (backspace) 32 - (space) 48-57 - (0-9)Numbers */
             if ( (keyCode != 8 || keyCode ==32 ) && (keyCode < 48 || keyCode > 57))
              {
                 return false;
              }
            });




            var $input2 = $("#edit_weekly_budget");
            if (window_pathname.includes('list_place_preview') && $input2)
            {
                         if ($input2.val().length == 0 )
                        {
                            $('.styles__errorMessage_preview').hide();
                        }
                //console.log ("In general statement if (window_pathname.includes('about-property'))")
                if ($input2.val() > 10000){
                    $('#update_rooms_data').prop("disabled", true)
                }
            }
            $input2.on('keyup', function (){

                if ($input2.val() <= 10000 )
                    {
                        $('.styles__errorMessage_preview').hide();
                        // Code added by dhrup
                        $('#update_rooms_data').prop("disabled", false)
                        $('#edit_weekly_budget').removeClass("border-red");
                    }

                if ($input2.val() > 10000 )
                    {
                        $('.styles__errorMessage_preview').show();
                        // Code added by dhrup
                        $('#edit_weekly_budget').addClass("border-red");
                        $('#update_rooms_data').prop("disabled", true)

                    }
                else
                    {
                        $('.styles__errorMessage_preview').hide();
                        // Code added by dhrup
                        $('#update_rooms_data').prop("disabled", false)
                        $('#edit_weekly_budget').removeClass("border-red");
                    }
            });

            $.ajax({
                    url: '/get_about_room_data_of_current_property',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id}}),
                    success: function(data)
                    {
                        console.log(' !! data : ',data['result'])

                        $("#edit_weekly_budget").val(data['result']['weekly_budget'])
                        $("#edit_date").val(data['result']['avil_date'])

                        bill_ids = data['result']['bill_ids']
                        $('#edit_bills_id').empty()
                        for(var i=0;i<bill_ids.length;i++){
                            var bill_id = bill_ids[i]
                            console.log('Bill id :',bill_id)
                            $('#edit_bills_id').append('<option value='+bill_id[0]+'>'+bill_id[1]+'</option>')
                        }

                        bond_ids = data['result']['bond_ids']
                        $('#edit_bond_id').empty()
                        for(var i=0;i<bond_ids.length;i++){
                            var bond_id = bond_ids[i]
                            console.log('bond_id :',bond_id)
                            $('#edit_bond_id').append('<option value='+bond_id[0]+'>'+bond_id[1]+'</option>')
                        }

                        room_furnishing_ids = data['result']['room_furnishing_ids']
                        $('#edit_room_furnishing_id').empty()
                        for(var i=0;i<room_furnishing_ids.length;i++){
                            var room_furnishing_id = room_furnishing_ids[i]
                            console.log('room_furnishing_id :',room_furnishing_id)
                            $('#edit_room_furnishing_id').append('<option value='+room_furnishing_id[0]+'>'+room_furnishing_id[1]+'</option>')
                        }

                        room_types = data['result']['room_types']
                        $('#edit_room_type_id').empty()
                        for(var i=0;i<room_types.length;i++){
                            var room_type = room_types[i]
                            console.log('room_type :',room_type)
                            $('#edit_room_type_id').append('<option value='+room_type[0]+'>'+room_type[1]+'</option>')
                        }

                        bath_room_types = data['result']['bath_room_types']
                        $('#edit_bath_room_type_id').empty()
                        for(var i=0;i<bath_room_types.length;i++){
                            var bath_room_type = bath_room_types[i]
                            console.log('bath_room_type :',bath_room_type)
                            $('#edit_bath_room_type_id').append('<option value='+bath_room_type[0]+'>'+bath_room_type[1]+'</option>')
                        }

                        min_stay_ids = data['result']['min_stay_ids']
                         $('#edit_min_stay_id').empty()
                        for(var i=0;i<min_stay_ids.length;i++){
                            var min_stay_id = min_stay_ids[i]
                            console.log('min_stay_id :',min_stay_id)
                            $('#edit_min_stay_id').append('<option value='+min_stay_id[0]+'>'+min_stay_id[1]+' min'+'</option>')
                        }

                        max_stay_ids = data['result']['max_stay_ids']
                        $('#edit_max_stay_id').empty()
                        for(var i=0;i<max_stay_ids.length;i++){
                            var max_stay_id = max_stay_ids[i]
                            console.log('max_stay_id :',max_stay_id)
                            $('#edit_max_stay_id').append('<option value='+max_stay_id[0]+'>'+max_stay_id[1]+' max'+'</option>')
                        }

                        $('#edit_bills_id').val(data['result']['existing_bill_id']);
                        $('#edit_bond_id').val(data['result']['existing_bond_id']);
                        $('#edit_room_furnishing_id').val(data['result']['existing_room_furnishing_id'])
                        $('#edit_room_type_id').val(data['result']['existing_room_type_id'])
                        $('#edit_bath_room_type_id').val(data['result']['existing_bath_room_type_id'])
                        $('#edit_min_stay_id').val(data['result']['existing_min_stay_id'])
                        $('#edit_max_stay_id').val(data['result']['existing_max_stay_id'])
                        $('#edit_gender_preference').val(data['result']['existing_preference'])


                    }
                });
        })//edit about rooms

        $("#update_rooms_data").on('click',function(){
            console.log(" ! Update About rooms data !")
            var data = {}
            var current_property_id = $("#current_listing_id").val()
            var update_weekly_budget = $("#edit_weekly_budget").val()
            var update_bill = $("#edit_bills_id").val()
            var update_bond = $("#edit_bond_id").val()
            var update_room_furnishing = $("#edit_room_furnishing_id").val()
            var update_room_type = $("#edit_room_type_id").val()
            var update_bath_room_type = $("#edit_bath_room_type_id").val()
            var update_available_date = $("#edit_date").val()
            var update_min_stay = $("#edit_min_stay_id").val()
            var update_max_stay = $("#edit_max_stay_id").val()
            var update_preference = $('#edit_gender_preference').val()

            data = {
                'current_property_id':current_property_id,
                'update_weekly_budget':update_weekly_budget,
                'update_bill':update_bill,
                'update_bond':update_bond,
                'update_room_furnishing':update_room_furnishing,
                'update_room_type':update_room_type,
                'update_bath_room_type':update_bath_room_type,
                'update_available_date':update_available_date,
                'update_min_stay':update_min_stay,
                'update_max_stay':update_max_stay,
                'update_preference':update_preference,
            }

            console.log('----------------------------------------')
            console.log('update_weekly_budget : ', update_weekly_budget)
            console.log('update_bill ',update_bill)
            console.log('update_bond ',update_bond)
            console.log('update_room_furnishing ',update_room_furnishing)
            console.log('update_available_date ',update_available_date)
            console.log('update_min_stay ',update_min_stay)
            console.log('update_max_stay ',update_max_stay)
            console.log('-----------------------------------------')

            $.ajax({
                    url: '/update_about_rooms_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){
                    }
            });
// $(".room-rent").load(location.href + " .room-rent");
//             $(".room-months").load(location.href + " .room-months");
//             $(".room-date").load(location.href + " .room-date");
            location.reload();

        });

        $('#edit_about_property_btn').on('click',function(){

             $('.not_include_contact_info').hide()
            var current_property_id = $("#current_listing_id").val()

			
            $.ajax({
                    url: '/get_about_property_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id}}),
                    success: function(data){
                        if(data['result']['about_property_description']){
                                $('.edit_about_property_div').html(data['result']['about_property_description'])
                                console.log("\n\n----",$('.edit_about_property_div').text(),data['result']['about_property_description'])
                                $('#edit_about_property').html($('.edit_about_property_div').text())

                        }

                    }
            });
        });

        $(document).on('click','.set-as-featured',function(event){

               var current_property_id = $("#current_listing_id").val()
               console.log('12222222  click  222222222222',$(this))
                console.log('12222222  click  222222222222',$(this)[0].attributes[5])
                if ($(this)[0].attributes[5]){
                 var image_name=$(this)[0].attributes[5].value
                }
                else if($(this)[0].attributes[1]){
               var image_name=$(this)[0].attributes[1].value
               }


               $.ajax({
                        url: '/set_as_featured',
                        type: "POST",
                        dataType: 'json',
                        async : false,
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id,'image_name':image_name}}),
                        success: function(data){
                            if(data['result'] && data['result'] == true){
//                                location.reload()
//console.log('12222222  load  222222222222',)
                                $(".slider").load(location.href + " .slider");


                            }

                        }
               });
        })

		$('#update_about_property_desc').on('mousedown', function(event) {
    		event.preventDefault();
		}).on('click',function(){
               console.log('12222222222222222222',$('.not_include_contact_info'))
			   $('.not_include_contact_info').hide()
               var current_property_id = $("#current_listing_id").val()
               var update_about_property_desc = $('#edit_about_property').val()
               var data = {}

               data = {
               'current_property_id':current_property_id,
               'update_about_property_desc':update_about_property_desc,
               }

            $.ajax({
                    url: '/update_about_property_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){
                    }
            });
            location.reload();
        })

		$(document).on('focus','#edit_about_property',function()
		{
		 console.log('dddddddddddddddddddddddddddddd')
		$('.not_include_contact_info').show()
		})

		
		$(document).on('blur','#edit_about_property', function()
	 	{
			console.log('dddddddddddddddddddddddddddddd Insode')
			$('.not_include_contact_info').hide()
		})		

        $('#edit_property_descrp').on('click',function(){
            console.log('5555555555555555555555555555555555555')

            var current_property_id = $("#current_listing_id").val()
            console.log("Current Listing id :",current_property_id)

            $.ajax({
                    url: '/get_property_descp_data_of_current_property',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id}}),
                    success: function(data){
                    console.log(' !! data : ',data['result'])

                        total_bedrooms = data['result']['total_bedrooms']
                        $('#edit_total_bedroom').empty()
                        for(var i=0;i<total_bedrooms.length;i++){
                            var total_bedroom = total_bedrooms[i]
                            console.log('total_bedrooms id :',total_bedroom)
                            $('#edit_total_bedroom').append('<option value='+total_bedroom[0]+'>'+total_bedroom[1]+' bed property'+'</option>')
                        }

                        total_bathrooms = data['result']['total_bathrooms']
                        $('#edit_total_bathroom').empty()
                        for(var i=0;i<total_bathrooms.length;i++){
                            var total_bathroom = total_bathrooms[i]
                            console.log('total_bathrooms id :',total_bathroom)
                            $('#edit_total_bathroom').append('<option value='+total_bathroom[0]+'>'+total_bathroom[1]+' bathrooms'+'</option>')
                        }

                        total_flatmates = data['result']['total_flatmates']
                        $('#edit_total_flatmates').empty()
                        for(var i=0;i<total_flatmates.length;i++){
                            var total_flatmate = total_flatmates[i]
                            console.log('total_flatmates id :',total_flatmate)
                            $('#edit_total_flatmates').append('<option value='+total_flatmate[0]+'>'+total_flatmate[1]+' flatmates'+'</option>')
                        }

                        internets = data['result']['internet']
                        $('#edit_internet').empty()
                        for(var i=0;i<internets.length;i++){
                            var internet = internets[i]
                            console.log('internet id :',internet)
                            $('#edit_internet').append('<option value='+internet[0]+'>'+internet[1]+'</option>')
                        }
                        parkings = data['result']['parking']
                        $('#edit_parking').empty()
                        for(var i=0;i<parkings.length;i++){
                            var parking = parkings[i]
                            console.log('parking id :',parking)
                            $('#edit_parking').append('<option value='+parking[0]+'>'+parking[1]+'</option>')
                        }

                        //Set existing data
                        $('#edit_total_bedroom').val(data['result']['existing_bedroom_id'])
                        $('#edit_total_bathroom').val(data['result']['existing_bathroom_id'])
                        $('#edit_total_flatmates').val(data['result']['existing_no_of_flatmates'])
                        $('#edit_internet').val(data['result']['existing_internet_id'])
                        $('#edit_parking').val(data['result']['existing_parking_id'])

                        if(data['result']['existing_property_type']){
                            $('#edit_property_type').val(data['result']['existing_property_type'])
                        }

                    }
            });


        });

        $('#update_property_descp').on('click',function(){
            console.log('666666666666666666666666666666666666666666')
            var data = {}

            var property_address = $('.loc-field').val()
            var street_number = $("#street_number").val()
            var street_addrss = $("#sublocality_level_2").val()
            var route = $("#route").val()
            var city = $("#locality").val()
            var state = $("#administrative_area_level_1").val()
            var zip_code = $("#postal_code").val()
            var country = $("#country").val()
            var latitude = $("#latitude").val()
            var longitude = $("#longitude").val()
            var north = $("#north").val()
            var east = $("#east").val()
            var south = $("#south").val()
            var west = $("#west").val()

            var current_property_id = $("#current_listing_id").val()
            var update_property_type = $("#edit_property_type").val()
            var update_bedrooms = $("#edit_total_bedroom").val()
            var update_bathrooms = $("#edit_total_bathroom").val()
            var update_flatmates = $("#edit_total_flatmates").val()
            var update_internet = $("#edit_internet").val()
            var update_parking = $("#edit_parking").val()

            data = {
                'current_property_id':current_property_id,
                'update_property_type':update_property_type,
                'update_bedrooms':update_bedrooms,
                'update_bathrooms':update_bathrooms,
                'update_flatmates':update_flatmates,
                'update_internet':update_internet,
                'update_parking':update_parking,
            }


            console.log('----------------------------------')
            console.log('current_property_id ',current_property_id)
            console.log('update_property_type ',update_property_type)
            console.log('update_bedrooms ',update_bedrooms)
            console.log('update_bathrooms ',update_bathrooms)
            console.log('update_flatmates ',update_flatmates)
            console.log('update_internet ',update_internet)
            console.log('update_parking ',update_parking)
            console.log('----------------------------------')

            if (property_address){
                data['property_address'] = property_address;
            }
            if(street_number){
                data['street_number'] = street_number;
            }
            if (street_addrss){
                data['street1'] = street_addrss;
            }
            if (route){
                data['street2'] = route;
            }
            if (city){
                data['city'] = city;
            }
            if (state){
                data['state'] = state;
            }
            if (zip_code){
                data['zip_code'] = zip_code;
            }
            if (country){
                data['country'] = country;
            }
            if (latitude){
                data['latitude'] = latitude;
            }
            if (longitude){
                data['longitude'] = longitude;
            }
            if (north){
                data['north'] = north;
            }
            if (east){
                data['east'] = east;
            }
            if (south){
                data['south'] = south;
            }
            if (west){
                data['west'] = west;
            }

            console.log('data after address :: ',data)

            $.ajax({
                    url: '/update_property_descp',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){
                    }
            });
            location.reload();

        });

        $(document).on('click','.update-accepting',function(){
            console.log('update----', $(this).find('.icons-accept').hasClass('fa-check'))
//            console.log(ev.target.offsetParent)
//            console.log(ev.target.offsetParent.childNodes)
//            console.log(ev.target.offsetParent.childNodes[3].checked)
            if ($(this).find('.icons-accept').hasClass('fa-check') == true){
                console.log('0000000000000000000000000000000')
                $(this).find('input').attr("checked","checked")
//                ev.target.offsetParent.childNodes[3].checked = true
            }
            else{
                console.log('11111111111111111111111')
//              ev.target.offsetParent.childNodes[3].checked = false
                $(this).find('input').removeAttr("checked")
            }

        })


        $('#edit_accepting_id').on('click',function(){
            console.log('7777777777777888888888888888888888888888999999999999')
            var current_property_id = $("#current_listing_id").val();
//            document.getElementById("mySelect").selectedIndex;
            console.log("\n current property vals as___________________",current_property_id);
            $.ajax({
                    url: '/get_accepting_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id}}),
                    success: function(data){
                        console.log('data $$$@@@@@@@@@@@@@@@@@@@@ ',data,(data['result']).length)
                        for (var key in data['result']) {
                        	class_as=false
                        	console.log("\n iiiiiiiiiii____111___lgbti___iiiiiiii",key)
						    if (data['result'].hasOwnProperty(key)) {
						    	console.log("\n iiiiiiiiiii____222222______iiiiiiii",key)
						    	if (key=='LGBTI'){
						    		$(".icon-lgbti").removeClass("fa-times")
							    	$(".icon-lgbti").addClass("fa-check")
							    	$(".input-LGBTI").attr('checked','checked')
						    	}
						    	else{
						    	$(".icon-"+key).removeClass("fa-times")
						    	$(".icon-"+key).addClass("fa-check")
						    	$(".input-"+key).attr('checked','checked')
						    	}
						    }
						}
                        children = document.querySelectorAll('.accept-check .fa-check');
                        for(var i = 0; i < children.length; i++){
                            children[i].parentElement.style.backgroundColor ='#11836c';
                        	console.log("ENtERRRRRRRRRRRR yoooooooooo",children[i].parentElement,children[i].children,children[i].parentElement.offsetParent);
                        }
                        console.log("\n class as_____22222222__________",children,children.length)
                    }

            })
        })



         $(document).on('click','#update_accepting_btn',function(){
             var update_accepting = []

//            var checkboxes = document.getElementsByClassName('cat_check');
//            for (var i = 0; i < checkboxes.length; i++) {
//            if(checkboxes[i].checked == true){
//                console.log(checkboxes[i])
//                update_accepting.push(checkboxes[i].value);
//            }
////            checkboxes[i].checked = false;
//            }
            var data = {}
            var current_property_id = $("#current_listing_id").val()

            $.each($("input[id='edit_accepting']:checked"), function(){
                    update_accepting.push($(this).val());
            });


            console.log('update accepting array ::',update_accepting)
            event.preventDefault()
            data = {
            'current_property_id':current_property_id,
            'update_accepting':update_accepting
            }

            $.ajax({
                    url: '/update_accepting_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){
                    }
            });
            location.reload();


        })

         $(document).on('click','.about_room_popup_close',function(){

//         location.reload();
         })

         $(document).on('click','.list_place_property_preferences_popup_close',function(){

//         location.reload();
         })

         $(document).on('click','.about_property_popup_close',function(){

//         location.reload();
         })

         $(document).on('click','.about_the_user_popup_close',function(){

//         location.reload();
         })

         $(document).on('click','.property-description-edit_popup_close',function(){

//         location.reload();
         })

         $("#about_room_popup").on("hidden.bs.modal", function () {
//              location.reload();
        });
        $("#list_place_property_preferences_popup").on("hidden.bs.modal", function () {
//              location.reload();
        });
        $("#about_property_popup").on("hidden.bs.modal", function () {
//              location.reload();
        });
        $("#property-description-edit_popup").on("hidden.bs.modal", function () {
//              location.reload();
        });
         $("#about_the_flatmates_popup").on("hidden.bs.modal", function () {
//              location.reload();
        });


        $(".list_preview_listings").on("click", function () {
         var path=window.location.pathname
        var property_id=path.split('list_place_preview').pop()
        var a = "P"+property_id
         window.open('/'+a)
        });

        $(".open-detail-of-match").on('click',function(e){
            console.log('222222222222222222222222222222222',$(this).find(".match_id").val())
//            var id = e.target.attributes.value2.value
            var id = $(this).find(".match_id").val()
            window.open("P"+id)

        })

        $(".edit_list_deactivate_listing_button").on("click", function () {
         var path=window.location.pathname
        var property_id=path.split('list_place_preview').pop()
         $.ajax({
                            url: '/edit_deactivate_listing',
                            type: "POST",
                            dataType: 'json',
                            async : false,
                            contentType: 'application/json',
                            data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'property_id':property_id}}),
                            success: function(data){
                                console.log("\n==========data============== deactive",data)
                                if (data['result'] == true){
                                window.location.replace('/')
                                }
                            }
                    });

        })

         $(".edit_list_activate_listing_button").on("click", function () {
         var path=window.location.pathname
        var property_id=path.split('list_place_preview').pop()
         $.ajax({
                            url: '/edit_activate_listing',
                            type: "POST",
                            dataType: 'json',
                            async : false,
                            contentType: 'application/json',
                            data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'property_id':property_id}}),
                            success: function(data){
                                console.log("\n==========data============== active",data)
                                if (data['result'] == true){
                                window.location.replace('/')
                                }
                            }
                    });

        })
         $(".edit_list_delete_listing_button").on("click", function () {
         var path=window.location.pathname
        var property_id=path.split('list_place_preview').pop()
         var redirect = false
         $.ajax({
                            url: '/edit_delete_listing',
                            type: "POST",
                            dataType: 'json',
                            async : false,
                            contentType: 'application/json',
                            data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'property_id':property_id}}),
                            success: function(data){
                                if (data['result'] == true){
                                 redirect = true

                                }

                            },

                    });
                    if(redirect){
                     window.location.replace('/')
                    }
                    event.preventDefault()

        })



    $(".update-accepting").on('click',function(){
        console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this))
        if($(this).find('i').hasClass('fa-times') == false){
            console.log('ifffffffffffffffffffffffffffffffff in accept')
            $(this).find(".accept-check").css('background-color','#e4e5e6')
        }
        else{
            console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee in accept ')
            $(this).find(".accept-check").css('background-color','#11836c')
        }
    })


    $('#edit_about_flatmates_btn').on('click',function(){
            console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
            var current_property_id = $("#current_listing_id").val()
            $('.not_include_contact_info').hide()
            var current_property_id = $("#current_listing_id").val()

//            $("#edit_about_flatmates").focus(function(){
//             console.log('dddddddddddddddddddddddddddddd')
//            $('.not_include_contact_info').show()
//            })
//            $("#edit_about_flatmates").blur(function(){
//            $('.not_include_contact_info').hide()
//            })

            $.ajax({
                    url: '/get_about_flatmates_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_property_id':current_property_id}}),
                    success: function(data){

                        if(data['result']['about_user_description']){
                                $('.edit_about_flatmates_div').html(data['result']['about_user_description'])
                                $('#edit_about_flatmates').html($('.edit_about_flatmates_div').text())

                        }

                    }
            });
    });

    $('#update_about_flatmates_desc').on('mousedown', function(event) {
    		event.preventDefault();
		}).on('click',function(){

//    $('#update_about_flatmates_desc').on('click',function(){
//               console.log('12222222222222222222')

               var current_property_id = $("#current_listing_id").val()
               var update_about_user_desc = $('#edit_about_flatmates').val()
               var data = {}

               data = {
               'current_property_id':current_property_id,
               'update_about_user_desc':update_about_user_desc,
               }

            $.ajax({
                    url: '/update_about_user_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){
                    }
            });
            location.reload();
    })

    $(document).on('focus','#edit_about_flatmates',function()
		{
		 console.log('dddddddddddddddddddddddddddddd')
		$('.not_include_contact_info').show()
		})


		$(document).on('blur','#edit_about_flatmates', function()
	 	{
			console.log('dddddddddddddddddddddddddddddd Insode')
			$('.not_include_contact_info').hide()
		})








    })//document.ready
})//main