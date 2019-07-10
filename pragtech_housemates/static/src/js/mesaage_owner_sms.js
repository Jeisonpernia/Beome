odoo.define('pragtech_housemates.sms_code', function (require){

    $(document).ready(function(){

                //send sms Message
                $(".send_messgae_to_owner").on('click',function(){
//                    $(".message_required").css('display','none')
//                    $(".invalid_owner_mobile").css('display','none')
//                      var property_id = $("#property_id").val();
//                      var message_owner = $("#message_owner").val();
//                      if (message_owner){
//                        console.log('property_id: ',property_id)
//                        $.ajax({
//                            url: '/sms_messgae_to_owner',
//                            type: "POST",
//                            dataType: 'json',
//                            contentType: 'application/json',
//                            data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'property_id':property_id, 'message_owner':message_owner}}),
//                            success: function(data){
//                                   console.log('888888888888888888888888888888888888888888888',data)
//                                    $('#message_owner').val('');
//                                    if (data && data['result']) {
//                                        if ((data['result']['is_sms_send'] == false) && (data['result']['status'] == "INVALID_RECIPIENT")) {
//                                            $(".invalid_owner_mobile").css('display', 'block')
//                                        }
//                                    }
//                                }
//                          });
//                    }
//                    else{
//                        $(".message_required").css('display','block')
//                      }
                });

            });
});
