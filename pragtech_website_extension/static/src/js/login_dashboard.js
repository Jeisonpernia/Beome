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
//                    async:false,
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                     beforeSend: function() {
                     $('.user_loader').show();
                     },
                    success: function(data)
                    {
                    $('.user_loader').hide();
                        var ul = $(".dashboard_blogs")
                        var blog_blog_id
                        var blog_blog_name
                        ul.empty()
//                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",ul.children())
                        console.log ("Dataalist_place_previewaaaaaaaaaaaaaaaaaaaaaa",data['result']['listings'])

                        text_truncate = function(str, length, ending) {
                            if (length == null) {
                              length = 100;
                            }
                            if (ending == null) {
                              ending = '...';
                            }
                            if (str.length > length) {
                              return str.substring(0, length - ending.length) + ending;
                            } else {
                              return str;
                            }
                        };

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

                            ul.append('<li class="blogs_on_dashboard"><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'/post/'+data['result']['blogs'][index]['name'].toLowerCase().replace(/ +/g, '-')+'-'+data['result']['blogs'][index]['id']+'">'+data['result']['blogs'][index]['name']+'</a></li>')
                        }
                        if (data['result']['blogs'].length != 0)
                            ul.append('<li class="blogs_on_dashboard"><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'">+ View all articles</a></li>')

                        if (data['result']['listings'].length != 0){
                        for (var index=0 ; index < data['result']['listings'].length; index++)
                        {

                               listing_id = data['result']['listings'][index]['id']
                            listing_address = data['result']['listings'][index]['address']
                            if (data['result']['listings'][index]['status'] == 'pending'){
                            if (data['result']['listings'][index]['type'] == 'list'){
                                if ($(window).width() <= 768 ){
                                    var address1 = text_truncate(data['result']['listings'][index]['address'],25,'...')
                                }
                                else{
                                    var address1 = text_truncate(data['result']['listings'][index]['address'],44,'...')
                                }

                                $('.user_listings').append('<div class="row find"><div class="col-lg-2 col-md-2 col-3 property_listing_status" style="background-color: #f7bb42;text-align: center;margin-bottom: 5px;"><span class="status-label-pending">Pending</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><div></div><a class="address-listing" href="#">'+address1+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span></span></a></li></div> </div>')
                            }

                           else if (data['result']['listings'][index]['type'] == 'find'){
                                if ($(window).width() <= 768 ){
                                    var address2 = text_truncate(data['result']['listings'][index]['suburb_data'],25,'...')
                                }
                                else{
                                    var address2 = text_truncate(data['result']['listings'][index]['suburb_data'],44,'...')
                                }

                                $('.user_listings_find').append('<div class="row find"><div class="col-lg-2 col-md-2 col-3 property_listing_status" style="background-color:#f7bb42;text-align: center;margin-bottom: 5px;"><span class="status-label-pending">Pending</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><a class="address-listing" href="#">'+address2+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span></span> </a></li></div> </div>')
                            }
                            }

                            else if (data['result']['listings'][index]['status'] == 'not_live'){
                            if (data['result']['listings'][index]['type'] == 'list'){
                                if ($(window).width() <= 768 ){
                                    var address3 = text_truncate(data['result']['listings'][index]['address'],25,'...')
                                }
                                else{
                                    var address3 = text_truncate(data['result']['listings'][index]['address'],44,'...')
                                }

                                $('.user_listings').append('<div class="row find"><div class="col-lg-2 col-md-2 col-3 property_listing_status" style="background-color: #808080;text-align: center;margin-bottom: 5px;"><span class="status-label-not_live">Not Live</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><div></div><a class="address-listing" href="#">'+address3+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span> </span></a></li></div> </div>')
                            }

                           else if (data['result']['listings'][index]['type'] == 'find'){
                                if ($(window).width() <= 768 ){
                                    var address4 = text_truncate(data['result']['listings'][index]['suburb_data'],25,'...')
                                }
                                else{
                                    var address4 = text_truncate(data['result']['listings'][index]['suburb_data'],44,'...')
                                }

                                 $('.user_listings_find').append('<div class="row find"><div class="col-lg-2  col-md-2 col-3 property_listing_status" style="background-color: #808080;text-align: center;margin-bottom: 5px;"><span class="status-label-not_live">Not Live</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><a class="address-listing" href="#">'+address4+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span></span> </a></li></div> </div>')
                            }
                            }

                            else if (data['result']['listings'][index]['status'] == 'live'){
                                if (data['result']['listings'][index]['type'] == 'list'){
                                    if ($(window).width() <= 768 ){
                                        console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                                        var address5 = text_truncate(data['result']['listings'][index]['address'],25,'...')
                                    }
                                    else{
                                        console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222')
                                        var address5 = text_truncate(data['result']['listings'][index]['address'],44,'...')
                                    }

                                    $('.user_listings').append('<div class="row find"><div class="col-lg-2 col-md-2 col-3 property_listing_status" style="background-color: #6495ed;text-align: center;margin-bottom: 5px;"><span class="status-label-live">Live</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="listing_li<%=listing_id%>" value='+listing_id+'><div></div><a class="address-listing" href="#">'+address5+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span></span></a></li></div></div>')
                                }
                                else if (data['result']['listings'][index]['type'] == 'find'){
                                    if ($(window).width() <= 768 ){
                                        var address6 = text_truncate(data['result']['listings'][index]['suburb_data'],25,'...')
                                    }
                                    else{
                                        var address6 = text_truncate(data['result']['listings'][index]['suburb_data'],44,'...')
                                    }

                                    $('.user_listings_find').append('<div class="row find"><div class="col-lg-2  col-md-2 col-3 property_listing_status" style="background-color: #6495ed;text-align: center;margin-bottom: 5px;"><span class="status-label-live">Live</span></div><div class="col-lg-10 col-md-10 col-9 property_listing"><li id="find_li<%=listing_id%>" value='+listing_id+'><div class="icons"><svg class="login" viewBox="0 0 26 26"><path class="fill"d="M19 6c0 3.9-2.7 8-6 8S7 9.9 7 6s2.7-6 6-6 6 2.1 6 6z"></path><path class="fill"d="M16 14.2v-2.7h-6v2.7c0 .6-.4 1.1-.9 1.2C5.2 16.6 2 19.2 2 20.7v1.8C2 24.4 6.9 26 13 26s11-1.6 11-3.5v-1.8c0-1.4-3.1-4.1-7.1-5.3-.5-.1-.9-.7-.9-1.2z"></path></svg></div><a class="address-listing" href="#">'+address6+'<span class="property_listing_edit"><span class="link-edit"><svg class="edit" width="16" height="15" viewBox="0 0 512 512"><path class="fill"d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path><ellipse class="fill" cx="12.431" cy=".75" rx=".738" ry=".75"></ellipse></svg><span class="remove-edit">Edit</span></span> </span></a></li></div> </div>')
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
//                    complete:function(){
//                    $('.user_loader').hide()
//                    }

                });
            });

         //added by sagar
//         $(document).on('click','#close-deregister-popup',function(){
//            console.log('9999999999999999999')
//             location.reload();
//         })

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
                                var sale_id = transaction_history['sale_id']

                                var markup = "<tr class='table-row'><td></td><td><b>" + plan + "</b></td><td>" +"$"+ amount + "</td><td>" + days + "</td><td>" + starts + "</td><td>" + ends + "</td><td>" + payment_date + "</td><td><a class='email-invoice' value=" + sale_id + " href='#'>Email Invoice</a></td></tr>";
//                                  var markup = "<tr class='table-row'><td></td><td><b>" + plan + "</b></td><td>" +"$"+ amount + "</td><td>" + days + "</td><td>" + starts + "</td><td>" + ends + "</td><td>" + payment_date + "</td><td><input type='button' class='email-invoice' id="+ sale_id + " value='Email Invoice'></input></td></tr>";
                                $("table tbody").append(markup);
                                console.log('transaction history : ',plan,amount)
                            }

                            $(".email-invoice").on('click', function(){
                                 console.log('Click Sale ID : ',$(this).attr('value'))
                                 var sale_order_id = $(this).attr('value')

                                 $.ajax({
                                        url: '/send_invoice_mail',
                                        type: "POST",
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'order_id':sale_order_id}}),
                                        success: function(data)
                                        {
                                            console.log('yessss hereeeeeeeeeeeeeee')
                                            $('#email_sent_popup').modal('toggle');
                                            location.reload();
//                                            $('#payment_history_popup').modal('hide');

                                        }
                                 });



                            })


                        }
                    }
            })

         })


         $(".upgrade_plan_class").on('click',function(){

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

                            var features = data['result']['features']
                            for (var i=0;i<features.length;i++){
                                var feature = features[i]
//                                console.log('Featuressssss : ',feature)
                                if (feature['send_message']){
                                    var send_msg = feature['send_message']
                                    console.log('send msg : ',send_msg)
                                    $(".plan-features").append('<li>'+ send_msg +'<span class="icon"><svg class="early-bird" viewBox="0 0 24 19"><path class="fill" d="M21.08.79c-.348-.838-3.95-2.19-5.138 3.204L9.66 8.774.264 14.487l.47.165 1.25-.37L0 15.47l.65.228 6.726-2.028s3.034.42 5.398.422l-.334.68c-.112.228.84 2.515 1.19 3.604l-1.778.275c-.212.033-.12.36.09.327l1.872-.29 1.873.29c.21.032.3-.294.088-.326l-1.794-.276-.08-.28-.32-1.096-.594-2.044-.004-.012c.072-.147 2.342-1.197 2.342-1.197h-.002c8.246-3.012 3.704-9.918 5.442-10.99C21.494 2.302 24 1.626 24 1.626c0-.77-2.92-.837-2.92-.837z"></path></svg></span><span class="bold-text">Early Bird</span><span class="info-tooltip"><svg class="info-icon"viewBox="0 0 50 50"><path class="fill" d="M25 0C11.215 0 0 11.215 0 25s11.215 25 25 25 25-11.215 25-25S38.785 0 25 0zm1.506 36.935c0 .215-.144.36-.36.36h-2.294c-.215 0-.358-.145-.358-.36V20.473c0-.215.144-.36.358-.36h2.295c.216 0 .36.145.36.36v16.462zm.072-21.053c0 .215-.145.36-.36.36H23.78c-.216 0-.357-.145-.357-.36v-2.618c0-.215.142-.36.357-.36h2.44c.214 0 .358.145.358.36v2.618z"></path></svg></span></li>')

                                }

                                if (feature['enquiries']){
                                    var enquiries = feature['enquiries']
                                    console.log('enquiries : ',enquiries)
                                    $(".plan-features").append('<li>'+ enquiries +'<span class="info-tooltip"><svg class="info-icon" viewBox="0 0 50 50"><path class="fill" d="M25 0C11.215 0 0 11.215 0 25s11.215 25 25 25 25-11.215 25-25S38.785 0 25 0zm1.506 36.935c0 .215-.144.36-.36.36h-2.294c-.215 0-.358-.145-.358-.36V20.473c0-.215.144-.36.358-.36h2.295c.216 0 .36.145.36.36v16.462zm.072-21.053c0 .215-.145.36-.36.36H23.78c-.216 0-.357-.145-.357-.36v-2.618c0-.215.142-.36.357-.36h2.44c.214 0 .358.145.358.36v2.618z"></path></svg></span></li>')
                                }

                                if (feature['mobile_number']){
                                    var access_mobile = feature['mobile_number']
                                    console.log('access_mobile : ',access_mobile)
                                    $(".plan-features").append('<li>'+ access_mobile +'**<span class="info-tooltip"><svg class="info-icon" viewBox="0 0 50 50"><path class="fill" d="M25 0C11.215 0 0 11.215 0 25s11.215 25 25 25 25-11.215 25-25S38.785 0 25 0zm1.506 36.935c0 .215-.144.36-.36.36h-2.294c-.215 0-.358-.145-.358-.36V20.473c0-.215.144-.36.358-.36h2.295c.216 0 .36.145.36.36v16.462zm.072-21.053c0 .215-.145.36-.36.36H23.78c-.216 0-.357-.145-.357-.36v-2.618c0-.215.142-.36.357-.36h2.44c.214 0 .358.145.358.36v2.618z"></path></svg></span></li>')
                                }

                                if (feature['social_media']){
                                    var social_media = feature['social_media']
                                    console.log('social_media : ',social_media)
                                    $(".plan-features").append('<li>'+ social_media +'**<span class="info-tooltip"><svg class="info-icon" viewBox="0 0 50 50"><path class="fill" d="M25 0C11.215 0 0 11.215 0 25s11.215 25 25 25 25-11.215 25-25S38.785 0 25 0zm1.506 36.935c0 .215-.144.36-.36.36h-2.294c-.215 0-.358-.145-.358-.36V20.473c0-.215.144-.36.358-.36h2.295c.216 0 .36.145.36.36v16.462zm.072-21.053c0 .215-.145.36-.36.36H23.78c-.216 0-.357-.145-.357-.36v-2.618c0-.215.142-.36.357-.36h2.44c.214 0 .358.145.358.36v2.618z"></path></svg></span></li>')
                                }

                            }
                        }
                    }
            })

         });


    });
});