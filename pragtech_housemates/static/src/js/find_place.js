odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";

     var window_pathname = window.location.pathname

// Commented by Himesh bcoz this code was affecting the top menu bar for Find Place Start
//    if (window_pathname == '/find-place/describe-your-ideal-place/start')
//    {
//        // ("In general statement if (window_pathname.includes('about-yourself'))")
//
//        if ($("#find_comment").val().length == 0 )
//        $('.styles__errorMessage_find_comment').hide();
//
//        if ($(this).find("#find_comment").val().length<10)
//            $('.find-publish').prop("disabled", true)
//        else
//            $('.find-publish').prop("disabled", false)
//    }

    $("#find_comment").keyup(function()
    {
        //console.log ("In template /find-place/describe-your-ideal-place/about-yourself")
        var window_pathname = window.location.pathname
        if ($(this).val().length < 10)
            $('.find-publish').prop("disabled", true)
        else
            $('.find-publish').prop("disabled", false)
    });

    $("#find_comment").on('keyup', function (){
        if ( $("#find_comment").val().length == 0 )
            {
                $('.styles__errorMessage_find_comment').hide();
                // Code added by dhrup
                $('#find_comment').removeClass("border-red")
            }

        if ( $("#find_comment").val().length <= 9 )
            {
                $('.styles__errorMessage_find_comment').show();
                // Code added by dhrup
                $('#find_comment').addClass("border-red")
            }
        else
           {
                $('.styles__errorMessage_find_comment').hide();
                // Code added by dhrup
                $('#find_comment').removeClass("border-red")
           }

    });

    var $input2 = $("#find-budget");
    if (window_pathname.includes('rent-timing') && $input2)
    {
                 if ($input2.val().length == 0 )
                {
                    $('.styles__errorMessage3').hide();
                }
        //console.log ("In general statement if (window_pathname.includes('about-property'))")
        if ($input2.val() > 10000)
            $('.submit-rent-timing').prop("disabled", true)
    }
    $input2.on('keyup', function (){

        if ($input2.val() <= 10000 )
            {
                $('.styles__errorMessage3').hide();
                // Code added by dhrup
                $('#find-budget').removeClass("border-red");
            }

        if ($input2.val() > 10000 )
            {
                $('.styles__errorMessage3').show();
                // Code added by dhrup
                $('#find-budget').addClass("border-red");
                $('.submit-rent-timing').prop("disabled", true)
            }
        else
            {
                $('.styles__errorMessage3').hide();
                // Code added by dhrup
                $('#find-budget').removeClass("border-red");
            }
    });



//  ======================================================
//  = --------------  General Statements  -------------- =
//  ======================================================
//  Note: These below statement get executed if we hit
//  any of the path mention in if condition



//  = --------------  End of General Statements  -------------- =


//  =======================================================================================================
//  = --------------  Validations for /find-place/describe-your-ideal-place/accommodation  -------------- =
//  =======================================================================================================
//  Note: Check whether this js is not visible on other pages mentioned in a comment above

  $(".find-active-property").click(function()
  {
    var active_state = $(this).hasClass("accommodation-listing-item-active")

    if (active_state == true)
    {
        $(this).find(".active_tick_icon").remove()
        $(this).find("input[name='find_place_looking']").attr("checked",false)
        $(this).removeClass("accommodation-listing-item-active")
        $(this).find("path").removeAttr('class','active_svg_icon');
        $(this).addClass("items-cirle-hover")
    }
    else
    {
        $('<div class="active_tick_icon"></div>').prependTo($(this))
        $(this).find("input[name='find_place_looking']").attr("checked","checked")
        $(this).addClass("accommodation-listing-item-active")
        $(this).find("path").attr('class', 'active_svg_icon');
        $(this).removeClass("items-cirle-hover")
    }
  });


//  = --------------  End of Validations for /list-place/share-house/accommodation  -------------- =


$('.find-suburbs').on('keypress',function(e) {
    if(event.keyCode == 13)
    {
       //console.log($(this).parent())
       $(this).parent().prepend('<div class="badge badge-pill badge-secondary"><span>Tag 220<i class="close fa fa-times"></i></div>')
       alert("sfdsd")
       event.preventDefault();
      return false;
    }
  });


//   $("#autocomplete2").tagit({
//        console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee333')
////        availableTags: 'fdf'
//    });

//  /describe-your-ideal-place/rent-timing


$("#find-txtdate").datepicker({
                minDate: 0
            });

$('#find-budget, #find-txtdate').on('keyup change',function()
{
    $('#find-txtdate').prop("readonly",true)

    if ($('#find-budget').val()!='' && $('#find-txtdate').val()!='')
        $('.submit-rent-timing').prop("disabled", false)

    else
        $('.submit-rent-timing').prop("disabled", true)
});



//  /find-place/describe-your-ideal-place/property-preferences
  $(".property_preferences > input:radio").click(function() {
//console.log("Righttt")
    $(this).parent()
      .addClass("bedroom-btn-active") //Add class wrong to the label
      .siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.

    if (($("input[name=find-room_furnishing]").is(":checked") == true) &&
        ($("input[name=find-internet_type]").is(":checked") == true) &&
        ($("input[name=find-bathroom_type]").is(":checked") == true) &&
        ($("input[name=find-parking_type]").is(":checked") == true) &&
        ($("input[name=find-no-of-flatmates]").is(":checked") == true))
            $(".submit-property-preferences").prop("disabled",false)
    else
        $(".submit-property-preferences").prop("disabled",true)
  });

function deg2rad(deg)
{
  return deg * (Math.PI/180)
}

function calculate_distance ( lat1, lat2, lon1, lon2)
{
    var R = 6371
    var dlon = deg2rad (lon2 - lon1)
    var dlat = deg2rad (lat2 - lat1)
    var a = (Math.sin(dlat/2)*Math.sin(dlat/2)) +
            Math.cos(lat1) * Math.cos(lat2) *
            (Math.sin(dlon/2)*Math.sin(dlon/2))
    var c = 2 * Math.atan2( Math.sqrt(Math.abs(a)), Math.sqrt(Math.abs(1-a)) )
    var d = R * c

    console.log ("\n\nlon",dlon)
    console.log ("lat",dlat)
    console.log ("a",a)
    console.log ("c",c, Math.sqrt(a))
    console.log ("d",d, Math.sqrt(1-a))

    return d
}

    $(document).on('click','.delete-suburb',function(e)
    {
        if ($(this).parent().parent().hasClass('suburbs-div-red'))
        $('.show-distance-msg').addClass('d-none')

        $(this).parent().parent().remove()

        if ($('.suburbs-div').length == 0)
            $('.propert_submit_btn').attr('disabled',true)

    })

    var flag = 0
    $(document).on('keyup','.find-place-add-suburbs',function(e)
    {
    var data;
    var type;

//    console.log("--------",$('#find_suburb').val())
    // BACKSPACE
    if (e.keyCode == 8)
    {
        console.log ("Backsapce",$('#find_suburb').val())



        if ($('.suburbs-div').length != 0 && $('#find_suburb').val().length == 0 && flag == 1)
        {
            flag = 0
            var last_div = $('.suburbs-div').last()
            if (last_div.hasClass('suburbs-div-red'))
                $('.show-distance-msg').addClass('d-none')
            last_div.remove()
            if ($('.suburbs-div').length == 0)
                $('.propert_submit_btn').attr('disabled',true)
        }
        else
        {
            if ($('#find_suburb').val().length == 0 )
                flag = 1
        }


    }

    // DOWN
    if (e.keyCode == 40)
    {
//        console.log ("Backspace")
        $("#find_suburb").val("")
    }

    // UP
    else if (e.keyCode == 38)
    {
//        console.log ("Uppppp")
        $("#find_suburb").val("")
    }

    // Enter key is pressed
    else if (e.keyCode == 13)
    {
//        console.log ("Enterrrr")
        e.preventDefault();
    }

    else
    {
//        console.log ($(this).val())
        if (isNaN($('#find_suburb').val()))
        {
            data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'suburb_to_search' : $('#find_suburb').val(), 'type_of_data' : 'string' }})
            type = 'string'
        }
        else
        {
            data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'suburb_to_search' : $('#find_suburb').val(), 'type_of_data' : 'integer' }})
            type = 'integer'
        }

//         console.log ("key press",isNaN($(this).val()))

        if ($('#find_suburb').val().length==0)
        {
        }
        else
        {
             if (type == 'integer' && $('#find_suburb').val().length >= 3)
             {
             $.ajax({
                        url: '/get_suburbs',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        async: false,
                        data: data,
                        success: function(data)
                        {
                            $('#find_suburb').autocomplete
                            ({
                                source: data['result'],
                                delay:300,
                                select: function(event, ui)
                                {
                                    var suburb_obj = $('.find-place-add-suburbs').find("input")
//                                    console.log ("88888888888888888888888",suburb_obj)
                                    if (suburb_obj.length == 1)
                                    {
//                                        $(".find-place-add-suburbs").prepend('<div class="suburbs-div"><input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $(".find-place-add-suburbs").prepend('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $("#find_suburb").val("")
                                        $('.propert_submit_btn').attr('disabled',false)
                                        return false;
                                    }
                                    else
                                    {
                                        var flag_add = 1;
                                        var flag_dist = 1;

                                        var first_suburb = $(".suburbs-div").first()
                                        var first_suburb_span = first_suburb.find('span')

//                                            console.log ("First   Suburb ",first_suburb_span.attr('data-lat'),first_suburb_span.attr('data-lon'))
//                                            console.log ("Current Suburb ",ui.item.value[1],ui.item.value[2])

                                        var distance = calculate_distance ( first_suburb_span.attr('data-lat'), ui.item.value[1], first_suburb_span.attr('data-lon'), ui.item.value[2])

//                                            console.log (distance)

                                        if (distance > 30)
                                        {
                                            console.log ("In the message message")
                                            $('.show-distance-msg').removeClass("d-none")

//                                                $('<div class="suburbs-div suburbs-div-red"><input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-danger" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token token-red" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');


    //                                            $(".find-place-add-suburbs").prepend('<input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'</span>')
                                                $("#find_suburb").val("")
                                            $("#find_suburb").val("")
                                            return false;
                                        }
                                        else
                                        {
                                            suburb_obj.each(function()
                                            {
                                                if ($(this).val() == ui.item.label)
                                                    flag_add = 0
    //                                            console.log("------------",$(this).val())
                                            })

                                            if (flag_add == 1)
                                            {
                                                if (!$('.show-distance-msg').hasClass("d-none"))
                                                    $('.show-distance-msg').addClass("d-none")
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
//                                                $('<div class="suburbs-div"><input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
    //                                            $(".find-place-add-suburbs").prepend('<input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'</span>')
                                                $("#find_suburb").val("")
                                                return false;
                                            }
                                            else
                                            {
                                                $("#find_suburb").val("")
                                                return false;
                                            }
                                        }
                                    }
                                }
                            })

                        }
                    })
            }
            if (type == 'string' && $('#find_suburb').val().length >= 3)
            {
            console.log ("Elseeeeeeeeee Stringggggggggg")
             $.ajax({
                        url: '/get_suburbs',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json',
                        data: data,
                        async: false,
                        success: function(data)
                        {
                            var data_array = []
                            if (data['result'].length <= 5)
                                for (var i=0; i<data['result'].length; i++)
                                    data_array[i] = data['result'][i]
                            else
                                for (var i=0; i<5; i++)
                                data_array[i] = data['result'][i]

                            $('#find_suburb').autocomplete
                            ({
                                source: data_array,
                                delay:300,
                                select: function(event, ui)
                                {
                                    var suburb_obj = $('.find-place-add-suburbs').find("input")
//                                    console.log ("88888888888888888888888",suburb_obj)
                                    if (suburb_obj.length == 1)
                                    {
//                                        $(".find-place-add-suburbs").prepend('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $(".find-place-add-suburbs").prepend('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $("#find_suburb").val("")
                                        $('.propert_submit_btn').attr('disabled',false)
                                        return false;
                                    }
                                    else
                                    {
                                        var flag_add = 1;
                                        var flag_dist = 1;

                                        var first_suburb = $(".suburbs-div").first()
                                        var first_suburb_span = first_suburb.find('span')

//                                            console.log ("First   Suburb ",first_suburb_span.attr('data-lat'),first_suburb_span.attr('data-lon'))
//                                            console.log ("Current Suburb ",ui.item.value[1],ui.item.value[2])

                                        var distance = calculate_distance ( first_suburb_span.attr('data-lat'), ui.item.value[1], first_suburb_span.attr('data-lon'), ui.item.value[2])

//                                            console.log (distance)

                                        if (distance > 30)
                                        {
//                                                console.log ("In the message message")
                                            $('.show-distance-msg').removeClass("d-none")
//                                                $('<div class="suburbs-div suburbs-div-red"><input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-danger" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token token-red" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
    //                                            $(".find-place-add-suburbs").prepend('<input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'</span>')
                                                $("#find_suburb").val("")
                                            $("#find_suburb").val("")
                                            return false;
                                        }
                                        else
                                        {
                                            suburb_obj.each(function()
                                            {
                                                if ($(this).val() == ui.item.label)
                                                    flag_add = 0
    //                                            console.log("------------",$(this).val())
                                            })

                                            if (flag_add == 1)
                                            {
                                                if (!$('.show-distance-msg').hasClass("d-none"))
                                                    $('.show-distance-msg').addClass("d-none")
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
    //                                            $(".find-place-add-suburbs").prepend('<input type=hidden id="suburbs" name="suburbs[]" value="'+ui.item.label+'"><span class="badge badge-light" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'</span>')
                                                $("#find_suburb").val("")
                                                return false;
                                            }
                                            else
                                            {
                                                $("#find_suburb").val("")
                                                return false;
                                            }
                                        }
                                    }
                                }
                            })
                        }


                    })
            }
        }
    }

})

//  =============================================================================================================
//  = --------------  Validations for /find-place/describe-your-ideal-place/introduce-flatmates  -------------- =
//  =============================================================================================================
//  Note: Check whether this js is not visible on other pages mentioned in a comment above

    if (window_pathname.includes('/introduce-flatmates'))
    {
//        console.log ("sdefffffffffffffffffff")
        var user_array_image=[]
    }


    $(document).on('change','#file-input-profile',function()
    {
        //console.log("----------------- ggggggggggggggggggggg aaaaaaaaaaaaa aaaaaaaa")
        var files_rec = document.getElementById($(this).attr("id"));
        //console.log("-----------------",files_rec.files.length)

        for (var rec = 0; rec < files_rec.files.length; rec++)
        {
            var reader = new FileReader();
//            console.log("-----------------",files_rec.files[rec])
            reader.onload = (function(theFile)
            {
                return function(e)
                {
                    var file_path = e.target.result
//                    console.log ("Result 1",file_path)
                    file_path = file_path.slice(file_path.indexOf(',')+1)
                    //console.log ("Result 2",file_path)
                    user_array_image = []
                    user_array_image.push(file_path)

                    var remove_svg= $(document).find('.replace_image')
                    remove_svg.remove()

                    var add_img=$(document).find('.add_profile_icon')
                    //console.log ("Deleteeeeeeeeee",add_img.find('img').length)
                    if (add_img.find('img').length!=0)
                    {
                        var replace_img = add_img.find('img')
                        replace_img.replaceWith('<img src="data:image/jpeg;base64,'+file_path+'"/>')
                    }
                    else
                    {
                        //console.log ("Deleteeeeeeeeee")
                        add_img.append('<img src="data:image/jpeg;base64,'+file_path+'"/>')
                    }
                };
            })(files_rec.files[rec]);
            reader.readAsDataURL(files_rec.files[rec])
        }
    });

   $( document ).on('submit','#find_employment',function( event ) {
            var record_array = JSON.parse(localStorage.getItem('find_place_record'));
//            console.log(record_array)

            var find_pace_for = $("input[name=find-place-for]:checked").val()
            //console.log(find_pace_for)
            var data = {}

            if (find_pace_for == "me")
            {
                data['place_for'] = find_pace_for
                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
                                      'age' : $("input[name=your_age_0]").val(),
                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
                                    }]
                //console.log(data)
            }

            if (find_pace_for == "couple")
            {
                data['place_for'] = find_pace_for
                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
                                      'age' : $("input[name=your_age_0]").val(),
                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
                                    }]
                data['record'].push({ 'name' : $("input[name=find_first_name_1]").val(),
                                      'age' : $("input[name=your_age_1]").val(),
                                      'gender' : $("input[name=find-place-for-gender_1]:checked").val()
                                    })
                //console.log(data)
            }

            if (find_pace_for == "group")
            {
                data['place_for'] = find_pace_for
                data['record'] = [{ 'name' : $("input[name=find_first_name_0]").val(),
                                      'age' : $("input[name=your_age_0]").val(),
                                      'gender' : $("input[name=find-place-for-gender_0]:checked").val()
                                    }]
                data['record'].push({ 'name' : $("input[name=find_first_name_2]").val(),
                                      'age' : $("input[name=your_age_2]").val(),
                                      'gender' : $("input[name=find-place-for-gender_2]:checked").val()
                                    })

                var record=3;
                $(".custom_me_group").each(function(index)
                {
                    data['record'].push({
                                      'name' : $("input[name=find_first_name_2"+(index+1).toString()+"]").val(),
                                      'age' : $("input[name=your_age_2"+(index+1).toString()+"]").val(),
                                      'gender' : $("input[name=find-place-for-gender_2"+(index+1).toString()+"]:checked").val()
                                    })
                    record+=1
                })
                //console.log(data)
                //console.log($(".custom_me_group"))
            }



//            data['record'].push({'user_image':$("#user_image").val()})
            record_array[0]['about_you'] = data
            if (user_array_image)
                data['record'][0]['user_image'] =user_array_image
//                record_array[0]['property_images'] = user_array_image
            localStorage.setItem('find_place_record', JSON.stringify(record_array));
            //console.log('Local Storage by Sagar : ',localStorage.getItem('find_place_record'))

            //console.log('RRRRRR ::' ,localStorage.getItem('find_place_record'))


//            alert("Page")
//            event.preventDefault()

        });


function remove_div_for_group()
{
    //console.log ("In template remove_div_for_group")
    $($(document).find('.me_group')).each(function(index)
    {
//        if ($(this).find("input[name='find_first_name_1']").length == 0)
//        $(this).remove()
        if (!$('.me_group').hasClass("d-none"))
            $('.me_group').addClass("d-none")
    });
}

$(".find_place_for_option").on('click','input:radio',function() {
    //console.log ("In template /find-place/describe-your-ideal-place/introduce-flatmates")

//    console.log ("-------asffffffffsdgsd zsfsf----",$(this).val())
    toggle_about_you_button()

    if (($(this).val()) == 'me')
    {
        remove_div_for_group()
        if (!$('.me_group').hasClass("d-none"))
            $('.me_group').addClass("d-none")
        if (!$('.me_couple').hasClass("d-none"))
            $('.me_couple').addClass("d-none")
        if (!$('.button_for_add_another_person').hasClass("d-none"))
            $('.button_for_add_another_person').addClass("d-none")
        $('.me_couple_group').removeClass("d-none")
    }

    if (($(this).val()) == 'couple')
    {
        remove_div_for_group()
        if (!$('.me_group').hasClass("d-none"))
            $('.me_group').addClass("d-none")
        if (!$('.button_for_add_another_person').hasClass("d-none"))
            $('.button_for_add_another_person').addClass("d-none")
        $('.me_couple_group').removeClass("d-none")
        $('.me_couple').removeClass("d-none")
    }

    if (($(this).val()) == 'group')
    {
        if (!$('.me_couple').hasClass("d-none"))
            $('.me_couple').addClass("d-none")
        $('.me_couple_group').removeClass("d-none")
        $('.me_group').removeClass("d-none")
        $('.button_for_add_another_person').removeClass("d-none")

    }
  });

$(document).on('keyup change click','.me_couple_group, .me_couple, .me_group, .custom_me_group','input',toggle_about_you_button)

function toggle_about_you_button()
{
    if ($(".find_place_for_option").find("input:checked").val() == 'me')
        if ($("input[name=find_first_name_0]").val()!="" &&
            $("input[name=your_age_0]").val()!="" &&
            $("input[name=find-place-for-gender_0]").is(":checked") == true)
                $('.about_rooms_bttn').prop("disabled",false)
        else
            $('.about_rooms_bttn').prop("disabled",true)

    if ($(".find_place_for_option").find("input:checked").val() == 'couple')
        if ($("input[name=find_first_name_0]").val()!="" &&
            $("input[name=your_age_0]").val()!=""  &&
            $("input[name=find-place-for-gender_0]").is(":checked") == true &&
            $("input[name=find_first_name_1]").val()!="" &&
            $("input[name=your_age_1]").val()!="" &&
            $("input[name=find-place-for-gender_1]").is(":checked") == true)
                $('.about_rooms_bttn').prop("disabled",false)
        else
            $('.about_rooms_bttn').prop("disabled",true)

    if ($(".find_place_for_option").find("input:checked").val() == 'group')
    {
        //console.log ("Inside group ")
        var data_length = 0
        var group_div_length = $('.decribe-place').find('.custom_me_group').length
        if ($("input[name=find_first_name_0]").val()!="" &&
            $("input[name=your_age_0]").val()!=""  &&
            $("input[name=find-place-for-gender_0]").is(":checked") == true &&
            $("input[name=find_first_name_2]").val()!="" &&
            $("input[name=your_age_2]").val()!="" &&
            $("input[name=find-place-for-gender_2]").is(":checked") == true)
            {
                if ($('.custom_me_group').length == 0)
                    $('.about_rooms_bttn').prop("disabled",false)
                else
                {

                    $($(document).find('.custom_me_group')).each(function(index)
                    {
                        if ($("input[name=find_first_name_2"+(index+1).toString()+"]").val()!="" &&
                            $("input[name=your_age_2"+(index+1).toString()+"]").val()!=""  &&
                            $("input[name=find-place-for-gender_2"+(index+1).toString()+"]").is(":checked") == true)
                                data_length+=1
                    })

                    if (group_div_length == data_length)
                        $('.about_rooms_bttn').prop("disabled",false)
                    else
                        $('.about_rooms_bttn').prop("disabled",true)
                }
            }
        else
            $('.about_rooms_bttn').prop("disabled",true)
    }
}




$(document).on('click','.button_for_add_another_person',function()
{
//    console.log ("Hi i m inside another person",)

//    console.log ("dffffffffffff-------------------ffffgdfgfdgfdgd",$('.custom_me_group').length)
    var group_div_length = $('.decribe-place').find('.custom_me_group').length
    var last_group_div = $(document).find('.me_group').last()
//    console.log ("Hi i m inside another person",last_group_div)

    var open_me_group_div ='<div class="me_group custom_me_group"><hr/>'
    var close_me_group_div ='</div>'

    var friends_first_name_div = '<div class="form-group"><span class="mb-1">Your friend\'s first name</span><input type="text" class="form-control mt-2" id="find-first-name" name="find_first_name_2'+(group_div_length+1).toString()+'" placeholder="" /></div>'
    var friends_age_div = '<div class="form-group"><span>Your friend\'s age</span><div><input type="text" class="form-control mt-2 weekly-rent-input" id="find-your-age" name="your_age_2'+(group_div_length+1).toString()+'" value="" maxlength="2"/></div></div>'
    var friends_gender_div = '<div class="form-group"><span class="mb-1">The gender your friend identifies with</span><div class="total-bedrooms mt-2"><label class="radio-inline btn bedroom-btn"><input type="radio" value="female" name="find-place-for-gender_2'+(group_div_length+1).toString()+'" id="find-place-for-gender_2'+(group_div_length+1).toString()+'"/>Female</label><label class="radio-inline btn bedroom-btn"><input type="radio" value="male" name="find-place-for-gender_2'+(group_div_length+1).toString()+'" id="find-place-for-gender_2'+(group_div_length+1).toString()+'"/>Male</label></div></div>'

//    <div class="form-group">
//    <span class="mb-1">
//    The gender your friend identifies with
//    </span>
//    <div class="total-bedrooms mt-2">
//    <label class="radio-inline btn bedroom-btn">
//    <input type="radio" value="female" name="find-place-for-gender_2'+(group_div_length+1).toString()+'" id="find-place-for-gender_2'+(group_div_length+1).toString()+'"/>
//    Female
//    </label>
//    <label class="radio-inline btn bedroom-btn">
//    <input type="radio" value="male" name="find-place-for-gender2'+(group_div_length+1).toString()+'" id="find-place-for-gender_2'+(group_div_length+1).toString()+'"/>
//    Male
//    </label>
//    </div>
//    </div>'
    var remove_btn_div = '<div class="row"><div class="mt-4 mx-auto"><button type="button"class="btn btn-primary btn-transparent p16-blue remove_another_person">Remove</button></div></div>'

    var new_div = open_me_group_div+friends_first_name_div+friends_age_div+friends_gender_div+remove_btn_div+close_me_group_div
    last_group_div.after(new_div)

    $('.about_rooms_bttn').prop("disabled",true)
//    console.log ("dffffffffffff-------------------ffffgdfgfdgfdgd",$('.custom_me_group').length)
//    console.log (group_div_length)
})

 var $input3 = $("#find-your-age");
    if (window_pathname.includes('introduce-flatmates') && $input3)
    {
                 if ($input3.val().length == 0 )
                {
                    $('.styles__errorMessage4').hide();
                }
        //console.log ("In general statement if (window_pathname.includes('about-property'))")
        if ($input3.val() < 16)
            $('.about_rooms_bttn').prop("disabled", true)
    }
    $input3.on('keyup', function (){

        if ($input3.val() >= 16 )
            {
                $('.styles__errorMessage4').hide();
                // Code added by dhrup
                $('#find-your-age').removeClass("border-red");
            }

        if ($input3.val() < 16 )
            {
                $('.styles__errorMessage4').show();
                // Code added by dhrup
                $('#find-your-age').addClass("border-red");
                $('.about_rooms_bttn').prop("disabled", true)
            }
        else
            {
                $('.styles__errorMessage4').hide();
                // Code added by dhrup
                $('#find-your-age').removeClass("border-red");
            }
    });

$(document).on('click','.remove_another_person',function()
{
    //console.log($(this).closest("div.me_group"))
    $(this).closest("div.me_group").remove();
});
//  = --------------  End of Validations for /list-place/share-house/flatmate-preference  -------------- =

//    /find-place/describe-your-ideal-place/employment
$(".find_employment-status").click(function()
  {
    //console.log ($(this))
    var active_state = $(this).hasClass("accommodation-listing-item-active")

    if (active_state == true)
    {
        $(this).find(".active_tick_icon").remove()
        $(this).find("input[name='employment_status']").attr("checked",false)
        $(this).removeClass("accommodation-listing-item-active")
        $(this).find("path").removeAttr('class','active_svg_icon');
        $(this).addClass("items-cirle-hover")
    }
    else
    {
        $('<div class="active_tick_icon"></div>').prependTo($(this))
        $(this).find("input[name='employment_status']").attr("checked","checked")
        $(this).addClass("accommodation-listing-item-active")
        $(this).find("path").attr('class', 'active_svg_icon');
        $(this).removeClass("items-cirle-hover")
    }
  });

    $(".life-style").click(function()
  {
    var active_state = $(this).hasClass("accommodation-listing-item-active")

    if (active_state == true)
    {
        $(this).find(".active_tick_icon").remove()
        $(this).find("input[name='lifestyle']").attr("checked",false)
        $(this).removeClass("accommodation-listing-item-active")
        $(this).find("path").removeAttr('class','active_svg_icon');
        $(this).addClass("items-cirle-hover")
    }
    else
    {
        $('<div class="active_tick_icon"></div>').prependTo($(this))
        $(this).find("input[name='lifestyle']").attr("checked","checked")
        $(this).addClass("accommodation-listing-item-active")
        $(this).find("path").attr('class', 'active_svg_icon');
        $(this).removeClass("items-cirle-hover")
    }
  });


    $(document).ready(function () {

      $("#mySingleFieldTags").tagit();
//    $("#mySingleFieldTags").tagit({
//        availableTags: sampleTags
//    });
    });


});// End of document
});// End of Odoo Deine
