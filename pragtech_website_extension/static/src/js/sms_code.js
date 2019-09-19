odoo.define('pragtech_website_extension.sms_code', function (require){

    $(document).ready(function(){

                //send sms otp
                $(".send_sms_code_btn").on('click',function(){
                      console.log('SMSMSMSMSMSMSMSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
                      var country_id = $("#country").val();
                      var mobile_no_to_verify = $(".verify-mobile-no").val();
                      console.log('Coutry Id :',country_id)
                      console.log('Mobile No: ',mobile_no_to_verify)
                      $('.otp-code').val('')

                      var data = {
                            'country_id':country_id,
                            'mobile_no':mobile_no_to_verify
                          }

                      if($("input[name=allowed-contact]").attr('checked') == 'checked'){
                        console.log('yesss checkedddddddd')
                        data['allowed_to_contact'] = true
                      }


                    $.ajax({
                        url: '/send_sms',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
                        success: function(data){
//                                console.log('888888888888888888888888888888888888888888888',data)
                                if((data['result']['is_sms_send'] == true) && (data['result']['status'] == "SUCCESS")){
                                    var mobile_number = data['result']['mobile_number']

//                                    var msg = "A security code has been sent to "+mobile_number+" .It may take a few minutes to arrive."
                                    $(".code-sent-to-mobile").text(mobile_number)
                                    $("#verify_mobile_popup").modal('hide');
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
                                $(".security-code-sent").css('display','none')
                                $(".otp-code").css('display','none')
                                $(".check_otp").css('display','none')
                                $(".verify-code-footer").css('display','none')
                                $(".verified-message").css('display','block')
                                $(".verify-mobile-on-dashboard").css('display','none')
                                $("#account_verification").css('display','block')

                                $("#signup_popup_id").modal('hide')

                              }
                              else{
                                $(".verify-heading-msg").css('display','none')
                                $(".security-code-sent").css('display','none')
                                $(".otp-code").css('display','none')
                                $(".check_otp").css('display','none')
                                $(".verify-code-footer").css('display','none')
                                $(".invalid-otp-msgg").css('display','block')
                              }

                        }
                    });
                });


                $(".allowed-to-contact").on('click',function(){
                    console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this).find('i').hasClass('fa-times'))
                    if($(this).find('i').hasClass('fa-times') == false){
                        console.log('ifffffffffffffffffffffffffffffffff')
                        $(".add-green").css('background-color','#e4e5e6')
                        $("#allowed-contact").removeAttr('checked')


                    }
                    else{
                        console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee')
                        $(".add-green").css('background-color','#11836c')
                        $("#allowed-contact").attr('checked','checked')

                    }

                })


                $(".allowed-to-contact-in-edit-account").on('click',function(){
                    console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this).find('i').hasClass('fa-times'))
                    if($(this).find('i').hasClass('fa-times') == false){
                        console.log('ifffffffffffffffffffffffffffffffff')
                        $(".add-green-in-edit").css('background-color','#e4e5e6')
                        $("#allowed-contact-in-edit").removeAttr('checked')


                    }
                    else{
                        console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee')
                        $(".add-green-in-edit").css('background-color','#11836c')
                        $("#allowed-contact-in-edit").attr('checked','checked')

                    }

                })





            });
});
