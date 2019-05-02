odoo.define('pragtech_flatmates.form_data', function (require) {



$(document).ready(function() {

        //form data of What type of accommodation are you offering? Page
        $( "#list_place_accommodation_form_id" ).submit(function( event ) {
            var list_place_array = [];

            localStorage.setItem('list_place_array','[]')

            var temp_dict  = {}

            temp_dict['is_listing'] = true

            var accommodation_type = $('#type_of_accomodation').val()
            var property_type = $("input[name='property_type_input']:checked").val();

            if (accommodation_type){
                    temp_dict['accommodation_type'] = accommodation_type
            }

            if (property_type){
                temp_dict['property_type'] = property_type
            }

            if (accommodation_type != 'sharehouse')
                temp_dict['property_type'] = null



            var oldArray = JSON.parse(localStorage.getItem('list_place_array')) || [];
            oldArray.push(temp_dict)
            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('List Place Array : ',localStorage.getItem('list_place_array'))
            console.log('temp_dict : ',temp_dict);
            console.log('accommodation_type : ',accommodation_type);
            console.log('property_type :',property_type);
//            alert('TTTTTTTTTTTTTTTTTTTTTTTT')
//            event.preventDefault()
    //        localStorage.setItem("lastname", "Smith");
        });

        // form data of What type of property is this? Page
        $( "#whole_property_type_form_id" ).submit(function( event ) {

            var whole_property_property_type = $("input[name='whole_property_property_type']:checked").val();
            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));

            if (whole_property_property_type){
                    oldArray[0]['whole_property_property_type'] = whole_property_property_type
            }
            else{
                   oldArray[0]['whole_property_property_type'] = null
            }
            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('whole_property_property_type', whole_property_property_type)
            console.log('LOCAL STORAGE :',localStorage.getItem('list_place_array'))

        });

        //form data of About the property Page
        $( "#list_place_about_property_form_id" ).submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var property_address = $('.loc-field').val()
            var street_number = $("#street_number").val()
            var street_addrss = $("#sublocality_level_2").val()
            var route = $("#route").val()
            var city = $("#locality").val()
            var state = $("#administrative_area_level_1").val()
            var zip_code = $("#postal_code").val()
            var country = $ ("#country").val()
            var total_bedrooms = $("input[name='bed_rooms']:checked").val();
            var total_bathrooms = $("input[name='bath_rooms']:checked").val();
            var parking = $('#parking').val();
            var internet = $('#internet').val();
            var room_furnishing_type = $("input[name='room_furnishing_types']:checked").val();

            if (property_address){
                oldArray[0]['property_address'] = property_address;
            }
            if(street_number){
                oldArray[0]['street_number'] = street_number;
            }
            if (street_addrss){
                oldArray[0]['street1'] = street_addrss;
            }
            if (route){
                oldArray[0]['street2'] = route;
            }
            if (city){
                oldArray[0]['city'] = city;
            }
            if (state){
                oldArray[0]['state'] = state;
            }
            if (zip_code){
                oldArray[0]['zip_code'] = zip_code;
            }
            if (country){
                oldArray[0]['country'] = country;
            }
            if (total_bedrooms){
                oldArray[0]['total_bedrooms'] = total_bedrooms;
            }
            if (total_bathrooms){
                oldArray[0]['total_bathrooms'] = total_bathrooms;
            }
            if (parking){
                oldArray[0]['parking'] = parking;
            }
            if (internet){
               oldArray[0]['internet'] = internet;
            }
            if (room_furnishing_type){
                oldArray[0]['room_furnishing_type'] = room_furnishing_type
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('property_address ',property_address);
            console.log('--------------------------------------------')
            console.log('Street : ',street_addrss)
            console.log('Route : ',route)
            console.log('City : ',city)
            console.log('State : ',state)
            console.log('zip code : ',zip_code)
            console.log('Country : ',country)
            console.log('----------------------------------------------')
            console.log('total_bedrooms ', total_bedrooms);
            console.log('total_bathrooms ',total_bathrooms );
            console.log('parking ', parking);
            console.log('internet ',internet);
            console.log('room_furnishing_type ',room_furnishing_type)
            console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))
//            event.preventDefault()

        });

        //form data of Who currently lives in the property Page
         $( "#about_who_lives_here_form_id" ).submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var total_no_of_flatmates = $("input[name='total_no_of_flatmates']:checked").val();

            if (total_no_of_flatmates){
                oldArray[0]['total_no_of_flatmates'] = total_no_of_flatmates
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('total_no_of_flatmates ',total_no_of_flatmates );
            console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))

        });


        //form data of About the room(s) Page
        $( "#about_rooms_template_form_id" ).submit(function( event ) {

    //        var total_no_of_flatmates = $("input[name='total_no_of_flatmates']:checked").val();
    //        console.log('total_no_of_flatmates ',total_no_of_flatmates );
    //        alert('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var radio_btn_checked_length = $("input:checked").length
            var num_of_rooms = radio_btn_checked_length / 3
            var count = 1;
            var room = 1
            var one_room_data = {}
            var final_data = []
            $( $("input:checked") ).each(function( index )
            {
                var attribute = $(this).attr('name').substring(0, $(this).attr('name').length-2)
                console.log(attribute)
                if (count % 3 == 0)
                {
                    if (attribute == 'room_type')
                        one_room_data['room_type'] = $(this).val()
                    else if (attribute == 'room_furnishing_types')
                        one_room_data['room_furnishing_types'] = $(this).val()
                    else if (attribute == 'bathroom_types')
                        one_room_data['bathroom_types'] = $(this).val()
                    final_data.push({['Room_'+room.toString()] : one_room_data })
                    one_room_data = {}
                    room = room+1
                    count = count+1
                }
                else
                {
                    if (attribute == 'room_type')
                        one_room_data['room_type'] = $(this).val()
                    else if (attribute == 'room_furnishing_types')
                        one_room_data['room_furnishing_types'] = $(this).val()
//                        one_room_data.push({'room_furnishing_types' : $(this).val()})
                    else if (attribute == 'bathroom_types')
                        one_room_data['bathroom_types'] = $(this).val()
//                        one_room_data.push({'bathroom_types' : $(this).val()})
                    count = count+1
                }
            });

            if (final_data){
                   oldArray[0]['rooms_data'] = final_data
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log(";;;;;;;;;;;;;;;;;;;;;;;",final_data)
            console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))
//            alert('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')

        });

//        //form data of About the room(s) Page
//        $( "#about_rooms_template_form_id" ).submit(function( event ) {
//
//            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
//            var radio_btn_checked_length = $("input:checked").length
//            var num_of_rooms = radio_btn_checked_length / 3
//            var count = 1;
//            var room = 1
//            var one_room_data = []
//            var final_data = []
//            $( $("input:checked") ).each(function( index )
//            {
//                if (count % 3 == 0)
//                {
//                    one_room_data.push({[$(this).attr('name')] : $(this).val()})
//                    final_data.push({['Room_'+room.toString()] : one_room_data })
//                    one_room_data = []
//                    room = room+1
//                    count = count+1
//                }
//                else
//                {
//                    one_room_data.push({[$(this).attr('name')] : $(this).val()})
//                    count = count+1
//                }
//            });
//
//            if (final_data){
//                   oldArray[0]['rooms_data'] = final_data
//            }
//
//            localStorage.setItem('list_place_array', JSON.stringify(oldArray));
//
//            console.log(";;;;;;;;;;;;;;;;;;;;;;;",final_data)
//            console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))
//
//        });

        // form data of Rent, bond and bills Page
        $('#rent_bond_bills_template_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var weekly_rent = $('#weekly_rent').val()
            var bond = $('#bond').val()
            var bill = $('#bill').val()

            if (weekly_rent){
                oldArray[0]['weekly_rent'] = weekly_rent
            }
            if (bond){
                oldArray[0]['bond'] = bond
            }
            if (bill){
                oldArray[0]['bill'] = bill
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('weekly_rent :', weekly_rent);
            console.log('bond :', bond);
            console.log('bill :',bill);
            console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))

        });

        //form data of Room availability Page
         $('#room_availability_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var avail_date = $('#txtdate').val();
            var min_length_of_stay = $('#min_len_stay').val();
            var max_length_of_stay = $('#max_len_stay').val();

            if (avail_date){
                oldArray[0]['avail_date'] = avail_date
            }
            if (min_len_stay){
                oldArray[0]['min_length_of_stay'] = min_length_of_stay
            }
            if (max_length_of_stay){
                oldArray[0]['max_length_of_stay'] = max_length_of_stay
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('avail_date :', avail_date);
            console.log('min_length_of_stay :', min_length_of_stay);
            console.log('max_length_of_stay :', max_length_of_stay);
            console.log('LOCAL STORAGE 11 : ',localStorage.getItem('list_place_array'))


        });

        //form data of Property and room images Page
         $('#property_images_form_id').submit(function( event ) {
//            alert('ffffffffffffffffffffffffffffffffff')
            console.log('hereeeeeeeeeeeeeeeeeeeeeeeeee');


        });

        //form data of Flatmate Preference Page
         $('#flatmate_preference_template_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var flatmate_preference_type = $("input[name='flatmate_Preference_type']:checked").val();
            var is_female_only = $("input[name='female_only_state']:checked").val();

            if (flatmate_preference_type){
                oldArray[0]['flatmate_preference_type'] = flatmate_preference_type
            }
            if (is_female_only){
                oldArray[0]['is_female_only'] = is_female_only
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('flatmate_preference_type : ', flatmate_preference_type);
            console.log('Is Female : ', is_female_only)
            console.log('LOCAL STORAGE 33 : ',localStorage.getItem('list_place_array'))
//            alert('kKKKKKKKKKKKKKKKKKKKKKKKKKKK')


        });

        //form data of Accepting Page
         $('#list_place_accepting_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var accepting = [];
                $.each($("input[name='list_accept']:checked"), function(){
                    accepting.push($(this).val());
                });

            if (accepting){
                oldArray[0]['accepting'] = accepting
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('Accepting :: ', accepting);
            console.log('LOCAL STORAGE 44 : ',localStorage.getItem('list_place_array'))

        });


        //form data of Tell us about you and your flatmates Page

        $('#list_place_about_others_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var about_you_and_your_flatmates = $('#comment').val();

            if (about_you_and_your_flatmates){
                oldArray[0]['about_you_and_your_flatmates'] = about_you_and_your_flatmates
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            console.log('COMMENT : ', about_you_and_your_flatmates)
            console.log('LOCAL STORAGE 88 : ',localStorage.getItem('list_place_array'))
        });


        //form data of What's great about living at this property? Page

        $('#list_place_comment_abt_property_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var comment_about_property = $('#comment').val();

            if (comment_about_property){
                oldArray[0]['comment_about_property'] = comment_about_property
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));
            console.log('comment_about_property : ', comment_about_property)
            console.log('LOCAL STORAGE 99 : ',localStorage.getItem('list_place_array'))

            var list_place_data = JSON.parse(localStorage.getItem('list_place_array'));

            console.log('\nListplace data \n\n',list_place_data)
            if (list_place_data){
                $.ajax({
                        url:'/create/list_property',
                        type:'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'list_place_data': list_place_data}}),
                        success: function(data){
                            oldArray[0] = {}
                            localStorage.setItem('list_place_array', JSON.stringify(oldArray))
                            console.log('returnnnnnnnnnnnnnnnnn',localStorage.getItem('list_place_array'))
//                            alert('OOLLLLLLLLLLLLLLLLLL')
	                    },
                });

		    }
        });


    });
});