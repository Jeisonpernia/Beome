//<<<<<<< 73c592ab737ec37b97b027058a04268cfc2b7408
odoo.define('pragtech_flatmates.search', function (require) {
//console.log("\nggggg")


$(document).ready(function() {

//$('input').focus(function(){
//  console.log ("In jsssssssssssssssssssss", $(this).siblings())
//  $(this).siblings().addClass('focused')
//});
//
//$('input').blur(function(){
//  var inputValue = $(this).val();
//  if ( inputValue == "" )
//    $(this).siblings().removeClass('focused');
//})

$('.search-dropdown-menu').scroll(function() {
    console.log ("Inside Scrolllllllllllllllllllll")
    //    $( "#frdate" ).datepicker( "destroy" );
    $('#room_avail_date_id').datepicker('hide')
    $('#room_avail_date_id').blur();
})

$('.show-checkbox-dropdown').on('click',function()
{
    //console.log(')))))))))))))))))',$(this).siblings('.options'))
    var show_options = $(this).siblings('.options')
    //console.log(')))))))))))))))))',show_options)
    if (show_options.hasClass("hidden"))
        show_options.removeClass("hidden")
    else
        show_options.addClass("hidden")

})

    $('.dropdown').on('click','.search-mode-rooms,.search-mode-flatmates',function(){
//                console.log(')))))))))))))))))',$(this).attr('class'))
                var class_name= $(this).attr('class')


                $.ajax({
                        url:'/load/search/data',
                        type:'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'type':$(this).attr('class')}}),
                        success: function(data){
                            //console.log('88888888888888888888888 ',data)
                            //room types



                        if (class_name == 'search-mode-flatmates')
                        {
                            var options = $(document).find('#find_property_type')
                            if (options.find('option').length == 0)
                            {
                            $("#search_value").val("search_flatmates")

                            $(".search-text").text("Search Flatmates")
                            property_types = data['result']['property_types']


                            for(var i=0;i<property_types.length;i++)
                            {

                                var property_type = property_types[i]
                                $('#find_property_type').append('<option disabled selected hidden>People Looking For</option><option value='+property_type[0]+'>'+property_type[1]+'</option>')
                            }
                            }
                             var options = $(document).find('#find_min_stay')
                            if (options.find('option').length == 0)
                            {

                            min_stay = data['result']['min_stay']
                            for(var i=0;i<min_stay.length;i++)
                            {
                                var minstay = min_stay[i]
                                //console.log('min_stay :',minstay)
                                $('#find_min_stay').append('<option disabled selected hidden>Min Stay</option><option value='+minstay[0]+'>'+minstay[1]+'</option>')
                            }
                            }
                             var options = $(document).find('#find_max_stay')
                            if (options.find('option').length == 0)
                            {

                            max_stay = data['result']['max_stay']
                            for(var i=0;i<max_stay.length;i++)
                            {
                                var maxstay = max_stay[i]
                                //console.log('min_stay :',max_stay)
                                $('#find_max_stay').append('<option disabled selected hidden>Max Stay</option><option value='+maxstay[0]+'>'+maxstay[1]+'</option>')
                            }
                            }

                        }

                        if (class_name == 'search-mode-rooms')
                        {
                            $("#search_value").val("search_rooms")
                            $(".search-text").text("Search Rooms")

                            var options = $(document).find('#search_room_type_id')
                            if (options.find('option').length == 1)
                            {
                            room_types = data['result']['room_types']
                            for(var i=0;i<room_types.length;i++){
                                var room = room_types[i]
                                //console.log('rooms :',room)
                                $('#search_room_type_id').append('<option value='+room[0]+'>'+room[1]+'</option>')
                            }
                            }

                            //bathroom types
                            var options = $(document).find('#search_room_bathroom_type_id')
                            if (options.find('option').length == 1)
                            {
                            bathroom_types = data['result']['bathroom_types']
                            for(var i=0;i<bathroom_types.length;i++){
                                var bathroom_type = bathroom_types[i]
                                //console.log('Bathroom type :',bathroom_type)
                                $('#search_room_bathroom_type_id').append('<option value='+bathroom_type[0]+'>'+bathroom_type[1]+'</option>')
                            }
                            }

                            //room furnishing type
                            var options = $(document).find('#search_room_furnsh_type_id')
                            if (options.find('option').length == 1)
                            {
                            room_furnishing_types = data['result']['room_furnishing_types']
                            for(var i=0;i<room_furnishing_types.length;i++){
                                var room_furnishing_type = room_furnishing_types[i]
                                //console.log('Room Furnishing type :',room_furnishing_type)
                                $('#search_room_furnsh_type_id').append('<option value='+room_furnishing_type[0]+'>'+room_furnishing_type[1]+'</option>')
                            }
                            }

                            //Max stay length
                             var options = $(document).find('#search_stay_len_id')
                            if (options.find('option').length == 1)
                            {
                            max_len_stay = data['result']['max_len_stay']
                            for(var i=0;i<max_len_stay.length;i++){
                                var max_stay = max_len_stay[i]
                                //console.log('stay type :',max_stay)
                                $('#search_stay_len_id').append('<option value='+max_stay[0]+'>'+max_stay[1]+'</option>')
                            }
                            }

                            //Parking type
                            var options = $(document).find('#search_room_parking_type_id')
                            if (options.find('option').length == 1)
                            {
                            parking_types = data['result']['parking_types']
                            for(var i=0;i<parking_types.length;i++){
                                var parking_type = parking_types[i]
                                //console.log('parking type :',parking_type)
                                $('#search_room_parking_type_id').append('<option value='+parking_type[0]+'>'+parking_type[1]+'</option>')
                            }
                            }

                            //available bedrooms
                            var options = $(document).find('#search_avail_bedrooms_id')
                            if (options.find('option').length == 1)
                            {
                            bedrooms = data['result']['bedrooms']
                            for(var i=0;i<bedrooms.length;i++){
                                var bedroom = bedrooms[i]
                                //console.log('Bedroom :',bedroom)
                                $('#search_avail_bedrooms_id').append('<option value='+bedroom[0]+'>'+bedroom[1]+'</option>')
                            }
                            }
                            var options = $(document).find('#search_list_accomodation')
                            if (options.find('div').length == 0)
                            {
                            property_types = data['result']['property_types']
                            for(var i=0;i<property_types.length;i++){
                                var property_type = property_types[i]
                                //console.log('property_types :',property_type)
                               $('#search_list_accomodation').append('<div class="input round-dot"><input id="'+property_type[0]+'" name="room_accommodation_'+property_type[0]+'" type="checkbox" value="'+property_type[0]+'"/><label for="'+property_type[0]+'">'+property_type[1]+'</label></div>')
                            }
                            }
                        }


	                    },
                });

})

$(document).on('click',"#search_submit_start",function()
{

//console.log("Himesh ----------------------",$("#search_value").val())
//console.log("Himesh ----------------------",$(this).find("#search_room_filter"))

    if ($("#search_value").val() == "search")
        $("#search_filter").submit()

    if ($("#search_value").val() == "search_rooms")
        $("#search_room_filter").submit()

    if ($("#search_value").val() == "search_flatmates")
        $("#search_flatmates_filter").submit()

});


$(".rooms-btn").css('display','none');
$(".flatmates-btn").css('display','none');
$(".teamups-btn").css('display','none');
$(".advanced-option").css('display','none')
$("#hide-advance-filter-rooms").css('display','none')
$("#hide-advance-filter-flatmates").css('display','none')
$("#hide-advance-filter-teamups").css('display','none')
//$('.search-btn').attr('style','background-color:#37bc9b !important')

///////////////////////////////////////////////////////////
//Set Datepicker from today date


$('#room_avail_date_id').datepicker({minDate: 0});
$('#room_avail_date_id').click(function()
{
console.log ("In sjowwwwwwwwwwww")
$('.on-active-datepicker').addClass('show')

})




//$("#search_filter_date").datepicker({
//dateFormat: 'dd/mm/yy'
//});
$('#flat_avail_date_id').datepicker({minDate: 0});
//$("#search_filter_date").datepicker({
//dateFormat: 'dd/mm/yy'
//});
$('#teamups_avail_date_id').datepicker({minDate: 0});
//$("#search_filter_date").datepicker({
//dateFormat: 'dd/mm/yy'
//});
//////////////////////////////////////////////////////////////

$("#advance-filter-rooms").click(function(event){
$(".advanced-option").css('display','block')
$("#hide-advance-filter-rooms").css('display','block')
$("#advance-filter-rooms").css('display','none')
})


$("#hide-advance-filter-rooms").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-rooms").css('display','none')
$("#advance-filter-rooms").css('display','block')
 })


$("#advance-filter-flatmates").click(function(event){
$(".advanced-option").css('display','block')
$("#hide-advance-filter-flatmates").css('display','block')
$("#advance-filter-flatmates").css('display','none')
})



$("#hide-advance-filter-flatmates").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-flatmates").css('display','none')
$("#advance-filter-flatmates").css('display','block')
})


$("#advance-filter-teamups").click(function(event){
$(".advanced-option").css('display','block')
$("#hide-advance-filter-teamups").css('display','block')
$("#advance-filter-teamups").css('display','none')
})


$("#hide-advance-filter-teamups").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-teamups").css('display','none')
$("#advance-filter-teamups").css('display','block')
})



$("#rooms").on("click", function(){
//console.log ("dfhhhaaaaadhhhhshshshsh")
$(this).attr('style', 'background-color: #e9573e !important;color : white !important')
$(".rooms-btn").css('display','block');
$(".flatmates-btn").css('display','none');
$(".teamups-btn").css('display','none');
$('#search-submit-start').css('display','none')
$('.search-room-btn').attr('style','background-color:#37bc9b !important')
$('#flatmates').removeAttr('style', 'background-color: #e9573e !important')
$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
$('.navbar').attr('style', 'background-color: #e9573e !important')
});



$("#rooms").off("click", function(){
$(this).attr('style', 'background-color: white !important;color : #e9573e !important')
$(".rooms-btn").css('display','none');
})



$("#flatmates").on("click", function(){
$(this).attr('style', 'background-color: #17a2b8 !important;color : white !important')
$(".flatmates-btn").css('display','block');
$(".rooms-btn").css('display','none');
$(".teamups-btn").css('display','none');
$('#search-submit-start').css('display','none')
$('.search-flat-btn').attr('style','background-color:#37bc9b !important')
$('#rooms').removeAttr('style', 'background-color: #e9573e !important')
$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
$('.navbar').attr('style', 'background-color: #17a2b8 !important')
});



$("#teamups").on("click", function(){
$(this).attr('style', 'background-color: #ffc107 !important;color : white !important')
$(".teamups-btn").css('display','block');
$('#search-submit-start').css('display','none')
$('.search-teamups-btn').attr('style','background-color:#37bc9b !important')
$(".flatmates-btn").css('display','none');
$(".rooms-btn").css('display','none');
var serach_button = document.getElementById("search-submit");
serach_button.value='Search Teamups'
$('#rooms').removeAttr('style', 'background-color: #e9573e !important')
$('#flatmates').removeAttr('style', 'background-color: #e9573e !important')
$('.navbar').attr('style', 'background-color: #ffc107 !important')
});


// input group checkbox on/off

$(document).on('click','.input-group', function(){
    if ($(this).parent().find(".fa-times").length==1){
        $(this).parent().find(".fa-times").removeClass("fa-times").addClass("fa-check")
        $(this).parent().find("#search_check_lgbt").val("LGBT")
        $(this).parent().find("#search_check_retirees").val("Retirees welcome")
        $(this).parent().find("#search_check_student").val("Students accepted")
        $(this).parent().find("#search_check_smokers").val("Smokers accepted")
        $(this).parent().find("#search_check_backpackers").val("Backpackers OK")
        $(this).parent().find("#search_check_children").val("Children OK")
        $(this).parent().find("#search_check_fourty_year_old").val("40yrs+ welcome")
        $(this).parent().find("#search_check_on_welfare").val("On welfare")
        $(this).parent().find("#search_check_pets").val("Pets considered")

    }
    else{
        $(this).parent().find(".fa-check").removeClass("fa-check").addClass("fa-times");
//        $(this).parent().find("#search_check_lgbt").val("")
    }
});

//$(".search-room-btn").on("click", function(){
//
//    console.log('//////////////////////////////////////////////////////////////////')
//    console.log('Search Roomssssssssssssssssssssssssssss !!!!!')
//    var rooms_search = true
//    var data = {}
//    if ($('#min_room_rent_id').val()){
//        var min_room_rent = $('#min_room_rent_id').val()
//        data['min_room_rent'] = min_room_rent
//    }
//    if ($('#max_room_rent_id').val()){
//        var max_room_rent = $('#max_room_rent_id').val()
//        data['max_room_rent'] = max_room_rent
//    }
//    if ($('#search_sort').val()){
//        var search_sort = $('#search_sort').val()
//        data['search_sort'] = search_sort
//    }
//    if($('#room_avail_date_id').val()){
//        var room_avail_date = $('#room_avail_date_id').val()
//        data['room_avail_date'] = room_avail_date
//    }
//    if($('#search_gender').val()){
//        var search_gender = $('#search_gender').val()
//        data['search_gender'] = search_gender
//    }
//    if($('#search_room_type_id').val()){
//        var search_room_type_id = $('#search_room_type_id').val()
//        data['search_room_type_id'] = search_room_type_id
//    }
//
//
//
//
//
//    console.log('Data :: ',data)
//
//
//
//
//    event.preventDefault()
//
//})//search room button



})//document ready



//=======
//odoo.define('pragtech_flatmates.search', function (require) {
//console.log("\nggggg")
//$(document).ready(function() {
//
//$('#dropdownMenuButton').on('click',function(){
//                console.log(')))))))))))))))))0')
//
//                $.ajax({
//                        url:'/load/search/data',
//                        type:'POST',
//                        dataType: 'json',
//                        contentType: 'application/json',
//                        data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
//                        success: function(data){
//                            console.log('88888888888888888888888 ',data)
//                            //room types
//                            room_types = data['result']['room_types']
//                            for(var i=0;i<room_types.length;i++){
//                                var room = room_types[i]
//                                console.log('rooms :',room)
//                                $('#search_room_type_id').append('<option value='+room[0]+'>'+room[1]+'</option>')
//                            }
//
//                            //bathroom types
//                            bathroom_types = data['result']['bathroom_types']
//                            for(var i=0;i<bathroom_types.length;i++){
//                                var bathroom_type = bathroom_types[i]
//                                console.log('Bathroom type :',bathroom_type)
//                                $('#search_room_bathroom_type_id').append('<option value='+bathroom_type[0]+'>'+bathroom_type[1]+'</option>')
//                            }
//
//                            //room furnishing type
//                            room_furnishing_types = data['result']['room_furnishing_types']
//                            for(var i=0;i<room_furnishing_types.length;i++){
//                                var room_furnishing_type = room_furnishing_types[i]
//                                console.log('Room Furnishing type :',room_furnishing_type)
//                                $('#search_room_furnsh_type_id').append('<option value='+room_furnishing_type[0]+'>'+room_furnishing_type[1]+'</option>')
//                            }
//
//                            //Max stay length
//                            max_len_stay = data['result']['max_len_stay']
//                            for(var i=0;i<max_len_stay.length;i++){
//                                var max_stay = max_len_stay[i]
//                                console.log('stay type :',max_stay)
//                                $('#search_stay_len_id').append('<option value='+max_stay[0]+'>'+max_stay[1]+'</option>')
//                            }
//
//                            //Parking type
//                            parking_types = data['result']['parking_types']
//                            for(var i=0;i<parking_types.length;i++){
//                                var parking_type = parking_types[i]
//                                console.log('parking type :',parking_type)
//                                $('#search_room_parking_type_id').append('<option value='+parking_type[0]+'>'+parking_type[1]+'</option>')
//                            }
//
//                            //available bedrooms
//                            bedrooms = data['result']['bedrooms']
//                            for(var i=0;i<bedrooms.length;i++){
//                                var bedroom = bedrooms[i]
//                                console.log('Bedroom :',bedroom)
//                                $('#search_avail_bedrooms_id').append('<option value='+bedroom[0]+'>'+bedroom[1]+'</option>')
//                            }
//
//
//	                    },
//                });
//
//})
//
//
//$(".rooms-btn").css('display','none');
//$(".flatmates-btn").css('display','none');
//$(".teamups-btn").css('display','none');
//$(".advanced-option").css('display','none')
//$("#hide-advance-filter-rooms").css('display','none')
//$("#hide-advance-filter-flatmates").css('display','none')
//$("#hide-advance-filter-teamups").css('display','none')
//$('.search-btn').attr('style','background-color:#37bc9b !important')
//
/////////////////////////////////////////////////////////////
////Set Datepicker from today date
//
//$('#room_avail_date_id').datepicker({minDate: 0});
////$("#search_filter_date").datepicker({
////dateFormat: 'dd/mm/yy'
////});
//$('#flat_avail_date_id').datepicker({minDate: 0});
////$("#search_filter_date").datepicker({
////dateFormat: 'dd/mm/yy'
////});
//$('#teamups_avail_date_id').datepicker({minDate: 0});
////$("#search_filter_date").datepicker({
////dateFormat: 'dd/mm/yy'
////});
////////////////////////////////////////////////////////////////
//
//$("#advance-filter-rooms").click(function(event){
//$(".advanced-option").css('display','block')
//$("#hide-advance-filter-rooms").css('display','block')
//$("#advance-filter-rooms").css('display','none')
//})
//
//
//$("#hide-advance-filter-rooms").click(function(event){
//$(".advanced-option").css('display','none')
//$("#hide-advance-filter-rooms").css('display','none')
//$("#advance-filter-rooms").css('display','block')
// })
//
//
//$("#advance-filter-flatmates").click(function(event){
//$(".advanced-option").css('display','block')
//$("#hide-advance-filter-flatmates").css('display','block')
//$("#advance-filter-flatmates").css('display','none')
//})
//
//
//
//$("#hide-advance-filter-flatmates").click(function(event){
//$(".advanced-option").css('display','none')
//$("#hide-advance-filter-flatmates").css('display','none')
//$("#advance-filter-flatmates").css('display','block')
//})
//
//
//$("#advance-filter-teamups").click(function(event){
//$(".advanced-option").css('display','block')
//$("#hide-advance-filter-teamups").css('display','block')
//$("#advance-filter-teamups").css('display','none')
//})
//
//
//$("#hide-advance-filter-teamups").click(function(event){
//$(".advanced-option").css('display','none')
//$("#hide-advance-filter-teamups").css('display','none')
//$("#advance-filter-teamups").css('display','block')
//})
//
//
//
//$("#rooms").on("click", function(){
//$(this).attr('style', 'background-color: #e9573e !important;color : white !important')
//$(".rooms-btn").css('display','block');
//$(".flatmates-btn").css('display','none');
//$(".teamups-btn").css('display','none');
//$('#search-submit-start').css('display','none')
//$('.search-room-btn').attr('style','background-color:#37bc9b !important')
//$('#flatmates').removeAttr('style', 'background-color: #e9573e !important')
//$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
//$('.navbar').attr('style', 'background-color: #e9573e !important')
//});
//
//
//
//$("#rooms").off("click", function(){
//$(this).attr('style', 'background-color: white !important;color : #e9573e !important')
//$(".rooms-btn").css('display','none');
//})
//
//
//
//$("#flatmates").on("click", function(){
//$(this).attr('style', 'background-color: #17a2b8 !important;color : white !important')
//$(".flatmates-btn").css('display','block');
//$(".rooms-btn").css('display','none');
//$(".teamups-btn").css('display','none');
//$('#search-submit-start').css('display','none')
//$('.search-flat-btn').attr('style','background-color:#37bc9b !important')
//$('#rooms').removeAttr('style', 'background-color: #e9573e !important')
//$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
//$('.navbar').attr('style', 'background-color: #17a2b8 !important')
//});
//
//
//
//$("#teamups").on("click", function(){
//$(this).attr('style', 'background-color: #ffc107 !important;color : white !important')
//$(".teamups-btn").css('display','block');
//$('#search-submit-start').css('display','none')
//$('.search-teamups-btn').attr('style','background-color:#37bc9b !important')
//$(".flatmates-btn").css('display','none');
//$(".rooms-btn").css('display','none');
//var serach_button = document.getElementById("search-submit");
//serach_button.value='Search Teamups'
//$('#rooms').removeAttr('style', 'background-color: #e9573e !important')
//$('#flatmates').removeAttr('style', 'background-color: #e9573e !important')
//$('.navbar').attr('style', 'background-color: #ffc107 !important')
//});
//
//
//
//// input group checkbox on/off
//
//$(document).on('click','.input-group', function(){
//	if ($(this).parent().find(".fa-times").length==1)
//		$(this).parent().find(".fa-times").removeClass("fa-times").addClass("fa-check")
//	else
//		$(this).parent().find(".fa-check").removeClass("fa-check").addClass("fa-times");;
//});
//
////$(".search-room-btn").on("click", function(){
////
////    console.log('//////////////////////////////////////////////////////////////////')
////    console.log('Search Roomssssssssssssssssssssssssssss !!!!!')
////    var rooms_search = true
////    var data = {}
////    if ($('#min_room_rent_id').val()){
////        var min_room_rent = $('#min_room_rent_id').val()
////        data['min_room_rent'] = min_room_rent
////    }
////    if ($('#max_room_rent_id').val()){
////        var max_room_rent = $('#max_room_rent_id').val()
////        data['max_room_rent'] = max_room_rent
////    }
////    if ($('#search_sort').val()){
////        var search_sort = $('#search_sort').val()
////        data['search_sort'] = search_sort
////    }
////    if($('#room_avail_date_id').val()){
////        var room_avail_date = $('#room_avail_date_id').val()
////        data['room_avail_date'] = room_avail_date
////    }
////    if($('#search_gender').val()){
////        var search_gender = $('#search_gender').val()
////        data['search_gender'] = search_gender
////    }
////    if($('#search_room_type_id').val()){
////        var search_room_type_id = $('#search_room_type_id').val()
////        data['search_room_type_id'] = search_room_type_id
////    }
////
////
////
////
////
////    console.log('Data :: ',data)
////
////
////
////
////    event.preventDefault()
////
////})//search room button
//
//
//
//})//document ready
//
//
//
//>>>>>>> [IMP]:Fix validation for dynamic add another person and formatted data on about you page
})//main