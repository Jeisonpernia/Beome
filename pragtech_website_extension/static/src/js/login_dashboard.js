odoo.define('pragtech_website_extension.login_dashboard', function (require)
    {
        $(document).ready(function()
        {
            $("#dashboard_user").on('click',function()
            {
                console.log ("In jsssssssssss")
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
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",ul.children())
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",data['result'])


                        if (data['result']['user_profile_pic']){
                             var user_profile_pic = data['result']['user_profile_pic']
                            $(".dashbord-profile-img").attr("src", "data:image/png;base64," + user_profile_pic);
                        }

                        for (index=0 ; index < data['result']['blogs'].length; index++)
                        {
                            console.log(data['result']['blogs'][index]['id'])
                            console.log(data['result']['blogs'][index]['name'])
                            blog_blog_id = data['result']['blogs'][index]['blog_id'][0]
                            blog_blog_name = data['result']['blogs'][index]['blog_id'][1].toLowerCase().replace(/ +/g, '-')

                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'/post/'+data['result']['blogs'][index]['name'].toLowerCase().replace(/ +/g, '-')+'-'+data['result']['blogs'][index]['id']+'">'+data['result']['blogs'][index]['name']+'</a></li>')
                        }
                        if (data['result']['blogs'].length != 0)
                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'">+ View all articles</a></li>')
                    },
                });
            });


    });
});