odoo.define('pragtech_flatmates.edit_find_preview_page', function (require){


    $(document).ready(function(){

        $(document).on('click','#edit_general_info_id',function(){
            console.log(" !!!!!! General infooooo  !!!!!!!!")

            $("#edit_find_date").datepicker({
                minDate: 0
            });

            var current_finding_id = $("#current_listing_id").val()
            console.log("Current Finding id :",current_finding_id)

            $.ajax({
                    url: '/get_general_information_of_current_property',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        if(data['result']){
                            $("#edit_max_budget").val(data['result']['existing_weekly_budget'])
                            $("#edit_find_date").val(data['result']['exiting_move_date'])

                            max_stay_ids = data['result']['max_stay_ids']
                            for(var i=0;i<max_stay_ids.length;i++){
                                var max_stay_id = max_stay_ids[i]
                                $('#edit_max_stay_id').append('<option value='+max_stay_id[0]+'>'+max_stay_id[1]+'</option>')
                            }

                            $("#edit_max_stay_id").val(data['result']['existing_max_stay_id'])
                        }
                    }
            });
        });

        $("#update_general_info").on('click',function(){

            console.log('sssssssssssssssssssssssssssssssssss')
            var data = {}
            var current_finding_id = $("#current_listing_id").val()
            var update_max_budget = $("#edit_max_budget").val()
            var update_move_date = $("#edit_find_date").val()
            var update_max_stay_id = $("#edit_max_stay_id").val()

            data = {
                'current_finding_id':current_finding_id,
                'update_max_budget':update_max_budget,
                'update_move_date':update_move_date,
                'update_max_stay_id':update_max_stay_id,
            }
            console.log('dataaaaaaaaaaaa : ',data)
            $.ajax({
                    url: '/update_general_info',
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

        $("#edit_preferred_locations").on('click',function(){
            //get all suburbs and create its element to be added in div bu code
            var current_finding_id = $("#current_listing_id").val()

            $.ajax({
                    url: '/get_preferred_locations',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        if(data['result']){
                            var tags_container = $('#preferred_location').siblings().children().find('div')
                            for (var i=0; i<data['result'].length; i++){
                                var span = document.createElement("span");
                                span.className = "tag";
                                span.setAttribute('data-id',i);

                                span.innerHTML = data['result'][i]['subrub_name'] + ', ' + data['result'][i]['post_code']
                                tags_container.append(span);

                                var input = document.createElement("input");
                                input.className = "tag_input";
                                input.type = 'hidden'
                                input.setAttribute('data-lat',data['result'][i]['latitude'])
                                input.setAttribute('data-long',data['result'][i]['longitude']);
                                input.setAttribute('data-suburb_name',data['result'][i]['subrub_name']);
                                input.setAttribute('data-city',data['result'][i]['city']);
                                input.setAttribute('data-post_code',data['result'][i]['post_code']);

                                span.append(input);

                                var close_span = document.createElement("span");
                                close_span.className = "close";
                                span.append(close_span);

                            }
                        }
                    }
            })

         })

         $("#edit_find_about_me").on('click',function(){
            var current_finding_id = $("#current_listing_id").val()
            console.log('7&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7')
            console.log("Current Finding id :",current_finding_id)

            $('.not_include_contact_info').hide()

            $("#about_me_text_id").click(function(){
             console.log('dddddddddddddddddddddddddddddd')
            $('.not_include_contact_info').show()
            })
            $("#about_me_text_id").blur(function(){
            $('.not_include_contact_info').hide()
            })

            $.ajax({
                    url: '/get_about_me_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        if(data['result']['description_about_me']){
                            $(".description_about_me").html(data['result']['description_about_me'])
                            $("#about_me_text_id").html($(".description_about_me").text())
                        }
                    }
            })

         })



         $("#update_about_me").on('click',function(){

             var data = {}
             var current_finding_id = $("#current_listing_id").val()
             var update_about_me_data = $.trim($("#about_me_text_id").val())

             data = {
                'current_finding_id':current_finding_id,
                'update_about_me_data':update_about_me_data,
             }

             $.ajax({
                    url: '/update_find_about_me',
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

         $("#edit_property_pref_in_find").on('click',function(){
            var current_finding_id = $("#current_listing_id").val()
            console.log('!!!!!!!!!!!!!!!!111')
            console.log("Current Finding id :",current_finding_id)

             $.ajax({
                    url: '/get_property_pref_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        if(data['result']){

                            internets = data['result']['internet']
                            for(var i=0;i<internets.length;i++){
                                var internet = internets[i]
                                $('#edit_internet_in_find').append('<option value='+internet[0]+'>'+internet[1]+'</option>')
                            }

                            parkings = data['result']['parking']
                            for(var i=0;i<parkings.length;i++){
                                var parking = parkings[i]
                                $('#edit_parking_in_find').append('<option value='+parking[0]+'>'+parking[1]+'</option>')
                            }

                            bathroom_typs = data['result']['bathroom_typs']
                            for(var i=0;i<bathroom_typs.length;i++){
                                var bathroom_type = bathroom_typs[i]
                                $('#edit_bathroom_type_in_find').append('<option value='+bathroom_type[0]+'>'+bathroom_type[1]+'</option>')
                            }

                            room_furnishing_types = data['result']['room_furnishing_types']
                            for(var i=0;i<room_furnishing_types.length;i++){
                                var room_furnishing_type = room_furnishing_types[i]
                                $('#edit_room_furnishing_type_in_find').append('<option value='+room_furnishing_type[0]+'>'+room_furnishing_type[1]+'</option>')
                            }

                            total_flatmates = data['result']['total_flatmates']
                            for(var i=0;i<total_flatmates.length;i++){
                                var total_flatmate = total_flatmates[i]
                                $('#edit_total_flatmates_in_find').append('<option value='+total_flatmate[0]+'>'+total_flatmate[1]+'</option>')
                            }

                            $("#edit_internet_in_find").val(data['result']['existing_internet_id'])
                            $("#edit_parking_in_find").val(data['result']['existing_parking_id'])
                            $("#edit_bathroom_type_in_find").val(data['result']['existing_bath_room_type_id'])
                            $("#edit_room_furnishing_type_in_find").val(data['result']['existing_room_furnishing_id'])
                            $("#edit_total_flatmates_in_find").val(data['result']['existing_total_no_flatmates_id'])

                        }

                    }
             });

         });

         $("#update_property_pref").on('click',function(){
             console.log('hereeeeeeeeeeeeeeeeeeee')
             var data = {}
             var current_finding_id = $("#current_listing_id").val()
             var update_internet_id = $("#edit_internet_in_find").val()
             var update_parking_id = $("#edit_parking_in_find").val()
             var update_bathroom_type_id = $("#edit_bathroom_type_in_find").val()
             var update_room_furnishing_type_id = $("#edit_room_furnishing_type_in_find").val()
             var update_total_flatmate_id = $("#edit_total_flatmates_in_find").val()

             data = {
                'current_finding_id':current_finding_id,
                'update_internet_id':update_internet_id,
                'update_parking_id':update_parking_id,
                'update_bathroom_type_id':update_bathroom_type_id,
                'update_room_furnishing_type_id':update_room_furnishing_type_id,
                'update_total_flatmate_id':update_total_flatmate_id,
             }


             $.ajax({
                url: '/update_property_pref',
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



         $("#edit_life_style_id").on('click',function(){
            var current_finding_id = $("#current_listing_id").val()
            $.ajax({
                    url: '/get_life_stlye_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        for (var key in data['result']) {
                        	class_as=false
						    if (data['result'].hasOwnProperty(key)) {
						    	$(".icon-"+key).removeClass("fa-times")
						    	$(".icon-"+key).addClass("fa-check")
						    	$(".input-"+key).attr('checked','checked')

						    }
						}
                        children = document.querySelectorAll('.add-status-checked .fa-check');
                        for(var i = 0; i < children.length; i++){
                            children[i].parentElement.style.backgroundColor ='#11836c';
                        }

                        }

            });
         })

         $('#edit_preferred_accommodation').on('click',function(){
         var current_finding_id = $("#current_listing_id").val()
         console.log("\n\n-- current finding id",current_finding_id)
            $.ajax({
                    url: '/get_preferred_accommodation_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                    console.log("\n\n data-----",data['result'])
                        for (var key in data['result']) {
                        	class_as=false
						    if (data['result'].hasOwnProperty(key)) {
						    	$(".icon-"+key).removeClass("fa-times")
						    	$(".icon-"+key).addClass("fa-check")
						    	$(".input-"+key).attr('checked','checked')
						    }
						}
                        children = document.querySelectorAll('.add-pref-checked .fa-check');
                        for(var i = 0; i < children.length; i++){
                            children[i].parentElement.style.backgroundColor ='#11836c';
                        }

                        }

            });



         })


         $(".edit_employment_status_in_find").click(function(){
            console.log ('//////////////////////////////////')
            var active_state = $(this).find('i').hasClass("fa-check")
            console.log('Is Checked : ',active_state)
            if (active_state == true){
                console.log('trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                $(this).find("input[name='edit_employment_status']").attr("checked",false)
            }
            else{
                 console.log('falseeeeeeeeeeeeeeeeeeee')
                 $(this).find("input[name='edit_employment_status']").attr("checked","checked")
            }
         });


         $("#update_life_style").on('click',function(){
            console.log('444444444444444444')
            var life_style_data=[]
            var data = {}
            var current_finding_id = $("#current_listing_id").val()
             $.each($("input[name='edit_employment_status']:checked"), function(){
                life_style_data.push($(this).val());
            });
            console.log('@ Data : ',life_style_data)
            event.preventDefault()
            data = {
                'current_finding_id':current_finding_id,
                'life_style_data':life_style_data,
            }

            $.ajax({
                url: '/update_life_style_data',
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

         $(".edit_pref_accommodation").click(function(){
            console.log ('GGGGGGGGGGG')
            var active_state = $(this).find('i').hasClass("fa-check")
            console.log('Is Checked : ',active_state)
            if (active_state == true){
                console.log('trueeeee')
                $(this).find("input[name='edit_pref_accommodation_type']").attr("checked",false)
            }
            else{
                 console.log('falsee')
                 $(this).find("input[name='edit_pref_accommodation_type']").attr("checked","checked")
            }
         });

         $('#update_pref_accommodation_type').on('click',function(){
            console.log('llllllllllllllllllllll')
            var pref_accommodation_type = []
            var data = {}
            var current_finding_id = $("#current_listing_id").val()
             $.each($("input[name='edit_pref_accommodation_type']:checked"), function(){
                pref_accommodation_type.push($(this).val());
            });
            console.log('@ pref_accommodation_type : ',pref_accommodation_type)
            event.preventDefault()
            data = {
                'current_finding_id':current_finding_id,
                'pref_accommodation_type':pref_accommodation_type,
            }


            $.ajax({
                url: '/update_pref_accommodation_type',
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


        $("#edit_applicant_info").on('click',function(){
            console.log('---------------22 ------')
            var current_finding_id = $("#current_listing_id").val()

            $.ajax({
                    url: '/get_applicant_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){
                        if(data['result']){
                            if(data['result']['me']){
                                var person_name = data['result']['me'][0]
                                var person_gender = data['result']['me'][1]
                                var person_age = data['result']['me'][2]
                                console.log('Person ',person_name,person_gender,person_age)
                                $("#edit_first_name_1").val(person_name)
                                $("#edit_gender_1").val(person_gender)
                                $("#edit_age_1").val(person_age.toString())
                            }

                            if(data['result']['couple']){
                                var persons = data['result']['couple']
                                $("#edit_first_name_1").val(persons[0][0])
                                $("#edit_gender_1").val(persons[0][1])
                                $("#edit_age_1").val(persons[0][2].toString())

                                $("#edit_first_name_2").val(persons[1][0])
                                $("#edit_gender_2").val(persons[1][1])
                                $("#edit_age_2").val(persons[1][2].toString())

                                $("#person_accommodation_for_1").click()

                            }
                            if(data['result']['group']){
                                var persons = data['result']['group']
                                $("#edit_first_name_1").val(persons[0][0])
                                $("#edit_gender_1").val(persons[0][1])
                                $("#edit_age_1").val(persons[0][2].toString())

                                $("#edit_first_name_2").val(persons[1][0])
                                $("#edit_gender_2").val(persons[1][1])
                                $("#edit_age_2").val(persons[1][2].toString())


                                if (persons.length > 2)
                                {
                                    for (var i = 2; i <= persons.length - 1; i++){
                                        $("#add_other_person").click()
                                        var dynamic_id = document.getElementById("dynamic_id_generator").value;
                                        dynamic_id = dynamic_id -1
                                         $("#edit_first_name_" + dynamic_id.toString()).val(persons[i][0])
                                        $("#edit_gender_" + dynamic_id.toString()).val(persons[i][1])
                                        $("#edit_age_" + dynamic_id.toString()).val(persons[i][2].toString())

                                    }
                                }
                                $("#person_accommodation_for_2").click()


                            }

                        }
                    }
            });
        })
        $("#person_accommodation_for_0").on('click',function(){
                $(".for-couple-first_name").css('display','none')
                $(".for-couple-gender").css('display','none')
                $(".for-couple-age").css('display','none')
                $(".added_by_code").css('display','none')

        })

        $("#person_accommodation_for_1").on('click',function(){
            console.log('44444444')
                $(".for-couple-first_name").css('display','block')
                $(".for-couple-gender").css('display','block')
                $(".for-couple-age").css('display','block')
                $(".added_by_code").css('display','none')

        })

        $("#person_accommodation_for_2").on('click',function(){
                $(".for-couple-first_name").css('display','block')
                $(".for-couple-gender").css('display','block')
                $(".for-couple-age").css('display','block')
                $(".added_by_code").css('display','block')

        //            $(".add_more_applicant").append("<div class='col-lg-4'><div class='form-group'><label class='p14'>First name</label><input type='text' class='form-control' id='' name=''/></div></div><div class='col-lg-4'><div class='form-group'><label class='p14'>Gender</label><select class='form-control' id='' name=''><option>Please select</option><option>Female</option><option>Male</option></select></div></div><div class='col-lg-4'><div class='form-group'><label class='p14'>Age</label><select class='custom-select' id='' name=''><option>25</option></select></div></div>")

        })
        $("#add_other_person").on('click',function(){
            var add_more_applicant = document.getElementsByClassName("add_more_applicant");
            var dynamic_id = document.getElementById("dynamic_id_generator").value;
            //First Name
            var main_div = document.createElement("div");
            main_div.className = "col-lg-4 added_by_code";
            add_more_applicant[0].append(main_div)
            var div = document.createElement("div");
            div.className = "form-group";
            main_div.append(div);
            var label = document.createElement("label");
            label.className = "p14"
            label.innerHTML = 'First name'
            div.append(label);
            var input = document.createElement("input");
            input.type = 'text'
            input.className = 'form-control'
            input.id = 'edit_first_name_' + dynamic_id.toString()
            div.append(input)

            //Gender
            var main_div = document.createElement("div");
            main_div.className = "col-lg-4 added_by_code";
            add_more_applicant[0].append(main_div)
            var div = document.createElement("div");
            div.className = "form-group";
            main_div.append(div);
            var label = document.createElement("label");
            label.className = "p14"
            label.innerHTML = 'Gender'
            div.append(label);
            var select = document.createElement("select");
            select.className = 'form-control manual_added_gender'
            select.id = 'edit_gender_' + dynamic_id.toString()
            var option1 = document.createElement("option");
            option1.selected = 'selected'
            option1.innerHTML = 'Please select'
            $(option1)[0].disabled = true


            var option2 = document.createElement("option");
            option2.value = 'female'
            option2.innerHTML = 'Female'

            var option3 = document.createElement("option");
            option3.value = 'male'
            option3.innerHTML = 'male'

            select.append(option1)
            select.append(option2)
            select.append(option3)
            div.append(select)

            //age
            var main_div = document.createElement("div");
            main_div.className = "col-lg-4 added_by_code";
            add_more_applicant[0].append(main_div)
            var div = document.createElement("div");
            div.className = "form-group";
            main_div.append(div);
            var label = document.createElement("label");
            label.className = "p14"
            label.innerHTML = 'Age'
            div.append(label);
            var input = document.createElement("input");
            input.type = 'number'
            input.className = 'form-control weekly-rent-input'
            input.id = 'edit_age_' + dynamic_id.toLocaleString()
            div.append(input)

            document.getElementById("dynamic_id_generator").value = parseInt(dynamic_id) + 1





        })

        $("#update_applicant_info").on('click',function(){
            console.log('333333333333333')
            var data = {}
            var current_finding_id = $("#current_listing_id").val()
            data = {
                'current_finding_id':current_finding_id
            }

            if($('#person_accommodation_for_0').is(':checked')){
                console.log('meeeeeeeeeeeeeeeeeeeeeeee')
                 var person_name = $("#edit_first_name_1").val()
                 var person_gender = $("#edit_gender_1").val()
                 var person_age = $("#edit_age_1").val()

                 data ['place_for'] = "me"
                 data['person_name'] = person_name
                 data['person_gender'] = person_gender
                 data['person_age'] = person_age
            }

            if($('#person_accommodation_for_1').is(':checked')){
                console.log('coupleeeeeeeeeeeeeeeeeeeee')
                data ['place_for'] = "couple"
                 var person1_name = $("#edit_first_name_1").val()
                 var person1_gender = $("#edit_gender_1").val()
                 var person1_age = $("#edit_age_1").val()

                 var person2_name = $("#edit_first_name_2").val()
                 var person2_gender = $("#edit_gender_2").val()
                 var person2_age = $("#edit_age_2").val()
                 data['person1_name'] = person1_name
                 data['person1_gender'] = person1_gender
                 data['person1_age'] = person1_age
                 data['person2_name'] = person2_name
                 data['person2_gender'] = person2_gender
                 data['person2_age'] = person2_age

            }

            if($('#person_accommodation_for_2').is(':checked')){
                console.log('Groupppppppppppppppppp')
                data ['place_for'] = "group"
                 var person1_name = $("#edit_first_name_1").val()
                 var person1_gender = $("#edit_gender_1").val()
                 var person1_age = $("#edit_age_1").val()
                 data[1] = {'name': person1_name, 'gender': person1_gender, 'age': person1_age}
                 var person2_name = $("#edit_first_name_2").val()
                 var person2_gender = $("#edit_gender_2").val()
                 var person2_age = $("#edit_age_2").val()
                data[2] = {'name': person2_name, 'gender': person2_gender, 'age': person2_age}
                var count = $("#dynamic_id_generator").val()
                for (var i = 3; i < count; i++){
                    var person_name = $("#edit_first_name_" + i.toString()).val()
                     var person_gender = $("#edit_gender_" +  i.toString()).val()
                     var person_age = $("#edit_age_" + i.toString()).val()
                    data[i] = {'name': person_name, 'gender': person_gender, 'age': person_age}

                }


            }
            console.log('data >> ',data)

            $.ajax({
                    url: '/update_applicant_info',
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



        $("#update_suburb_id").on('click',function(){
            console.log('okkkkkkkkkkkkkkkkkkkkkkkkkkkk')
//            var update_suburbs = $("input[id=suburbs]").map(function(){return $(this).val();}).get();
//            console.log('Suburbs : ',suburbs)
            var tagContainer = $('.tags_container')
            var tags = tagContainer.find('.tag')
            var suburb_array=[]
            if(tags.length != 0){
                $.each(tags,function(event){

                suburb_name = $(this).find("input").data("suburb_name");
                latitude = $(this).find("input").data("lat");
                longitude = $(this).find("input").data("long");
                city = $(this).find("input").data("city");
                post_code = $(this).find("input").data("post_code");

                var temp_dict = {
                    'suburb_name':suburb_name,
                    'latitude':latitude,
                    'longitude':longitude,
                    'city':city,
                    'post_code':post_code
                }
                suburb_array.push(temp_dict)

                });
            }

            console.log("Suburb data::: ",suburb_array)

            var current_finding_id = $("#current_listing_id").val()

            data = {
                'current_finding_id':current_finding_id,
                'update_suburbs':suburb_array
            }

            $.ajax({
                    url: '/update_suburbs',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                    success: function(data){

                    }
            });
            location.reload()

        });

        $(".close_applicant_information_popup").on('click',function(){
         location.reload();

        })
        $(".close_general_information_popup_id").on('click',function(){
         location.reload();

        })
        $(".close_aboutme_popup").on('click',function(){
         location.reload();

        })

        $(".close_aboutme_features_popup").on('click',function(){
         location.reload();

        })

        $(".close_property_preferences_popup").on('click',function(){
         location.reload();

        })
        $(".close_preferred_accommodation_popup").on('click',function(){
         location.reload();

        })

        $("#applicant_information_popup").on("hidden.bs.modal", function () {
                      location.reload();
        });

        $("#general_information_popup_id").on("hidden.bs.modal", function () {
        console.log("---** in **---")
                      location.reload();
        });

        $("#aboutme_popup").on("hidden.bs.modal", function () {
                      location.reload();
        });

        $("#aboutme_features_popup").on("hidden.bs.modal", function () {
                      location.reload();
        });

        $("#property_preferences_popup").on("hidden.bs.modal", function () {
                      location.reload();
        });

        $("#preferred_accommodation_popup").on("hidden.bs.modal", function () {
                      location.reload();
        });


    $(".find_preview_listings").on("click", function () {
         var path=window.location.pathname
         var property_id=path.split('find_place_preview').pop()
         var a = "P"+property_id
         window.open('/'+a)
    });

    $(".open-detail-of-match-for-find").on('click',function(e){
        console.log('333333333333333333333',$(this).find(".match_id").val())
//            var id = e.target.attributes.value2.value
        var id = $(this).find(".match_id").val()
        window.open("P"+id)

    })


    $(".edit_find_deactivate_listing_button").on("click", function () {
         var path=window.location.pathname
         var property_id=path.split('find_place_preview').pop()
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

    $(".edit_find_activate_listing_button").on("click", function () {
         var path=window.location.pathname
         var property_id=path.split('find_place_preview').pop()
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
    $(".edit_find_delete_listing_button").on("click", function () {
         var path=window.location.pathname
         var property_id=path.split('find_place_preview').pop()
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

    $(".edit_employment_status_in_find").on('click',function(){
        console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this))
        if($(this).find('i').hasClass('fa-times') == false){
            console.log('ifffffffffffffffffffffffffffffffff find')
            $(this).find(".add-status-checked").css('background-color','#e4e5e6')
        }
        else{
            console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee find')
            $(this).find(".add-status-checked").css('background-color','#11836c')
        }
    })

     $(".edit_pref_accommodation").on('click',function(){
        console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this))
        if($(this).find('i').hasClass('fa-times') == false){
            console.log('ifffffffffffffffffffffffffffffffff find')
            $(this).find(".add-pref-checked").css('background-color','#e4e5e6')
        }
        else{
            console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee find')
            $(this).find(".add-pref-checked").css('background-color','#11836c')
        }
    })



    //Diable previous dates in Move Date
    $("#edit_find_date").datepicker({
                minDate: 0
    });

    //Show warning when max budget is > 10000
    var $max_budget = $("#edit_max_budget");
     $max_budget.on('keyup', function () {


         if ($max_budget.val() > 10000) {
             $('.styles__errorMessage3').show();
         } else {
             $('.styles__errorMessage3').hide();
         }
     });

    //Show warning when about me text is not as expected
     $("#about_me_text_id").on('keyup', function () {

        if ( $("#about_me_text_id").val().length == 0 )
            {
                $('.styles__errorMessage_find_comment').hide();
                $('#update_about_me').prop("disabled", true);
            }

        else if ( $("#about_me_text_id").val().length <= 9 )
            {
                $('.styles__errorMessage_find_comment').show();
                $('#update_about_me').prop("disabled", true);

            }
        else
           {
                $('.styles__errorMessage_find_comment').hide();
                $('#update_about_me').prop("disabled", false)
           }
     });










    });//documnet.ready
});//main
