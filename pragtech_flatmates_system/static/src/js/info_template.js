odoo.define('pragtech_flatmates.accommodation_page', function (require) {

$(document).ready(function() {
	
	$('#head_id').on('click','li',function() {
		console.log('*************dd*******************123123',$(this).val())
		$.ajax({
			url:'/get_info_webpages',
			type:'POST',
			dataType: 'json',
	        contentType: 'application/json',
	        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id': $(this).val() }}),
	        success: function(data){
//                console.log(data['result']['html_content'])
                $('#add_html_content').html(data['result']['html_content'])
	        },
		});
		
	     

	    });
});
});