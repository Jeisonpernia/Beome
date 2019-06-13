odoo.define('pragtech_website_extension.login_dashboard', function (require)
    {
        $(document).ready(function()
        {
            $("#dashboard_user").on('click',function()
            {
//                console.log ("In jsssssssssss")
                $.ajax({
                    url: '/blogs_for_login',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        var ul = $(".dashboard_blogs")
                        var blog_blog_id
                        var blog_blog_name
                        ul.empty()
//                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",ul.children())
                        console.log ("Dataalist_place_previewaaaaaaaaaaaaaaaaaaaaaa",data['result']['listings'])


                        if (data['result']['user_profile_pic']){
                             var user_profile_pic = data['result']['user_profile_pic']
                            $(".dashbord-profile-img").attr("src", "data:image/png;base64," + user_profile_pic);
                        }

                        if (data['result']['is_mobile_verified'] == true){
                            $(".verify-mobile-on-dashboard").css('display','none')
                                $("#account_verification").css('display','block')
//                            $("#bell-icon").css("fill","#fff");
                        }


                        for (index=0 ; index < data['result']['blogs'].length; index++)
                        {
//                            console.log(data['result']['blogs'][index]['id'])
//                            console.log(data['result']['blogs'][index]['name'])
                            blog_blog_id = data['result']['blogs'][index]['blog_id'][0]
                            blog_blog_name = data['result']['blogs'][index]['blog_id'][1].toLowerCase().replace(/ +/g, '-')

                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'/post/'+data['result']['blogs'][index]['name'].toLowerCase().replace(/ +/g, '-')+'-'+data['result']['blogs'][index]['id']+'">'+data['result']['blogs'][index]['name']+'</a></li>')
                        }
                        if (data['result']['blogs'].length != 0)
                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'">+ View all articles</a></li>')

                        if (data['result']['listings'].length != 0){
                        for (var index=0 ; index < data['result']['listings'].length; index++)
                        {
                               listing_id = data['result']['listings'][index]['id']
                            listing_address = data['result']['listings'][index]['address']
                            if (data['result']['listings'][index]['status'] == 'pending'){
                            if (data['result']['listings'][index]['type'] == 'list'){
                            $('.user_listings').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-pending">Pending</span></div><div class="col-lg-7 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['address']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }

                           else if (data['result']['listings'][index]['type'] == 'find'){
                            $('.user_listings_find').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-pending">Pending</span></div><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><div class="col-lg-7 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['suburb_data']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }
                            }

                            else if (data['result']['listings'][index]['status'] == 'not_live'){
                            if (data['result']['listings'][index]['type'] == 'list'){
                            $('.user_listings').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-not_live">Not Live</span></div><div class="col-lg-7 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['address']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }

                           else if (data['result']['listings'][index]['type'] == 'find'){
                            $('.user_listings_find').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-not_live">Not Live</span></div><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><div class="col-lg-7 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['suburb_data']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }
                            }

                            else if (data['result']['listings'][index]['status'] == 'live'){
                            if (data['result']['listings'][index]['type'] == 'list'){
                            $('.user_listings').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-live">Live</span></div><div class="col-lg-7 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['address']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }

                           else if (data['result']['listings'][index]['type'] == 'find'){
                            $('.user_listings_find').append('<div class="row find"><div class="col-lg-2 property_listing_status"><span class="status-label-live">Live</span></div><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><div class="col-lg-7 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><a href="#">'+data['result']['listings'][index]['suburb_data']+'</div><div class="col-lg-2 property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span>Edit</span></span> </a></li></div> </div>')
                            }
                            }



                         }
                         $('.user_listings_div').css('display','block')
                         $('.no_user_listings_div').css('display','none')
                        }


                        else{
                        $(".user_listings").find('li').remove();

                        $('.user_listings_div').css('display','none')
                         $('.no_user_listings_div').css('display','block')
                        }


                         $('li[id^="listing_li"]').on('click', function() {

                            var window_pathname = window.location.pathname
                            var property_id=this.value
                            var a = "list_place_preview"+property_id
                            window.location.replace('/'+a)


                         });

                        $('li[id^="find_li"]').on('click', function() {

                            var window_pathname = window.location.pathname
                            var property_id=this.value
                            var a = "find_place_preview"+property_id
                            window.location.replace('/'+a)
//                            window.open('/'+a)


                         });




                    },
                });
            });

         //added by sagar
         $(document).on('click','#close-deregister-popup',function(){
            console.log('9999999999999999999')
             location.reload();
         })

         $(document).on('click','#close_verify_otp_popup',function(){
             console.log('55555555555555555555')
             location.reload();
         })

         $('#payment_history_id').on('click',function(){
            console.log('eeeeeeeeeeeeeeeeeee')
            $.ajax({
                    url: '/get_history',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        console.log('data :: > ',data['result']['transaction_history'])
                        if(data['result']['transaction_history']){

                            var transaction_histories = data['result']['transaction_history']
                            for(var i=0;i<transaction_histories.length;i++){
                                var transaction_history = transaction_histories[i]
                                var plan = transaction_history['plan']
                                var amount = transaction_history['amount']
                                var days = transaction_history['days']
                                var starts = transaction_history['start_date']
                                var ends = transaction_history['end_date']
                                var payment_date = transaction_history['payment_date']

                                var markup = "<tr><td></td><td><b>" + plan + "</b></td><td>" +"$"+ amount + "</td><td>" + days + "</td><td>" + starts + "</td><td>" + ends + "</td><td>" + payment_date + "</td></tr>";

                                $("table tbody").append(markup);

                                console.log('transaction history : ',plan,amount)
//                                $('#edit_max_stay_id').append('<option value='+max_stay_id[0]+'>'+max_stay_id[1]+'</option>')
                            }


                        }
                    }
            })

         })

         $("#upgrade_plan_id").on('click',function(){

            $.ajax({
                    url: '/get_product_plan',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        if(data['result']){
                            console.log('Result :: ',data['result'])
                            var plan = data['result']['name']
                            var amount = data['result']['amount']
                            amount = "$"+amount
                            var no_of_days = data['result']['no_of_days']

                            $(".plan-name").text(plan)
                            $(".plan-amount").text(amount)
                            $(".plan-days").text(no_of_days)
                        }
                    }
            })

         });



    });
});