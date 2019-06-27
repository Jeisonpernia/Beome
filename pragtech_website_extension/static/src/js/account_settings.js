odoo.define('pragtech_website_extension.account_settings', function (require){

    $(document).ready(function(){

    $(document).on('click','#dashboard_user, #account_settings_popup_id',function(){
        console.log('Don...............Don...........Don')
                $.ajax({
                    url: '/get_users_default_data',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        console.log('Return user data :::::::::: ',data)
                        var user_name = data['result']['user_name']
                        var user_email = data['result']['user_email']
//                        console.log('User name and email :::: ',user_name,user_email)
                        $(".default_user_name").siblings().addClass('focused')
                        $(".default_user_name").val(user_name);
                        $(".default_user_email").siblings().addClass('focused')
                        $(".default_user_email").val(user_email);

                        if (data['result']['user_mobile']){
                            var user_mobile = data['result']['user_mobile']
                            $(".default_user_mobile").val(user_mobile);
                            $(".add-focused").addClass("focused")

                            if(data['result']['is_mobile_verified'] == true){
                                $(".verify-phone").css('display','none')
                                $(".already-verified").css('display','block')
                            }

                            if(data['result']['is_allowed_to_contact'] == true){
                                console.log('7777777777777777777777777777777777777777777777')
                                $(".allowed-to-contact-in-edit-account").find("i").removeClass("fa-times")
                                $(".allowed-to-contact-in-edit-account").find("i").addClass("fa-check")
                                $(".add-green-in-edit").css('background-color','#11836c')
                                $("#allowed-contact-in-edit").attr('checked','checked')
                            }

                        }


                        if (data['result']['user_image']){
                            var user_image = data['result']['user_image']
//                            console.log('Imageeeeeeeeeeeeeeeeeeeeeeeeee :',user_image)
                            $(".profile-pic").attr("src", "data:image/png;base64," + user_image);
                            $(".profile-pic-2").attr("src", "data:image/png;base64," + user_image);

//                            $(".profile-pic").val(user_image);
                        }
                    }

        })

    })


        $(document).on('change','.image_account_settings', function(){
        console.log ("aaaaaaaaaa eeeeeeeee tttttttttt 111111111111")
            readURL_account(this);
        });

        function readURL_account(input) {
        console.log ("ffffffffffffff")
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('.profile-pic').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

        $(".dashboard_profile_image").on('change', function(){
        console.log ("aaaaaaaaaa eeeeeeeee tttttttttt")
            readURL_dashboard(this);
        });

        function readURL_dashboard(input) {
            if (input.files && input.files[0])
            {
                var reader = new FileReader();

                reader.onload = function (e)
                {
                    $('.profile-pic-2').attr('src', e.target.result);
                    $.ajax({
                    url: '/account_settings',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                    'image':e.target.result,
                    }}),
                    success: function(data)
                    {}
                    })

                }
                reader.readAsDataURL(input.files[0]);
            }
        }


    $(".deregister_mobile_no").on('click',function(){
        var mobile_no_to_deregister = $(".default_user_mobile").val()
//        console.log('7777777777777777777777777777777777777777',mobile_no_to_deregister)
        $(".old-mobile-no").append(mobile_no_to_deregister)
    });

    $("#close-deregister-popup").on('click',function(){
        var mobile_no_to_deregister = $(".default_user_mobile").val()
//        console.log('555555555555555555555555555555555555555',mobile_no_to_deregister)
        $(".old-mobile-no").empty();
        $("#account_settings_popup").modal("toggle")

    })

    $(".deregister-mobile").on('click',function(){

        console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')

         $.ajax({
                    url: '/remove_partner_mobile_no',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        $(".verify-mobile-on-dashboard").css('display','block')
                        $("#account_verification").css('display','none')

                        $("#signup_popup_id").modal('hide')
                    }
                });
                location.reload();
    });

    $(".change-passwrd-btn").on('click',function(){
        console.log('1111111111111111111111111111')
      $("#account_settings_popup").modal('hide')
    })

    $(document).on('click','.edit_account_verification',function()
    {
        console.log('\nClicked')
        $.ajax({
                    url: '/verification_action_social_media',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        console.log('\nuuuuuuuuuu0',data['result'])
                        $("#verify_facebook").attr('href',data['result'][0])
                        $("#verify_facebook").attr('target','blank')

                        $("#verify_linkedin").attr('href',data['result'][1])
                        $("#verify_linkedin").attr('target','blank')

                        $("#verify_instagram").attr('href',data['result'][2])
                        $("#verify_instagram").attr('target','blank')

                        console.log('data result : ',data['result'][3])

                        $(".mobileVerified__number").text(data['result'][3])

                        $("#verify_twitter").attr('href',data['result'][4])
                        $("#verify_twitter").attr('target','blank')


                    }
                });
    })


    });//document ready
});//main