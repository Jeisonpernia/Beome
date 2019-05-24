odoo.define('pragtech_website_extension.deactivate_account', function (require)
    {
        $(document).ready(function()
        {


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
            console.log('Imageeeeee ::: ',image)
//            alert('gfrgght')

            $.ajax({
                    url: '/account_settings',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                    'name':name,
                    'email':email,
                    'mobile':mobile,
                    'image':image,
                    }}),
                    success: function(data)
                    {
                                }

                                })
            })

            $("#verify_mobile").on('click',function()
            {
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
                                    console.log('country :',country)
                                    $('#country').append('<option value='+country[0]+'>'+country[1]+'</option>')
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



})
    })