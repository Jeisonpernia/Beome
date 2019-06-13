odoo.define('pragtech_flatmates.edit_find_preview_page', function (require){


    $(document).ready(function(){

        $(document).on('click','#edit_general_info_id',function(){
            console.log(" !!!!!! General infooooo  !!!!!!!!")

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

         $("#edit_find_about_me").on('click',function(){
            var current_finding_id = $("#current_listing_id").val()
            console.log('7&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7')
            console.log("Current Finding id :",current_finding_id)

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
            console.log('88888888888888')
            var current_finding_id = $("#current_listing_id").val()

            $.ajax({
                    url: '/get_life_stlye_data',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'current_finding_id':current_finding_id}}),
                    success: function(data){

//                        console.log(data['result'])
//                        if(data['result']){
//                            if(data['result']['student']=true){
//                                if ($(".edit_employment_status_in_find").find("input[name='edit_employment_status']").val() == "student"){
//                                    console.log('yesssss')
//                                }
//                            }


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
                        }
                    }
            });
        })

        $("#person_accommodation_for_0").on('click',function(){
                $(".for-couple-first_name").css('display','none')
                $(".for-couple-gender").css('display','none')
                $(".for-couple-age").css('display','none')
        })

        $("#person_accommodation_for_1").on('click',function(){
            console.log('44444444')
                $(".for-couple-first_name").css('display','block')
                $(".for-couple-gender").css('display','block')
                $(".for-couple-age").css('display','block')

        })

        $("#person_accommodation_for_2").on('click',function(){
                $(".for-couple-first_name").css('display','block')
                $(".for-couple-gender").css('display','block')
                $(".for-couple-age").css('display','block')

        //            $(".add_more_applicant").append("<div class='col-lg-4'><div class='form-group'><label class='p14'>First name</label><input type='text' class='form-control' id='' name=''/></div></div><div class='col-lg-4'><div class='form-group'><label class='p14'>Gender</label><select class='form-control' id='' name=''><option>Please select</option><option>Female</option><option>Male</option></select></div></div><div class='col-lg-4'><div class='form-group'><label class='p14'>Age</label><select class='custom-select' id='' name=''><option>25</option></select></div></div>")

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
















    });//documnet.ready
});//main
