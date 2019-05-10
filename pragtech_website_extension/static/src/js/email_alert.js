odoo.define('pragtech_website_extension.email_alert', function (require)
    {
        $(document).ready(function()
        {
            $("#email_settings_button").on('click',function()
            {
            var listing_alerts = $("#listing_alerts").val()
            var new_device_alerts = $("#new_device_alerts").val()
            var message_alerts = 'on'
            var community_notices = $('#community_notices').val()
            var special_offers = $('#special_offers').val()
            $.ajax({
                    url: '/email_alert_settings',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {
                        'listing_alerts':listing_alerts,
                        'new_device_alerts':new_device_alerts,
                        'message_alerts':message_alerts,
                        'community_notices':community_notices,
                        'special_offers':special_offers

                    }}),
                    success: function(data)
                    {

                    }

                    })
})
})
})
