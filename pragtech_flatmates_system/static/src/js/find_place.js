odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";

     var window_pathname = window.location.pathname


    if (window_pathname.includes('about-yourself'))
    {
        console.log ("In general statement if (window_pathname.includes('about-yourself'))")
        if ($(this).find("#find_comment").val().length<10)
            $('.find-publish').prop("disabled", true)
        else
            $('.find-publish').prop("disabled", false)
    }

    $("#find_comment").keyup(function()
    {
        console.log ("In template /find-place/describe-your-ideal-place/about-yourself")
        var window_pathname = window.location.pathname
        if ($(this).val().length < 10)
            $('.find-publish').prop("disabled", true)
        else
            $('.find-publish').prop("disabled", false)
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
       console.log($(this).parent())
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
console.log("Righttt")
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


//  =============================================================================================================
//  = --------------  Validations for /find-place/describe-your-ideal-place/introduce-flatmates  -------------- =
//  =============================================================================================================
//  Note: Check whether this js is not visible on other pages mentioned in a comment above

function remove_div_for_group()
{
    console.log ("In template remove_div_for_group")
    $($(document).find('.me_group')).each(function(index)
    {
//        if ($(this).find("input[name='find_first_name_1']").length == 0)
//        $(this).remove()
        if (!$('.me_group').hasClass("d-none"))
            $('.me_group').addClass("d-none")
    });
}

$(".find_place_for_option").on('click','input:radio',function() {
    console.log ("In template /find-place/describe-your-ideal-place/introduce-flatmates")

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
        console.log ("Inside group ")
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
    var friends_age_div = '<div class="form-group"><span>Your friend\'s age</span><div><input type="text" class="form-control mt-2 weekly-rent-input" id="find-your-age" name="your_age_2'+(group_div_length+1).toString()+'" value=""/></div></div>'
    var friends_gender_div = '<div class="form-group"><span class="mb-1">The gender your friend identifies with</span><div class="total-bedrooms mt-2"><label class="radio-inline btn bedroom-btn"><input type="radio" name="find-place-for-gender_2'+(group_div_length+1).toString()+'"/>Female</label><label class="radio-inline btn bedroom-btn"><input type="radio" name="find-place-for-gender2'+(group_div_length+1).toString()+'"/>Male</label></div></div>'
    var remove_btn_div = '<div class="row"><div class="mt-4 mx-auto"><button type="button"class="btn btn-primary btn-transparent p16-blue remove_another_person">Remove</button></div></div>'

    var new_div = open_me_group_div+friends_first_name_div+friends_age_div+friends_gender_div+remove_btn_div+close_me_group_div
    last_group_div.after(new_div)

    $('.about_rooms_bttn').prop("disabled",true)
//    console.log ("dffffffffffff-------------------ffffgdfgfdgfdgd",$('.custom_me_group').length)
//    console.log (group_div_length)
})

$(document).on('click','.remove_another_person',function()
{
    console.log($(this).closest("div.me_group"))
    $(this).closest("div.me_group").remove();
});
//  = --------------  End of Validations for /list-place/share-house/flatmate-preference  -------------- =

//    /find-place/describe-your-ideal-place/employment
$(".find_employment-status").click(function()
  {
    console.log ($(this))
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
});// End of document
});// End of Odoo Deine
