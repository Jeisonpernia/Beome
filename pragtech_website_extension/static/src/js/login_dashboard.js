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
                        for (index=0 ; index < data['result'].length; index++)
                        {
                            console.log(data['result'][index]['id'])
                            console.log(data['result'][index]['name'])
                            blog_blog_id = data['result'][index]['blog_id'][0]
                            blog_blog_name = data['result'][index]['blog_id'][1].toLowerCase().replace(/ +/g, '-')

                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'/post/'+data['result'][index]['name'].toLowerCase().replace(/ +/g, '-')+'-'+data['result'][index]['id']+'">'+data['result'][index]['name']+'</a></li>')
                        }
                        if (data['result'].length != 0)
                            ul.append('<li><a href="/info/'+blog_blog_name+'-'+blog_blog_id+'">+ View all articles</a></li>')
                    },
                });
            });
    });
});