odoo.define('pragtech_flatmates.edit_preview_page', function (require){


    $(document).ready(function(){

        $(".edit_about_the_room").on('click',function(){
            console.log(" !!!!!! Edit About the Room call !!!!!!!!")

            var current_property_id = $("#current_listing_id").val()
            console.log("Current Listing id :",current_property_id)

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

                        bill_ids = data['result']['bill_ids']
                        for(var i=0;i<bill_ids.length;i++){
                            var bill_id = bill_ids[i]
                            console.log('Bill id :',bill_id)
                            $('#edit_bills_id').append('<option value='+bill_id[0]+'>'+bill_id[1]+'</option>')
                        }

                        bond_ids = data['result']['bond_ids']
                        for(var i=0;i<bond_ids.length;i++){
                            var bond_id = bond_ids[i]
                            console.log('bond_id :',bond_id)
                            $('#edit_bond_id').append('<option value='+bond_id[0]+'>'+bond_id[1]+'</option>')
                        }

                        room_furnishing_ids = data['result']['room_furnishing_ids']
                        for(var i=0;i<room_furnishing_ids.length;i++){
                            var room_furnishing_id = room_furnishing_ids[i]
                            console.log('room_furnishing_id :',room_furnishing_id)
                            $('#edit_room_furnishing_id').append('<option value='+room_furnishing_id[0]+'>'+room_furnishing_id[1]+'</option>')
                        }

                        min_stay_ids = data['result']['min_stay_ids']
                        for(var i=0;i<min_stay_ids.length;i++){
                            var min_stay_id = min_stay_ids[i]
                            console.log('min_stay_id :',min_stay_id)
                            $('#edit_min_stay_id').append('<option value='+min_stay_id[0]+'>'+min_stay_id[1]+'</option>')
                        }

                        max_stay_ids = data['result']['max_stay_ids']
                        for(var i=0;i<max_stay_ids.length;i++){
                            var max_stay_id = max_stay_ids[i]
                            console.log('max_stay_id :',max_stay_id)
                            $('#edit_max_stay_id').append('<option value='+max_stay_id[0]+'>'+max_stay_id[1]+'</option>')
                        }

                        $('#edit_bills_id').val(data['result']['existing_bill_id']);
                        $('#edit_bond_id').val(data['result']['existing_bond_id']);
                        $('#edit_room_furnishing_id').val(data['result']['existing_room_furnishing_id'])
                        $('#edit_min_stay_id').val(data['result']['existing_min_stay_id'])
                        $('#edit_max_stay_id').val(data['result']['existing_max_stay_id'])



                    }
                });

        })



    })//document.ready
})//main