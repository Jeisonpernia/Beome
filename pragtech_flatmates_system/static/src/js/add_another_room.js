odoo.define('pragtech_flatmates.add_another_room', function (require) {



$(document).ready(function() {
var room_data;
    function load_data_aboutroom()
    {
        $.ajax({
                    url: '/get_aboutroom',
                    type: "POST",
                    dataType: 'json',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                    success: function(data)
                    {
                        console.log ("Dataaaaaaaaaaaaa",data)
                        room_data=data
                    },
                });
    }


    $(".add_another_room").on("click", function(){

   $('.about_rooms_bttn').prop("disabled", true)


    load_data_aboutroom()
//    console.log('11111111',room_data['result'])
    var div_length= $('.list-about-room').length
    console.log("Length----------------------------------",$('.list-about-room'))

//    console.log('11111111',room_data['result'][0]['room_types'])
//    console.log('11111111',room_data['result'][0]['room_furnishing'])
//    console.log('11111111',room_data['result'][0]['bathroom_types'])

    if (div_length==1)
    {
    $('.list-about-room').prepend('<div id=room_number><br><h5>Room '+(div_length)+'</h5></div>')
    }
    var open_main_div ='<div class="col-lg-6 mx-auto list-about-room">'
    var close_main_div ='</div>'

    var room_num_div = '<div id=room_number><br><h5>Room '+(div_length+1)+'</h5></div>'

    var room_type_div ='<div class="form-group"><span class="mb-1">Room type</span><div class="total-bedrooms mt-2">'
    for(rec=0; rec<room_data['result'][0]['room_types'].length; rec++ )
        room_type_div+='<label class="radio-inline btn bedroom-btn"><input type="radio" value='+room_data['result'][0]['room_types'][rec]['id']+' name="room_type_'+div_length+'"/>'+room_data['result'][0]['room_types'][rec]['name']+'</label>'
    room_type_div+='</div></div>'

    var room_furnishing_div ='<div class="form-group"><span class="mb-1">Room furnishings</span><div class="total-bedrooms mt-2">'
    for(rec=0; rec<room_data['result'][0]['room_furnishing'].length; rec++ )
        room_furnishing_div+='<label class="radio-inline btn bedroom-btn"><input type="radio" value='+room_data['result'][0]['room_furnishing'][rec]['id']+' name="room_furnishing_types_'+div_length+'"/>'+room_data['result'][0]['room_furnishing'][rec]['name']+'</label>'
    room_furnishing_div+='</div></div>'

    var bathroom_types_div ='<div class="form-group"><span class="mb-1">Bathroom</span><div class="total-bedrooms mt-2">'
    for(rec=0; rec<room_data['result'][0]['bathroom_types'].length; rec++ )
        bathroom_types_div+='<label class="radio-inline btn bedroom-btn"><input type="radio" value='+room_data['result'][0]['bathroom_types'][rec]['id']+' name="bathroom_types_'+div_length+'"/>'+room_data['result'][0]['bathroom_types'][rec]['name']+'</label>'
    bathroom_types_div+='</div></div>'

    var remove_button_div = '<div class="row"><div class="mt-4 mx-auto"><button type="button"class="btn btn-primary btn-transparent p16-blue remove_another_room">Remove</button></div></div><hr/>'
    var newDiv = open_main_div+room_num_div+room_type_div+room_furnishing_div+bathroom_types_div+remove_button_div+close_main_div


       $('#add_another_room_div').append(newDiv)
    });


    $(document).on('click','.remove_another_room',function()
    {
        $(this).closest("div.list-about-room").remove();

        var div_length= $('.list-about-room').length
        var radio_btn_checked_length = $("input:checked").length

        if((div_length * 3) == radio_btn_checked_length)
        {
           $('.about_rooms_bttn').prop("disabled", false)
        }

        console.log(div_length)
        if (div_length==1)
        {
            $('#room_number').remove()
        }
        else
        {
            $('.list-about-room').each(function( index )
            {
                $('#room_number').remove()
            });
            $('.list-about-room').each(function( index )
            {
                $(this).prepend('<div id=room_number><br><h5>Room '+(index+1)+'</h5></div>')
            });
        }
    });
});
// property Total bedrooms Select
$(document).ready(function() {
	"use strict";

  $(".acceptlist").click(function() {

    var active_state = $(this).hasClass("accommodation-listing-item-active")
    console.log("=------------- wae awee  assd-------- asdfs-",)

    if (active_state == true)
    {
        $(this).find(".active_tick_icon").remove()
        $(this).find("input[name='list_accept']").attr("checked",false)
        $(this).removeClass("accommodation-listing-item-active")
        $(this).find("path").removeAttr('class','active_svg_icon');
        $(this).addClass("items-cirle-hover")
    }
    else
    {
        $('<div class="active_tick_icon"></div>').prependTo($(this))
        $(this).find("input[name='list_accept']").attr("checked","checked")
        $(this).addClass("accommodation-listing-item-active")
        $(this).find("path").attr('class', 'active_svg_icon');
        $(this).removeClass("items-cirle-hover")
    }


//    $(this).parent().addClass("bedroom-btn-active") //Add class wrong to the label
//    $(this).attr('checked','checked')
//    $(".bedroom-btn > input[value!='"+$(this).val()+"']:radio").parent().removeClass("bedroom-btn-active"); // Remove classes from the other labels.
//    $(".bedroom-btn > input[value!='"+$(this).val()+"']:radio").attr('checked',false)
  });

});



$(document).ready(function() {
	"use strict";



  $(".bedroom-btn > input:radio").click(function() {
console.log("Notttttt")
    $(this).parent()
      .addClass("bedroom-btn-active") //Add class wrong to the label
      .siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.
  });


});

$(document).ready(function() {
	"use strict";
    $("input[name=room_type_0]").attr('checked',false)
    $("input[name=room_furnishing_types_0]").attr('checked',false)
    $("input[name=bathroom_types_0]").attr('checked',false)

  $("#add_another_room_div").on('click','input:radio',function() {

    console.log ("-----------",$(this))
    $(this).parent()
      .addClass("bedroom-btn-active") //Add class wrong to the label
      .siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.

    $(this).attr("checked", "checked")
    $(this).closest('div').find('input[value!='+this.value+']').attr('checked',false)

//    console.log("----------------Siblings",$(this).closest('div').find('input[value!='+this.value+']'));
    console.log("----------------Checked length",$("input:checked").length);

    console.log("----------------Room_type_0",$("input[name=room_type_0]").is(":checked"));

    var div_length = $('.list-about-room').length
    var radio_btn_checked_length = $("input:checked").length

    if((div_length * 3) == radio_btn_checked_length)
    {

       $('.about_rooms_bttn').prop("disabled", false)
    }


  });

});


//&& $("input[name=room_furnishing_types]").is(":checked") == true && $("input[name=bathroom_types]").is(":checked") == true
    //Validation for "About the room(s)" page
//    $("input[name=room_type_0]").on("change", function(){
//        console.log ("Checkeddddddddddddddd------------------",$("input[name=room_type_0]").is(":checked"))
//        if($("input[name=room_type_0]").is(":checked") == true ){
//            $('.about_rooms_bttn').prop("disabled", false);
//        } else {
//            $('.about_rooms_bttn').prop("disabled", true);
//        }
//    });

//    $("input[name=room_furnishing_types]").on("change", function(){
//        if($("input[name=room_type]").is(":checked") == true && $("input[name=room_furnishing_types]").is(":checked") == true && $("input[name=bathroom_types]").is(":checked") == true){
//            $('.about_rooms_bttn').prop("disabled", false);
//        } else {
//            $('.about_rooms_bttn').prop("disabled", true);
//        }
//    });
//
//    $("input[name=bathroom_types]").on("change", function(){
//        if($("input[name=room_type]").is(":checked") == true && $("input[name=room_furnishing_types]").is(":checked") == true && $("input[name=bathroom_types]").is(":checked") == true){
//            $('.about_rooms_bttn').prop("disabled", false);
//        } else {
//            $('.about_rooms_bttn').prop("disabled", true);
//        }
//    });


})





