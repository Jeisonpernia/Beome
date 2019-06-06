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
         });






    });//documnet.ready
});//main
