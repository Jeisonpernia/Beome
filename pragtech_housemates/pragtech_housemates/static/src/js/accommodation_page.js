odoo.define('pragtech_flatmates.accommodation_page', function (require) {

$(document).ready(function() {





    function toggle_property_submit_button(state)
    {
    if (state)
        $('#propert_submit_btn').prop("disabled", false);
    else
        $('#propert_submit_btn').prop("disabled", true);
    }


    function generic_about_property()
    {
    // Code added by dhrup
        if (window.location.pathname == '/listplace/whole-property/about')
        {
            var room_type = JSON.parse(localStorage.getItem('list_place_array'));
            //console.log ("5555555555555555555666666666666666666666",$("#parking :selected").text())
            if (room_type[0]['whole_property_property_type'] == '1_bedrooms'|| room_type[0]['whole_property_property_type'] == 'studio')
            {
                //console.log ("555555555555555555566666666666666666666677777777777777",$("input[name=room_furnishing_types]").is(":checked"))
                toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("#parking").val() != ""  && $("#internet").val() != "" && $("#parking :selected").text() != "Select" &&  $("#internet :selected").text() != "Select" && $("input[name=room_furnishing_types]").is(":checked") == true)
            }
            else
            {
                //console.log ("5555555555555555555666666666666666666666777777777777779999999")
                toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking").val() != "" && $("#internet").val() != "" && $("#parking :selected").text() != "Select" && $("#internet :selected").text() != "Select" && $("input[name=room_furnishing_types]").is(":checked") == true)
            }
        }
            else{
                toggle_property_submit_button($("input[id='autocomplete']").val() != "" && $("input[name=bed_rooms]").is(":checked") == true && $("input[name=bath_rooms]").is(":checked") == true && $("#parking :selected").val() != "Select" && $("#internet :selected").val() != "Select" )
            }

    }


    //Validation for "About the property" page
    $("input[id='autocomplete']").on("keyup", function(){ generic_about_property() });
    $("input[name=bed_rooms]").on("change", function(){ generic_about_property() });
    $("input[name=bath_rooms]").on("change", function(){ generic_about_property() });
    $("select[id=parking]").on("change", function(){ generic_about_property() });
    $("select[id=internet]").on("change", function(){ generic_about_property() });
    $("input[name=room_furnishing_types]").on("change", function(){ generic_about_property() });


   $("input[name=property_type_input]").on("change", function()
   {
        if($("input[name=property_type_input]").is(":checked") == true)
        {
            $('.accommodation-next-btn').prop("disabled", false);
        }
        else
        {
            $('.accommodation-next-btn').prop("disabled", true);
        }
    });

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

        if($(this).val() != "" && $(this).val() < 10000 && $("#bond").val() != "" && $("#bill").val() != ""){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });
//    $('.tags_input').on("keyup", function(){
//        var tagcontainer = $('.tags_container')
//        console.log(" taggggggggg 12 : ",tagcontainer[0].childElementCount)
//        if(tagcontainer[0].childElementCount == 0){
//            $('.propert_submit_btn').prop('disabled', false);
//        }
//
//    })

    $("select[id='bond']").on("change", function(){

        if($("#bond").val() != "" && $("#bill").val() != "" && $("#weekly_rent").val() != "" && $("#weekly_rent").val() < 10000){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });

    $("select[id='bill']").on("change", function(){

        if($("#bill").val() != "" && $("#bond").val() != "" && $("#weekly_rent").val() != "" && $("#weekly_rent").val() < 10000){
            $('.rent-bond-bill-btn').prop("disabled", false);
        } else {
            $('.rent-bond-bill-btn').prop("disabled", true);
        }
    });


    //Validation for "Room availability" page
    $(".datepicker").on("change", function(){
        //console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG ',$('.datepicker').val())
        //console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRR',$("#min_len_stay").val())
        //console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',$("#max_len_stay").val())
        if($(".datepicker").val() != "" && $("#min_len_stay").val() != "" && $("#max_len_stay").val() != ""){
            $('.room-avail-btn').prop("disabled", false);
        } else {
            $('.room-avail-btn').prop("disabled", true);
        }
    });

    $("select[id='min_len_stay']").on("change", function(){
        //console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',$(".datepicker").val())
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
     //console.log('whole_property_property_type Page :::')
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
                minDate: 0,
                dateFormat: 'dd MM yy',
                showOn: "button",
                buttonImage: "/pragtech_housemates/static/src/img/calendar-icon.png",
                buttonImageOnly: true,
            });
$('#txtdate').click(function(){
    $('#txtdate').datepicker('show');
});
/////////////////////////////////////////////////////////////////////


});
});