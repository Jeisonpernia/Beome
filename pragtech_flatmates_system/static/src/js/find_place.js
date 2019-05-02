odoo.define('pragtech_flatmates.find_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";
//  ======================================================
//  = --------------  General Statements  -------------- =
//  ======================================================
//  Note: These below statement get executed if we hit
//  any of the path mention in if condition



//  = --------------  End of General Statements  -------------- =


//  =============================================================================================================
//  = --------------  Validations for /find-place/describe-your-ideal-place/introduce-flatmates  -------------- =
//  =============================================================================================================
//  Note: Check whether this js is not visible on other pages mentioned in a comment above

function remove_div_for_group()
{
    console.log ("In template remove_div_for_group")
    $($(document).find('.me_group')).each(function(index)
    {
        if ($(this).find("input[name='find_first_name_1']").length == 0)
        $(this).remove()
    });
}

$(".find_place_for_option").on('click','input:radio',function() {
    console.log ("In template /find-place/describe-your-ideal-place/introduce-flatmates")

//    console.log ("-------asffffffffsdgsd zsfsf----",$(this).val())

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
        $('.button_for_add_another_person').removeClass("d-none")
        $('.me_couple_group').removeClass("d-none")
        $('.me_group').removeClass("d-none")

    }
  });

$(document).on('click','.button_for_add_another_person',function()
{
//    console.log ("Hi i m inside another person",)

    var group_div_length = $('.decribe-place').find('.me_group').length
    var last_group_div = $(document).find('.me_group').last()
//    console.log ("Hi i m inside another person",last_group_div)

    var open_me_group_div ='<div class="me_group"><hr/>'
    var close_me_group_div ='</div>'

    var firends_first_name_div = '<div class="form-group"><span class="mb-1">Your friend\'s first name</span><input type="text" class="form-control mt-2" id="find-first-name" name="find_first_name_'+(group_div_length+1).toString()+'" placeholder="" /></div>'
    var firends_age_div = '<div class="form-group"><span>Your friend\'s age</span><div><input type="text" class="form-control mt-2 weekly-rent-input" id="find-your-age" name="your_age_'+(group_div_length+1).toString()+'" value=""/></div></div>'
    var firends_gender_div = '<div class="form-group"><span class="mb-1">The gender your friend identifies with</span><div class="total-bedrooms mt-2"><label class="radio-inline btn bedroom-btn"><input type="radio" name="find-place-for-gender_'+(group_div_length+1).toString()+'"/>Female</label><label class="radio-inline btn bedroom-btn"><input type="radio" name="find-place-for-gender_'+(group_div_length+1).toString()+'"/>Male</label></div></div>'
    var remove_btn_div = '<div class="row"><div class="mt-4 mx-auto"><button type="button"class="btn btn-primary btn-transparent p16-blue remove_another_person">Remove</button></div></div>'

    var new_div = open_me_group_div+firends_first_name_div+firends_age_div+firends_gender_div+remove_btn_div+close_me_group_div
    last_group_div.after(new_div)
//    console.log (group_div_length)
})

$(document).on('click','.remove_another_person',function()
{
    console.log($(this).closest("div.me_group"))
    $(this).closest("div.me_group").remove();
});
//  = --------------  End of Validations for /list-place/share-house/flatmate-preference  -------------- =

});// End of document
});// End of Odoo Deine
