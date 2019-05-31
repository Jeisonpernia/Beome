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
                        $(".default_user_name").val(user_name);
                        $(".default_user_email").val(user_email);

                        if (data['result']['user_mobile']){
                            var user_mobile = data['result']['user_mobile']
                            $(".default_user_mobile").val(user_mobile);

                            if(data['result']['is_mobile_verified'] == true){
                                $(".verify-phone").css('display','none')
                                $(".already-verified").css('display','block')
                            }
                            else{
                                console.log('')

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
    });


    });//document ready
});//main