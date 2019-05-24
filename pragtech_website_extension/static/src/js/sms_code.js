odoo.define('pragtech_website_extension.sms_code', function (require){

    $(document).ready(function(){

                //send sms otp
                $(".send_sms_code_btn").on('click',function(){
                      console.log('SMSMSMSMSMSMSMSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
                      var country_id = $("#country").val();
                      var mobile_no_to_verify = $(".verify-mobile-no").val();
                      console.log('Coutry Id :',country_id)
                      console.log('Mobile No: ',mobile_no_to_verify)
                    $.ajax({
                        url: '/send_sms',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'country_id':country_id,'mobile_no':mobile_no_to_verify}}),
                        success: function(data){
                                console.log('888888888888888888888888888888888888888888888',data,data['result']['is_sms_send'],data['result']['status'])
                                if((data['result']['is_sms_send'] == true) && (data['result']['status'] == "SUCCESS")){
                                    $('#verify_otp_popup').modal('toggle');
                                }
                                else if((data['result']['is_sms_send'] == false) && (data['result']['status'] == "INVALID_RECIPIENT")){
                                    $(".invalid_mobile_no").css('display','block')
                                }

//

                            }
                      });
                });

                //verify otp
                $(".check_otp").on('click',function(){
                      console.log('OTPPPPPPPPPPPPPPPPPPPPPPPp')
                      var entered_otp = $(".otp-code").val();
                      console.log('Entered otp: ',entered_otp)
                    $.ajax({
                        url: '/verify_otp',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'entered_otp':entered_otp}}),
                        success: function(data){
                              console.log('DATAAA 0000 :',data['result']['is_verified'])
                              if(data['result']['is_verified'] == true){
                                $(".verify-heading-msg").css('display','none')
                                $(".otp-code").css('display','none')
                                $(".check_otp").css('display','none')
                                $(".verified-message").css('display','block')

                              }
                              else{
                                $(".verify-heading-msg").css('display','none')
                                $(".otp-code").css('display','none')
                                $(".check_otp").css('display','none')
                                $(".invalid-otp-msgg").css('display','block')
                              }

                        }
                    });
                });





            });
});
