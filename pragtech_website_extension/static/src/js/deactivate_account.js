odoo.define('pragtech_website_extension.deactivate_account', function (require)
    {
        $(document).ready(function()
        {
            //fill country on click of show mobile number, if verify dialog pop up
            $(".verify-mobile-no").val("")
            $(".invalid_mobile_no").css('display','none')

            $.ajax({
                            url: '/country',
                            type: "POST",
                            dataType: 'json',
                            contentType: 'application/json',
                            data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                            success: function(data)
                            {
                                countries = data['result']['country']
                                for(var i=0;i<countries.length;i++)
                                {
                                    var country = countries[i]
                                   // console.log('country111111111111111111 :',$('#country'))
                                    $('#country').append('<option value='+country[0]+'>'+country[1]+'</option>')
                                }
                            }
                        })


            $("#deactivate_account").on('click',function()
            {

            $.ajax({
                    url: '/deactivate_account',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                        'deactivate_account':true,
                    }}),
                    success: function(data)
                    {
                        window.location.replace('/')

                    }

                    })
            })

            $("#deactivate_account_popup_href_id").on('click',function()
                        {
                        $.ajax({
                                url: '/account_active_status',
                                type: "POST",
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                                    'account_active_status':true,
                                }}),
                                success: function(data)
                                {
                                    if (data['result']['status'] == true)
                                    {
                                        $("#deactivate_account").css('display','none')
                                        $("#activate_account").css('display','block')

                                    }
                                    else
                                    {
                                        $("#activate_account").css('display','none')
                                        $("#deactivate_account").css('display','block')
                                    }
                                }

                                })
            })

             $("#activate_account").on('click',function()
                        {

                        $.ajax({
                                url: '/deactivate_account',
                                type: "POST",
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                                    'activate_account':true,
                                }}),
                                success: function(data)
                                {
                                    window.location.replace('/')


                                }
                                })
                        })

            $("#account_settings").on('click',function()
            {
            var name = $("#name").val()
            var email = $("#email").val()
            var mobile = $('#mobile').val()
            var image = $(".profile-pic").attr('src')
            var is_allowed_to_contact = false

            if($("input[name=allowed-contact-in-edit]").attr('checked') == 'checked'){
                        console.log('yesss checkedddddddd')
                        is_allowed_to_contact = true
            }
//            console.log('Imageeeeee ::: ',image)
//            alert('gfrgght')

            $.ajax({
                    url: '/account_settings',
                    type: "POST",
                    dataType: 'json',
                    async:false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                    'name':name,
                    'email':email,
                    'mobile':mobile,
                    'image':image,
                    'is_allowed_to_contact':is_allowed_to_contact,
                    }}),
                    success: function(data)
                    {

                               }

                                })
                                location.reload();
            })
            //Show mobile dialog details on show mobile nummber click
            $("#show_mobile").on('click',function()
            {
                var property = $('#property_id').val()
                $.ajax({
                            url: '/get_property_owner_number',
                            type: "POST",
                            dataType: 'json',
                            contentType: 'application/json',
                            data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                                'property_id': property
                                }}),
                            success: function(data)
                            {
                                if (data){
                                    if (data['result']['phone']){
                                        $("#property_owner_mobile").text(data['result']['phone'])
                                    }
                                    else{
                                        $("#property_owner_mobile").text(data['result']['name'] + " has no mobile number!")
                                    }

                                    $("#show_mobile_heading").text(data['result']['name'] + "'s Mobile Number")


                                }
                            }
                        })
            })
            //fill country on click of show mobile number, if verify dialog pop up
//             $("#country_fill").on('click',function()
//             {
//                 $(".verify-mobile-no").val("")
//                 $(".invalid_mobile_no").css('display','none')
//
//                 $.ajax({
//                             url: '/country',
//                             type: "POST",
//                             dataType: 'json',
//                             contentType: 'application/json',
//                             data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
//                             success: function(data)
//                             {
//                                 countries = data['result']['country']
//                                 for(var i=0;i<countries.length;i++)
//                                 {
//                                     var country = countries[i]
// //                                    console.log('country :',country)
//                                     $('#country').append('<option value='+country[0]+'>'+country[1]+'</option>')
//                                 }
//                             }
//                         })
//             })
            $(".select_country").on('click',function()
            {
                $(".verify-mobile-no").val("")
                $(".invalid_mobile_no").css('display','none')

                $.ajax({
                            url: '/country',
                            type: "POST",
                            dataType: 'json',
                            contentType: 'application/json',
                            data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                            success: function(data)
                            {
                                countries = data['result']['country']
                                for(var i=0;i<countries.length;i++)
                                {
                                    var country = countries[i]
//                                    console.log('country :',country)
                                    $('#country').append('<option value='+country[0]+'>'+country[1]+'</option>')
                                }
                            }
                        })
            })
            $(".verify-phone").on('click',function()
            {
                $.ajax({
                            url: '/country',
                            type: "POST",
                            dataType: 'json',
                            contentType: 'application/json',
                            data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                            success: function(data)
                            {
                                console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
                                countries = data['result']['country']
                                for(var i=0;i<countries.length;i++)
                                {
                                    var country = countries[i]
//                                    console.log('country :',country)
                                    $('#country').append('<option value='+country[0]+'>'+country[1]+'</option>')
                                }

                                console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR ',$(".default_user_mobile").val())
                                if($(".default_user_mobile").val()){
                                    var mobile_no = $(".default_user_mobile").val()
                                    $(".verify-mobile-no").val(mobile_no)
                                }
                            }
                        })
            })

            $("#delete_account").on('click',function()
            {
                $.ajax({
                            url: '/delete_account',
                            type: "POST",
                            dataType: 'json',
                            contentType: 'application/json',
                            data:JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                            success: function(data)
                            {
                                window.location.replace('/')
                            }
                        })
            })

            $(".close_payment_history_popup").on('click',function(){
            location.reload();
            })

            $("#payment_history_popup").on("hidden.bs.modal", function () {
              location.reload();
            });


            $(".close_signup_popup_id").on('click',function(){
            location.reload();
            })

            $("#signup_popup_id").on("hidden.bs.modal", function () {
              location.reload();
            });

            $("#close_upgrade_popup").on("click", function () {
              location.reload();
            });

            $("#why_upgrade_popup").on("hidden.bs.modal", function () {
              location.reload();
            });









})
    })