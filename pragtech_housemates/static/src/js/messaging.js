odoo.define('pragtech_flatmates.messaging', function (require) {

    $(document).ready(function() {


    $(".each-user-chat").on('click',function(e){
//        console.log("click on User !!!")
        var chat_user_id = $(this).find("input").val()
//        console.log('Chat User id : ',chat_user_id)

        if (chat_user_id){
            $.ajax({
                    url: '/get_msg_history',
                    type: "POST",
                    dataType: 'json',
                    async:false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":{"selected_user":chat_user_id}}),
                    success: function(data){
                        if(data['result']){
//                            console.log('REsult :: ',data['result'])
                            $(".inbox-empty").css('display','none')
                            $(".message_container").css('display','block')

                            chat_user_name = data['result'][0]['char_user_name']
                            $(".chat_user_name").empty()
                            $(".chat_user_name").append('<p>' + chat_user_name + '</p>')

                            chat_user_id = data['result'][0]['chat_user_id']
                            $(".member-details").find("input").remove()
                            $(".member-details").append('<input type="hidden" class="chat-user" value="'+ chat_user_id +'">')

                            user_image = data['result'][0]['image']
                            $(".user_image").empty()
                            $(".user_image").append('<img class="message-avatar" src="data:image/png;base64,'+ user_image +'" alt="Avatar"/>')

                            property_id = data['result'][0]['property_id']
                            user = chat_user_name + "'s"
                            $(".inbox-messages-listings-link").empty()
                            $(".inbox-messages-listings-link").append('<a href="/P'+ property_id +'" target="_blank" class="view_user_listing">View '+ user +' listing</a>')

                            $(".msg-text").attr('placeholder','Write to '+chat_user_name+'...')

                            msg_data = data['result']
                            $(".message-body").empty()
                            for(var i=0;i<msg_data.length;i++){
                                each_msg = msg_data[i]
                                if (each_msg['from'] == true){
                                    own_msg_section = '<div class="own-message-section"><div class="message-details own-message warning-icon"><div class="message-text sender_msg"><p>'+ each_msg['message'] +'</p></div><div class="time-sent"><div class="message-status">sent</div></div></div></div>'
//                                    console.log($(".message-body"))

                                    $(".message-body").append(own_msg_section)
                                }
                                else if(each_msg['from'] == false){
                                    user_msg_section = ' <div class="user-message-section"><div class="message-details own-message warning-icon"><div class="message-text receiver_msg"><p>' + each_msg['message'] + '</p></div><div class="time-sent"><div class="message-status">Sent</div></div></div></div>'
                                    $(".message-body").append(user_msg_section)
                                }

                            }
                            $('.message-body').animate({ scrollTop: 99999 });
                        }
                    }
            });

        }

    })




    $(".send_messgae_to_owner").on('click',function(){
         var message = $("#message_owner").val();
         var property_owner = $("#property_owner").val();
         var property_id = $("#property_id").val();
         if (message){
                data = {
                    'property_id':property_id,
                    'message': message,
                    'property_owner':property_owner,
                }
                $.ajax({
                        url: '/save_msg_in_db',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":data}),
                        success: function(data){
//                            console.log('data : ',data)
                            if(data['result'] == true){
                                $("#message_owner").css('display','none');
                                $(".send_messgae_to_owner").css('display','none');
                                $(".view_conversation_div").removeClass('d-none')
                            }
                        }
                });
         }

    });//click on preview



    $(".send-msg").on("click",function(){
        msg = $(".msg-text").val()
//        console.log('Hereeeeeeeeeeeeeee in send !!',msg)

        chat_user = $(".chat-user").val()
//        console.log('Chat User   ::  !!',chat_user)
        if (msg && chat_user){
            data = {
                'message':msg,
                'chat_user_id':chat_user
                }

            $.ajax({
                    url: '/save_msg_in_database',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":data}),
                    success: function(data){
//                        console.log('data : ',data)
                        if(data['result']){
                            if(data['result']['from'] == true){
                                own_msg_section = '<div class="own-message-section"><div class="message-details own-message warning-icon"><div class="message-text sender_msg"><p>'+ data['result']['message'] +'</p></div><div class="time-sent"><div class="message-status">sent</div></div></div></div>'
                                $(".message-body").append(own_msg_section)
								
//								$('.message-body').animate({scrollTop:$(document).height()}, 'slow');
                                $('.message-body').animate({ scrollTop: 99999 });
                                $(".msg-text").val("")
                            }
                        }
                    }
                });


        }


    })

    $(".msg-text").on('keyup',function(){
//        console.log('ksdg;sdkfgdkg;dfkgd;fkg;fgk :',$(".msg-text").val())
        if($(this).val()){
            $(".send-icon").attr('fill','#24be9c')
//            console.log('sssssssssssssssssssssssssssssssssssssssssss')
        }
        else{
            $(".send-icon").attr('fill','#979ba3')
        }

    })











    })//ready
});//main