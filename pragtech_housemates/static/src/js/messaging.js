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
                            console.log('REsult :: ',data['result'])

                            $(".inbox-empty").css('display','none')
                            $(".message_container").css('display','block')

                            unread_msg_count = data['result'][0]['unread_msg_count']


                            chat_user_name = data['result'][0]['char_user_name']
                            $(".chat_user_name").empty()
                            $(".chat_user_name").append('<p>' + chat_user_name + '</p>')

                            mobile_number = data['result'][0]['mobile_number']
                            $(".number").empty()
                            $(".number").text(mobile_number)

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

                            if (data['result'][0]['is_blocked'] == true){
                                $(".block-this-member").addClass("d-none")
                                $(".unblock-this-member").removeClass("d-none")
                            }

                            msg_data = data['result']
                            $(".message-body").empty()
                            for(var i=0;i<msg_data.length;i++){
                                each_msg = msg_data[i]
                                if (each_msg['from'] == true){
                                    if(each_msg['is_seen'] == true){
                                        own_msg_section = '<div class="own-message-section"><div class="message-details own-message warning-icon"><div class="message-text sender_msg"><p>'+ each_msg['message'] +'</p></div><div class="time-sent"><div class="message-status">seen</div>'+ each_msg['time'] +'</div></div></div>'
                                    }
                                    else{
                                        own_msg_section = '<div class="own-message-section"><div class="message-details own-message warning-icon"><div class="message-text sender_msg"><p>'+ each_msg['message'] +'</p></div><div class="time-sent"><div class="message-status">sent</div>'+ each_msg['time'] +'</div></div></div>'
                                    }

                                    $(".message-body").append(own_msg_section)
                                }

                                else if(each_msg['from'] == false){
                                    user_msg_section = '<div class="user_message_image"></div><div class="user-message-section"><div class="message-details own-message warning-icon"><div class="message-text receiver_msg"><p>' + each_msg['message'] + '</p></div><div class="time-sent">'+ each_msg['time'] +'</div></div></div>'

                                    $(".message-body").append(user_msg_section)
                                }

                            }
                            $(".user_message_image").append('<img class="message-avatar" src="data:image/png;base64,'+ user_image +'" alt="Avatar"/>')
                            $('.message-body').animate({ scrollTop: 99999 });


                            unread_msg_count = data['result'][data['result'].length-1]['unread_msg_count']

                            $(".message-numbers").text(unread_msg_count+" unread messages")

                            if(data['result'][data['result'].length-1]['unread_msg_count'] == 0){
                              $(".unread-msg-cnt").addClass("d-none")
                            }
                            else{
                                $(".unread-msg-cnt").text(data['result'][data['result'].length-1]['unread_msg_count'])

                            }



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
                                own_msg_section = '<div class="own-message-section"><div class="message-details own-message warning-icon"><div class="message-text sender_msg"><p>'+ data['result']['message'] +'</p></div><div class="time-sent"><div class="message-status">sent</div>'+ data['result']['time'] +'</div></div></div>'
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

    //delete conversation

    $(".delete-conversation").on('click',function(){
        var chat_user = $(".chat-user").val()
        if (chat_user){
            $.ajax({
                    url: '/delete_conversation',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":{'chat_user_id':chat_user}}),
                    success: function(data){
                        console.log('DATA: ',data)
                        if(data['result'] == true){
                            $("#conversation_deleted_popup").modal("toggle")
                        }
                    }
            });
        }

    })


    //refresh page on click of close button on popup
     $(document).on('click','.close-conversation-delete-popup',function(){
         location.reload();
     })

    //refresh page on click outside of popup
     $("#conversation_deleted_popup").on("hidden.bs.modal", function () {
          location.reload();
     });


     //block this Member
     $(".block-this-member").on('click',function(){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
         var user_id = $(".chat-user").val()
         console.log('user id :   ::: ',user_id)
         if (user_id){
            $.ajax({
                    url: '/block_this_member',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":{'chat_user_id':user_id}}),
                    success: function(data){
                        console.log('DATA: ',data)
                        if(data['result'] == true){
                            member_name = $(".chat_user_name").find("p").text()
                            console.log("Memmeber NAme : ",member_name)

                            $(".block-member-name").text(member_name)
                            $("#block_user_popup").modal("toggle")
                        }
                    }
            });
        }

     })

     $(".unlock-member").on('click',function(){
        console.log('UNblock Membereeeeeeeeeeeeeeeeeeee ')
        var user_id = $(".chat-user").val()
        if(user_id){
            $.ajax({
                url: '/unblock_this_member',
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":{'chat_user_id':user_id}}),
                success: function(data){
                    console.log('DATA: ',data)
                    if(data['result'] == true){
                        member_name = $(".chat_user_name").find("p").text()

                        $("#block_user_popup").modal("hide")
                        $(".unblock-member-name").text(member_name)
                        $("#unblock_user_popup").modal("toggle")
                    }
                }
         });
        }


     })


     //report this member
     $(".submit-feedback").on('click',function(){
        console.log('Submit feedback')
        var user_id = $(".chat-user").val()
        var feedback_category = $("#feedback_category_id").val()
        var feedback_detail = $("#feedback_detail_id").val()
        var data = {}

        if (user_id){
            data = {
            'chat_user_id':user_id,
            'feedback_category':feedback_category,
            'feedback_detail':feedback_detail,
            }
            $.ajax({
                url: '/submit_feedback',
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params":data}),
                success: function(data){
                    console.log('DATA: ',data)
                    if(data['result'] == true){
                        $("#report_this_member_popup").modal("hide")
                    }
                }
         });
        }


     })


//     $(".view-conversation-btn").click(function(){
//        console.log('yoooooooooooooooooooooooooooy')
//        var property_owner = $("#property_owner").val();
//        console.log("property_owner: ",property_owner)
//        $("#view_conversation_user_id").val(property_owner)
//
//        console.log("ffffffffffffffffffffffff ",$("#view_conversation_user_id").val())
//        if($("#view_conversation_user_id").val()){
//            window.location.replace("/messages")
//        }
//
//     })


     if(window.location.pathname == "/messages"){
      console.log('value present in view_conversation_user_id',$("#view_conversation_user_id").val())

       $.ajax({
                url: '/get_current_user_id',
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call",}),
                success: function(data){
                    console.log('DATA: ',data)
                    if(data['result']['id'] == 2){
                        $('.inbox-wrapper').css('top','140px')
                    }
                    else{
                        $('.inbox-wrapper').css('top','96px')

                    }
                }
             })

     }
//     if(window.location.href.indexOf("/listplace") > -1 || window.location.href.indexOf("/find-place/") > -1){
//      $.ajax({
//                url: '/get_current_user_id',
//                type: "POST",
//                dataType: 'json',
//                contentType: 'application/json',
//                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call",}),
//                success: function(data){
//                    console.log('DATA: ',data)
//                    if(data['result']['id'] == 2){
//                        $('.custom_header').css('top','46px')
//                    }
//                    else{
//                        $('.custom_header').css('top','0px')
//
//                    }
//                }
//             })
//
//
//     }


     if(window.location.href.indexOf("/") > -1){
        console.log('**************************************************')
        $.ajax({
                url: '/get_unread_msg_count',
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call",}),
                success: function(data){
                    console.log('DATA: ',data)
                    if(data['result']){
                            if (data['result']['unread_msg_count'] != 0){
                                console.log("Unread message Count :: ",data['result']['unread_msg_count'])
                                $(".unread-msg-cnt").removeClass("d-none")
                                $(".unread-msg-cnt").text(data['result']['unread_msg_count'])
                            }

                    }
                }
         });


     }














    })//ready
});//main