odoo.define('pragtech_flatmates.list_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";
//  ======================================================
//  = --------------  General Statements  -------------- =
//  ======================================================
//  Note: These below statement get executed if we hit
//  any of the path mention in if condition

    var window_pathname = window.location.pathname

    if (window_pathname.includes('about-others'))
    {
        console.log ("In general statement if (window_pathname.includes('about-others'))")
        if ($(this).find("#comment").val().length<10)
            $('.about-others-nxt-btn').prop("disabled", true)
    }

    if (window_pathname.includes('about-property'))
    {
        console.log ("In general statement if (window_pathname.includes('about-property'))")
        if ($(this).find("#comment").val().length<10)
            $('.about-property-nxt-btn').prop("disabled", true)
    }

   if (window.location.pathname == '/listplace/whole-property/about')
    {

        console.log ("In general statement if (window.location.pathname == '/listplace/whole-property/about'))")
        var room_type = JSON.parse(localStorage.getItem('list_place_array'));

        if (room_type[0]['whole_property_property_type'] == '1_bedrooms' || room_type[0]['whole_property_property_type'] == 'studio')
        {
            $('.about_total_bedrooms').addClass('d-none');
            $('.about_total_bathrooms').addClass('d-none')
        }

    }

    if (window.location.pathname == '/listplace/share-house/flatmate-preference')
    {
        console.log ("In general statement if (window.location.pathname == '/listplace/share-house/flatmate-preference')",$(document).find('input[name="flatmate_Preference_type"]:checked'))
        if ($(document).find('input[name="flatmate_Preference_type"]:checked').length == 0)
            $(".flatmate-pref-nxt-btn").prop("disabled",false)
//        else

    }


//  = --------------  End of General Statements  -------------- =


//  ===============================================================================================
//  = --------------  Validations for /list-place/share-house/flatmate-preference  -------------- =
//  ===============================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above

  $(".bedroom-btn > input[name='flatmate_Preference_type']:radio").click(function() {
    console.log ("In template /list-place/share-house/flatmate-preference")

    if (!$(this).parents().find('.show_females_only').hasClass('d-none'))
        $(this).parents().find('.show_females_only').addClass('d-none')

    if ($(this).val() == 'females_only')
        $(this).parents().find('.show_females_only').removeClass('d-none')

    $(this).parent().addClass("bedroom-btn-active")
    $(this).attr('checked','checked')
    $(".bedroom-btn > input[value!='"+$(this).val()+"']:radio").parent().removeClass("bedroom-btn-active");
    $(".bedroom-btn > input[value!='"+$(this).val()+"']:radio").attr('checked',false)

    $(".flatmate-pref-nxt-btn").prop("disabled",false)

  });

//  = --------------  End of Validations for /list-place/share-house/flatmate-preference  -------------- =


//  =======================================================================================
//  = --------------  Validations for /listplace/share-house/about-others  -------------- =
//  = -------------  Validations for /listplace/share-house/about-property  ------------- =
//  =======================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above

    $("#comment").keyup(function()
    {
//        console.log ($(this).val().length)
        console.log ("In template /listplace/share-house/about-others -- or -- /listplace/share-house/about-property")
        var window_pathname = window.location.pathname
        if ($(this).val().length < 10)
        {

            if (window_pathname.includes("about-others"))
                $('.about-others-nxt-btn').prop("disabled", true)
            if (window_pathname.includes("about-property"))
                $('.about-property-nxt-btn').prop("disabled", true)
        }
        else
        {
            if (window_pathname.includes("about-others"))
                $('.about-others-nxt-btn').prop("disabled", false)
            if (window_pathname.includes("about-property"))
                $('.about-property-nxt-btn').prop("disabled", false)
        }
    });

//  = --------------  End of Validations for /listplace/share-house/about-others  -------------- =
//  = -------------  End of Validations for /listplace/share-house/about-property  ------------- =


});// End of document
});// End of Odoo Deine
