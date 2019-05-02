odoo.define('pragtech_flatmates.accommodation_page', function (require) {

$(document).ready(function() {


    $(".go_back").on("click", function()
    {
      window.history.back();
    });

    //Validation for "What type of accommodation are you offering?" page



//    });
   $("input[name=property_type_input]").on("change", function(){
    if($("input[name=property_type_input]").is(":checked") == true){
            $('.accommodation-next-btn').prop("disabled", false);
   }
   else {
            $('.accommodation-next-btn').prop("disabled", true);
   }
    });


    function toggle_property_submit_button(state)
    {
    if (state)
        $('#propert_submit_btn').prop("disabled", false);
    else
        $('#propert_submit_btn').prop("disabled", true);
    }

//    //Validation for "About the property" page
//    $("input[id='autocomplete']").on("keyup", function(){
//        if($(this).val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != ""){
//            $('#propert_submit_btn').prop("disabled", false);
//        } else {
//            $('#propert_submit_btn').prop("disabled", true);
//        }
//    });
//
//    $("input[name=bed_rooms]").on("change", function(){
//
//        if($("input[id='autocomplete']").val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != ""){
//            $('#propert_submit_btn').prop("disabled", false);
//        } else {
//            $('#propert_submit_btn').prop("disabled", true);
//        }
//    });
//
//    $("input[name=bath_rooms]").on("change", function(){
//
//        if($("input[id='autocomplete']").val() != "" && $("input[name=bath_rooms]").is(":checked") == true && $("input[name=bed_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != ""){
//            $('#propert_submit_btn').prop("disabled", false);
//        } else {
//            $('#propert_submit_btn').prop("disabled", true);
//        }
//    });


    function generic_about_property()
    {
    if (window.location.pathname == '/listplace/whole-property/about')
    {
        var room_type = JSON.parse(localStorage.getItem('list_place_array'));
        console.log ("5555555555555555555666666666666666666666")
        if (room_type[0]['whole_property_property_type'] == '1_bedrooms'|| room_type[0]['whole_property_property_type'] == 'studio')
            {
            console.log ("555555555555555555566666666666666666666677777777777777",$("input[name=room_furnishing_types]").is(":checked"))
            toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("#parking").val() != ""  && $("#internet").val() != "" && $("input[name=room_furnishing_types]").is(":checked") == true)
            }
        else
            {console.log ("5555555555555555555666666666666666666666777777777777779999999")
            toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != "" && $("input[name=room_furnishing_types]").is(":checked") == true)}
    }
        else
            toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != "")
    }

//        if($("input[id='autocomplete']").val() != "" && $("input[name=bath_rooms]").is(":checked") == true && $("input[name=bed_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != ""){
//            $('#propert_submit_btn').prop("disabled", false);
//        } else {
//            $('#propert_submit_btn').prop("disabled", true);
//        }
//    });


    //Validation for "About the property" page
    $("input[id='autocomplete']").on("keyup", function(){ generic_about_property() });
    $("input[name=bed_rooms]").on("change", function(){ generic_about_property() });
    $("input[name=bath_rooms]").on("change", function(){ generic_about_property() });
    $("select[id=parking]").on("change", function(){ generic_about_property() });
    $("select[id=internet]").on("change", function(){ generic_about_property() });
    $("input[name=room_furnishing_types]").on("change", function(){ generic_about_property() });

// Dont Delete this code
//    $(".room_furnishing_in_about").on("change", "input:radio", function()
//    {
//        console.log("In right funct")
//        $(this).parent().addClass("bedroom-btn-active") //Add class wrong to the label
//        $(this).parent().siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.
//        $(this).parents().find('input').attr('checked',false)
//        $(this).parent().find('input').attr('checked',true)
//    });


//        if($("input[id='autocomplete']").val() != "" && $("input[name=bath_rooms]").is(":checked") == true && $("input[name=bed_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != ""){
//            $('#propert_submit_btn').prop("disabled", false);
//        } else {
//            $('#propert_submit_btn').prop("disabled", true);
//        }
//    });


    //Validation for "Who currently lives in the property" page
    $("input[name=total_no_of_flatmates]").on("change", function(){
        if($("input[name=total_no_of_flatmates]").is(":checked") == true){
            $('.currnt_live_in_proprty_bttn').prop("disabled", false);
        } else {
            $('.currnt_live_in_proprty_bttn').prop("disabled", true);
        }
    });

    //Validation for "Rent, bond and bills" page
    $("input[id='weekly_rent']").on("keyup", function(){

        if($(this).val() != "" && $("#bond").val() != "" && $("#bill").val() != ""){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });

    $("select[id='bond']").on("change", function(){

        if($("#bond").val() != "" && $("#bill").val() != "" && $("#weekly_rent").val() != ""){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });

    $("select[id='bill']").on("change", function(){

        if($("#bill").val() != "" && $("#bond").val() != "" && $("#weekly_rent").val() != ""){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });


    //Validation for "Room availability" page
    $(".datepicker").on("change", function(){
        console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG ',$('.datepicker').val())
        console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRR',$("#min_len_stay").val())
        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',$("#max_len_stay").val())
        if($(".datepicker").val() != "" && $("#min_len_stay").val() != "" && $("#max_len_stay").val() != ""){
            $('.room-avail-btn').prop("disabled", false);
        } else {
            $('.room-avail-btn').prop("disabled", true);
        }
    });

    $("select[id='min_len_stay']").on("change", function(){
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',$(".datepicker").val())
        if($("#min_len_stay").val() != "" && $("#max_len_stay").val() != "" && $(".datepicker").val() != ""){
            $('.room-avail-btn').prop("disabled", false);
        } else {
            $('.room-avail-btn').prop("disabled", true);
        }
    });

    $("select[id='max_len_stay']").on("change", function(){
        if($("#max_len_stay").val() != "" && $("#min_len_stay").val() != "" && $(".datepicker").val() != ""){
            $('.room-avail-btn').prop("disabled", false);
        } else {
            $('.room-avail-btn').prop("disabled", true);
        }
    });


    //Validation for What type of property is this? Page
    $("input[name=whole_property_property_type]").on("change", function(){
     console.log('whole_property_property_type Page :::')
    if($("input[name=whole_property_property_type]").is(":checked") == true){
            $('.whole-property-type-next-btn').prop("disabled", false);
   }
   else {
            $('.whole-property-type-next-btn').prop("disabled", true);
   }
    });


//////////////////////////////////////////////////////////////////////
// Date Picker code added on Room availability Page in List My Place

$("#txtdate").datepicker({
                minDate: 0
            });

/////////////////////////////////////////////////////////////////////


});
});