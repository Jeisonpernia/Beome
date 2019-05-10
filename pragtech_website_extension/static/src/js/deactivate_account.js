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

                    }

                    })
})

$("#account_settings").on('click',function()
            {
            var name = $("#name").val()
            var email = $("#email").val()

            $.ajax({
                    url: '/account_settings',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                    'name':name,
                    'email':email
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

})
})