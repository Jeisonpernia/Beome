odoo.define('pragtech_website_extension.account_settings', function (require){
    $(document).ready(function(){

    $("#account_settings_popup_id").on('click',function(){
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
                        console.log('User name and email :::: ',user_name,user_email)
                        $(".default_user_name").val(user_name);
                        $(".default_user_email").val(user_email);

                        if (data['result']['user_mobile']){
                            var user_mobile = data['result']['user_mobile']
                            $(".default_user_mobile").val(user_mobile);
                        }

                        if (data['result']['user_image']){
                            var user_image = data['result']['user_image']
                            console.log('Imageeeeeeeeeeeeeeeeeeeeeeeeee :',user_image)
                            $(".profile-pic").attr("src", "data:image/png;base64," + user_image);

//                            $(".profile-pic").val(user_image);
                        }
                    }

        })

    })

    //////////////////////////////////////////////////////////////////
    // change image on account setting
    $(document).ready(function() {
        var readURL = function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.profile-pic').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $(".profile_image").on('change', function(){
            readURL(this);
        });

        $(".profile_image").on('click', function() {
           $(".profile_image").click();
        });
    });
    /////////////////////////////////////////////////////////////////////
    //Change image on My Account Dashboard
    $(document).ready(function() {
        var readURL = function(input) {
            console.log('OOOOOOOOOOOOOOOO :',input.files,input.files.length)
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $(".dashbord-profile-img").attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $(".pro-img").on('change', function(){
            readURL(this);
            console.log('55555555555555555555555555555555555555555555')
            var image = $(".dashbord-profile-img").attr('src')
            console.log('Imageeeeee ::: ',image)

            $.ajax({
                    url: '/set_user_profile_pic',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                    'image':image,
                    }}),
                    success: function(data)
                    {
                    }

            })
        });

        $(".pro-img").on('click', function() {
           $(".pro-img").click();
        });
    });
    //////////////////////////////////////////////////////////////

    });//document ready
});//main