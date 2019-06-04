odoo.define('pragtech_flatmates.form_data', function (require) {



$(document).ready(function() {
        //form data of What type of accommodation are you offering? Page
        $( "#find_about_flatmates" ).submit(function( event ) {
            localStorage.setItem('find_place_record','[]')

            var find_property_looking_for = []
            var find_teamups_status = $("input[name=temaups]").is(":checked")

            var temp_dict  = {}
            var record_array = JSON.parse(localStorage.getItem('find_place_record')) || [];


            $("input[name=find_place_looking]:checked").each(function()
            {
            find_property_looking_for.push($(this).val())
            //console.log($(this).val())
            })
            temp_dict['is_finding'] = true
            temp_dict['find_property_looking_for'] = find_property_looking_for
            temp_dict['find_teamups_status'] = find_teamups_status

            record_array.push(temp_dict)
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
            //console.log('//////////////////////////////// ',temp_dict)
            //console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))

//            alert("Page")

        });

        $( "#rent_timing" ).submit(function( event ) {
            var record_array = JSON.parse(localStorage.getItem('find_place_record'));
//            console.log(record_array)

            var suburbs = $("input[id=suburbs]").map(function(){return $(this).val();}).get();
            record_array[0]['suburbs'] = suburbs

            localStorage.setItem('find_place_record', JSON.stringify(record_array));

//            console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))
//            event.preventDefault();
//            alert("Page")

        });

        $( "#find_property_preferences" ).submit(function( event ) {
            var find_weekly_budget = $("input[name=budget]").val()
            var find_move_date = $(".room-availability-datepicker").val()
            var find_preferred_length_stay = $("#find-preferred-stay").val()
//console.log('RRRRRR ::' ,$(".room-availability-datepicker").val())
            var record_array = JSON.parse(localStorage.getItem('find_place_record'));

            record_array[0]['find_weekly_budget'] = find_weekly_budget
            record_array[0]['find_move_date'] = find_move_date
            record_array[0]['find_preferred_length_stay'] = find_preferred_length_stay

            localStorage.setItem('find_place_record', JSON.stringify(record_array));

//            console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))
//
//            alert("Page")

        });

        $( "#find_introduce_yourself" ).submit(function( event ) {

            var find_room_furnishing = $("input[name=find-room_furnishing]:checked").val()
            var find_internet_type = $("input[name=find-internet_type]:checked").val()
            var find_bathroom_type = $("input[name=find-bathroom_type]:checked").val()
            var find_parking_type = $("input[name=find-parking_type]:checked").val()
            var find_no_of_flatmates = $("input[name=find-no-of-flatmates]:checked").val()

            var record_array = JSON.parse(localStorage.getItem('find_place_record'));

            record_array[0]['find_room_furnishing'] = find_room_furnishing
            record_array[0]['find_internet_type'] = find_internet_type
            record_array[0]['find_bathroom_type'] = find_bathroom_type
            record_array[0]['find_parking_type'] = find_parking_type
            record_array[0]['find_no_of_flatmates'] = find_no_of_flatmates

            //console.log(find_room_furnishing)
            //console.log(find_internet_type)
            //console.log(find_bathroom_type)
            //console.log(find_parking_type)
            //console.log(find_no_of_flatmates)
            //console.log(record_array)
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
//                        console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))
//
//            alert("Page")

        });

        $( "#introduce_flatmates" ).submit(function( event ) {
            var record_array = JSON.parse(localStorage.getItem('find_place_record'));
            //console.log(record_array)

            localStorage.setItem('find_place_record', JSON.stringify(record_array));

//                        console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))

//            alert("Page")

        });

//        $( document ).on('submit','#find_employment',function( event ) {
//            var record_array = JSON.parse(localStorage.getItem('find_place_record'));
////            console.log(record_array)
//
//            var find_pace_for = $("input[name=find-place-for]:checked").val()
//            console.log(find_pace_for)
//            data = {}
//
//            if (find_pace_for == "me")
//            {
//                data['place_for'] = find_pace_for
//                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
//                                      'age' : $("input[name=your_age_0]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
//                                    }]
//                console.log(data)
//            }
//
//            if (find_pace_for == "couple")
//            {
//                data['place_for'] = find_pace_for
//                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
//                                      'age' : $("input[name=your_age_0]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
//                                    }]
//                data['record'].push({ 'name' : $("input[name=find_first_name_1]").val(),
//                                      'age' : $("input[name=your_age_1]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_1]:checked").val()
//                                    })
//                //console.log(data)
//            }
//
//            if (find_pace_for == "group")
//            {
//                data['place_for'] = find_pace_for
//                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
//                                      'age' : $("input[name=your_age_0]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
//                                    }]
//                data['record'].push({ 'name' : $("input[name=find_first_name_2]").val(),
//                                      'age' : $("input[name=your_age_2]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_2]:checked").val()
//                                    })
//
//                var record=3;
//                $(".custom_me_group").each(function(index)
//                {
//                    data['record'].push({
//                                      'name' : $("input[name=find_first_name_2"+(index+1).toString()+"]").val(),
//                                      'age' : $("input[name=your_age_2"+(index+1).toString()+"]").val(),
//                                      'gender' : $("input[name=find-place-for-gender_2"+(index+1).toString()+"]:checked").val()
//                                    })
//                    record+=1
//                })
//                console.log(data)
//                console.log($(".custom_me_group"))
//            }
//            data['record'].push({'user_image':$("#user_image").val()})
//            record_array[0]['about_you'] = data
//            localStorage.setItem('find_place_record', JSON.stringify(record_array));
//            console.log('Local Storage by Sagar : ',localStorage.getItem('find_place_record'))
//
//
////            alert("Page")
//
//        });

        $( "#find_lifestyle" ).submit(function( event ) {
            var find_employment_status = []

            var record_array = JSON.parse(localStorage.getItem('find_place_record'));
            console.log(record_array)
            $("input[name=employment_status]:checked").each(function()
            {
            find_employment_status.push($(this).val())
            })


            record_array[0]['find_employment_status'] = find_employment_status
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
            //console.log('Employment status :: ',find_employment_status)
            //console.log('LOCAL STORAGE ',localStorage.getItem('find_place_record'))
//            event.preventDefault()

            //console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))

//            alert("Page")

        });

        $( "#find_about_yourself" ).submit(function( event ) {
            var find_lifestyle = []

            var record_array = JSON.parse(localStorage.getItem('find_place_record'));

            $("input[name=lifestyle]:checked").each(function()
            {
            find_lifestyle.push($(this).val())
            })

            record_array[0]['find_lifestyle'] = find_lifestyle
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
//                        console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))
//
//            alert("Page")

        });


        $( "#find_pubish" ).submit(function( event ) {
            var find_comment = $("#find_comment").val()
            //console.log (find_comment)
            var record_array = JSON.parse(localStorage.getItem('find_place_record'));

            record_array[0]['find_comment'] = find_comment
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
            console.log('List Place Array BY DON  : ',localStorage.getItem('find_place_record'))

            var find_place_data = JSON.parse(localStorage.getItem('find_place_record'));

//            alert("page")
            if (find_place_data){
                var is_id_exist = false
                $.ajax({
                        url:'/create/find_place',
                        type:'POST',
                        dataType: 'json',
                        async:false,
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'find_place_data': find_place_data}}),
                        success: function(data){
                                //console.log('Return %%%%%%%%% : ',data)
                                if(data['result']){
                                    is_id_exist = true
                                    //console.log('iiiiiiiffffffffiiiiiffff')
                                }

//                            var oldArray[0] = {}
                            localStorage.setItem('find_place_record', JSON.stringify({}))


	                    },

	                    if(is_id_exist){
	                        window.location.replace('/find/a/property');
	                    }
//	                    else
//	                    {
//	                        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$')
//	                        window.location.replace('/');
//	                    }
                });

		    }
//		                console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))


//		    event.preventDefault()
//event.preventDefault();

        });



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

            //console.log('List Place Array : ',localStorage.getItem('list_place_array'))
            //console.log('temp_dict : ',temp_dict);
            //console.log('accommodation_type : ',accommodation_type);
            //console.log('property_type :',property_type);
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

            //console.log('whole_property_property_type', whole_property_property_type)
            //console.log('LOCAL STORAGE :',localStorage.getItem('list_place_array'))

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
            var latitude = $("#latitude").val()
            var longitude = $("#longitude").val()
            var north = $("#north").val()
            var east = $("#east").val()
            var south = $("#south").val()
            var west = $("#west").val()
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
            if (latitude){
                oldArray[0]['latitude'] = latitude;
            }
            if (longitude){
                oldArray[0]['longitude'] = longitude;
            }
            if (north){
                oldArray[0]['north'] = north;
            }
            if (east){
                oldArray[0]['east'] = east;
            }
            if (south){
                oldArray[0]['south'] = south;
            }
            if (west){
                oldArray[0]['west'] = west;
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

            //console.log('property_address ',property_address);
            //console.log('--------------------------------------------')
            //console.log('Street : ',street_addrss)
            //console.log('Route : ',route)
            //console.log('City : ',city)
            //console.log('State : ',state)
            //console.log('zip code : ',zip_code)
            //console.log('Country : ',country)
            //console.log('Latitude : ',latitude)
            //console.log('Longitude : ',longitude)
            //console.log('----------------------------------------------')
            //console.log('total_bedrooms ', total_bedrooms);
            //console.log('total_bathrooms ',total_bathrooms );
            //console.log('parking ', parking);
            //console.log('internet ',internet);
            //console.log('room_furnishing_type ',room_furnishing_type)
            //console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))
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

            //console.log('total_no_of_flatmates ',total_no_of_flatmates );
            //console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))

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
                //console.log(attribute)
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

            //console.log(";;;;;;;;;;;;;;;;;;;;;;;",final_data)
            //console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))
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

            //console.log('weekly_rent :', weekly_rent);
            //console.log('bond :', bond);
            //console.log('bill :',bill);
            //console.log('LOCAL STORAGE : ',localStorage.getItem('list_place_array'))

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

            //console.log('avail_date :', avail_date);
            //console.log('min_length_of_stay :', min_length_of_stay);
            //console.log('max_length_of_stay :', max_length_of_stay);
            //console.log('LOCAL STORAGE 11 : ',localStorage.getItem('list_place_array'))


        });

        //form data of Property and room images Page
         $('#property_images_form_id').submit(function( event ) {
//            alert('ffffffffffffffffffffffffffffffffff')
            //console.log('hereeeeeeeeeeeeeeeeeeeeeeeeee');


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

            //console.log('flatmate_preference_type : ', flatmate_preference_type);
            //console.log('Is Female : ', is_female_only)
            //console.log('LOCAL STORAGE 33 : ',localStorage.getItem('list_place_array'))
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

            //console.log('Accepting :: ', accepting);
            //console.log('LOCAL STORAGE 44 : ',localStorage.getItem('list_place_array'))

        });


        //form data of Tell us about you and your flatmates Page

        $('#list_place_about_others_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var about_you_and_your_flatmates = $('#comment').val();

            if (about_you_and_your_flatmates){
                oldArray[0]['about_you_and_your_flatmates'] = about_you_and_your_flatmates
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));

            //console.log('COMMENT : ', about_you_and_your_flatmates)
            //console.log('LOCAL STORAGE 88 : ',localStorage.getItem('list_place_array'))
        });


        //form data of What's great about living at this property? Page

        $('#list_place_comment_abt_property_form_id').submit(function( event ) {

            var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
            var comment_about_property = $('#comment').val();

            if (comment_about_property){
                oldArray[0]['comment_about_property'] = comment_about_property
            }

            localStorage.setItem('list_place_array', JSON.stringify(oldArray));
//            console.log('comment_about_property : ', comment_about_property)
//            console.log('LOCAL STORAGE 99 : ',localStorage.getItem('list_place_array'))

            var list_place_data = JSON.parse(localStorage.getItem('list_place_array'));

            console.log('List Place Data 29 May :: ',list_place_data[0])
//            alert('ssssssssssssssssssss----Check---ssssssssssssssssssssssssssss')

            if (localStorage.getItem('list_place_array')){

                //console.log('\nListplace data :',list_place_data)
                $.ajax({
                        url:'/create/list_property',
                        type:'POST',
                        dataType: 'json',
                        async : false,
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'list_place_data': list_place_data}}),
                        success: function(data){
////                            console.log('---',data)
//                            console.log('YYYYYYYYYYYYYYYYYYYYYYYYYY---',data['result'])
//                            alert('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
//
//                            if(data['result']){
//                                console.log('New list id present !!!!!!!!!!!!!')
//                                alert('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
//                                window.open('www.google.com',"_blank");
////                                newWindow.location.href =
////                                window.location.replace('www.google.com')
//                            }
//                            else{
//                                console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ 4444444')
//                                window.location.replace('/')
//                            }

                            oldArray[0] = {}
                            localStorage.setItem('list_place_array', JSON.stringify(oldArray))
                            //console.log('returnnnnnnnnnnnnnnnnn',localStorage.getItem('list_place_array'))
	                    },
                });

		    }
//		    alert('ssssssssssssssssssssssssssssssssssssssssssssssss2222222222222')
        });


    });
});