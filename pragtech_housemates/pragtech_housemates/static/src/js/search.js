//<<<<<<< 73c592ab737ec37b97b027058a04268cfc2b7408
odoo.define('pragtech_flatmates.search', function (require) {
//console.log("\nggggg")


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

$(document).ready(function() {

    $(".add-green-class").on('click',function(){
        console.log('wwwwwwwwwwwwwwwwwwwwwwwww',$(this))
        if($(this).find('i').hasClass('fa-times') == false){
            console.log('ifffffffffffffffffffffffffffffffff')
            $(this).find(".green-class").css('background-color','#e4e5e6')
        }
        else{
            console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeee')
            $(this).find(".green-class").css('background-color','#11836c')
        }
    })

$(document).on('keyup','.find-place-add-suburbs-search',function(e)
    {
    var data;
    var type;

    if (e.keyCode == 8)
    {
        console.log ("Backsapce",$('#find_suburb_search').val())



        if ($('.suburbs-div').length != 0 && $('#find_suburb_search').val().length == 0 && flag == 1)
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
            if ($('#find_suburb_search').val().length == 0 )
                flag = 1
        }


    }

    // DOWN
    if (e.keyCode == 40)
    {
//        console.log ("Backspace")
        $("#find_suburb_search").val("")
    }

    // UP
    else if (e.keyCode == 38)
    {
//        console.log ("Uppppp")
        $("#find_suburb_search").val("")
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
        if (isNaN($('#find_suburb_search').val()))
        {
            data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'suburb_to_search' : $('#find_suburb_search').val(), 'type_of_data' : 'string' }})
            type = 'string'
        }
        else
        {
            data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'suburb_to_search' : $('#find_suburb_search').val(), 'type_of_data' : 'integer' }})
            type = 'integer'
        }

//         console.log ("key press",isNaN($(this).val()))

        if ($('#find_suburb_search').val().length==0)
        {
        }
        else
        {
             if (type == 'integer' && $('#find_suburb_search').val().length >= 3)
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
                            $('#find_suburb_search').autocomplete
                            ({
                                source: data['result'],
                                delay:300,
                                select: function(event, ui)
                                {
                                    var suburb_obj = $('.find-place-add-suburbs-search').find("input").first()
                                    console.log ("sdfffg dfssdf")
                                    if (suburb_obj.length == 1)
                                    {
                                        console.log ("sdfffg dfssdf")
                                        $(".find-place-add-suburbs-search").prepend('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $("#find_suburb_search").val("")
                                        return false;
                                    }
                                    else
                                    {
                                        var flag_add = 1;
                                        var flag_dist = 1;

                                        var first_suburb = $(".suburbs-div").first()
                                        var first_suburb_span = first_suburb.find('span')

                                        var distance = calculate_distance ( first_suburb_span.attr('data-lat'), ui.item.value[1], first_suburb_span.attr('data-lon'), ui.item.value[2])

                                        if (distance > 30)
                                        {
                                            console.log ("In the message message")
                                            $('.show-distance-msg').removeClass("d-none")

                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token token-red" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');


                                            $("#find_suburb_search").val("")
                                            $("#find_suburb_search").val("")
                                            return false;
                                        }
                                        else
                                        {
                                            suburb_obj.each(function()
                                            {
                                                if ($(this).val() == ui.item.label)
                                                    flag_add = 0
                                            })

                                            if (flag_add == 1)
                                            {
                                                if (!$('.show-distance-msg').hasClass("d-none"))
                                                    $('.show-distance-msg').addClass("d-none")
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
                                                $("#find_suburb_search").val("")
                                                return false;
                                            }
                                            else
                                            {
                                                $("#find_suburb_search").val("")
                                                return false;
                                            }
                                        }
                                    }
                                }
                            })

                        }
                    })
            }
            if (type == 'string' && $('#find_suburb_search').val().length >= 3)
            {
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

                            $('#find_suburb_search').autocomplete
                            ({
                                source: data_array,
                                delay:300,
                                select: function(event, ui)
                                {
                                    var suburb_obj = $('.find-place-add-suburbs-search').find("input").first()

                                    if (suburb_obj.length == 1)
                                    {
                                        $(".find-place-add-suburbs-search").prepend('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>')
                                        $("#find_suburb_search").val("")
                                        $('.propert_submit_btn').attr('disabled',false)
                                        return false;
                                    }
                                    else
                                    {
                                        var flag_add = 1;
                                        var flag_dist = 1;

                                        var first_suburb = $(".suburbs-div").first()
                                        var first_suburb_span = first_suburb.find('span')
                                        var distance = calculate_distance ( first_suburb_span.attr('data-lat'), ui.item.value[1], first_suburb_span.attr('data-lon'), ui.item.value[2])

                                        if (distance > 30)
                                        {
                                            $('.show-distance-msg').removeClass("d-none")
                                            $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.label+'"/><span class="token token-red" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
                                            $("#find_suburb_search").val("")
                                            $("#find_suburb_search").val("")
                                            return false;
                                        }
                                        else
                                        {
                                            suburb_obj.each(function()
                                            {
                                                if ($(this).val() == ui.item.label)
                                                    flag_add = 0
                                            })

                                            if (flag_add == 1)
                                            {
                                                if (!$('.show-distance-msg').hasClass("d-none"))
                                                    $('.show-distance-msg').addClass("d-none")
                                                $('<div class="suburbs-div"><input type="hidden" id="suburbs" name="suburbs[]" value="'+ui.item.tagText+'"/><span class="token" data-lat='+ui.item.value[1]+' data-lon='+ui.item.value[2]+'>'+ui.item.value[0]+'<i class="fa fa-close delete-suburb" style="font-size:16px"></i></span></div>').insertBefore('#find_suburb');
                                                $("#find_suburb_search").val("")
                                                return false;
                                            }
                                            else
                                            {
                                                $("#find_suburb_search").val("")
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



///////////////////////////////////////////////////////////////////////////
$('input').focus(function(){
  console.log ("In jsssssssssssssssssssss", $(this).siblings())
  if (!$(this).siblings().hasClass('currency')){
  $(this).siblings().addClass('focused')
  }
});

$('input').blur(function(){
  var inputValue = $(this).val();
  if ( inputValue == "" )
    $(this).siblings().removeClass('focused');
})
//////////////////////////////////////////////////////////////////////////



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

    if ($("#search_value").val() == "search"){
        $("#search_filter").submit()
    }


    if ($("#search_value").val() == "search_rooms"){
        $("#search_room_filter").submit();
    }


    if ($("#search_value").val() == "search_flatmates"){
        $("#search_flatmates_filter").submit()
    }

    var arr = [];
    $(".tags_container span").each(function(index, elem){
        arr.push($(this).text());
    });
    arr.join("|");
    console.log("=============== data of tags =============== ",arr)
//                alert('hi')

});

// added by sagar - add city in search form
 $("#search_filter").submit(function( event ) {
        var tagContainer = $(".tags_container")
        var tags = tagContainer.find(".tag");
        var suburb_array = []
        var suburbs = ""
	 	//if no tag, return false
	 	if(tags.length != 0){
            $.each(tags,function(event){
                if($(this).find("input").data("suburb_name")){
                    suburb_data = $(this).find("input").data("suburb_name");
                    suburb_array.push(suburb_data)
                }
                else if($(this).find("input").data("city")){
                    suburb_data = $(this).find("input").data("city")
                    suburb_array.push(suburb_data)
                }

            });
	 	}

	 	suburbs = suburb_array.toString()

        taginput = "<input type='hidden' class='tag_input search_suburbs' name='search_suburbs' value='"+suburbs+"'>"
        $(".search_tag_input_suburbs").append(taginput)
//        event.preventDefault()
    });

// added by sagar - add city in search room form
 $("#search_room_filter").submit(function( event ) {
        city = $(".city").text()
        console.log('City :; ',city)

        taginput = "<input type='hidden' class='room_tag_input search_city' name='search_city' value=" +city+">"
        $(".rooms_tag_input_city").append(taginput)

        var tagContainer = $(".tags_container")
        var tags = tagContainer.find(".tag");
        var suburb_array = []
        var suburbs = ""
	 	//if no tag, return false
	 	if(tags.length != 0){
            $.each(tags,function(event){

                if($(this).find("input").data("suburb_name")){
                    suburb_data = $(this).find("input").data("suburb_name");
                    suburb_array.push(suburb_data)
                }
                else if($(this).find("input").data("city")){
                    suburb_data = $(this).find("input").data("city")
                    suburb_array.push(suburb_data)
                }


            });
	 	}

	 	suburbs = suburb_array.toString()

        taginput = "<input type='hidden' class='tag_input search_suburbs' name='search_suburbs' value='"+suburbs+"'>"
        $(".rooms_tag_input_suburbs").append(taginput)
    });

// added by sagar - add city in search flatmates form
 $("#search_flatmates_filter").submit(function( event ) {
        city = $(".city").text()
        console.log('City : ',city)

        taginput = "<input type='hidden' class='room_tag_input search_city' name='search_city' value=" +city+">"
        $(".flatmate_tag_input_city").append(taginput)

        var tagContainer = $(".tags_container")
        var tags = tagContainer.find(".tag");
        var suburb_array = []
        var suburbs = ""
	 	//if no tag, return false
	 	if(tags.length != 0){
            $.each(tags,function(event){

                if($(this).find("input").data("suburb_name")){
                    suburb_data = $(this).find("input").data("suburb_name");
                    suburb_array.push(suburb_data)
                }
                else if($(this).find("input").data("city")){
                    suburb_data = $(this).find("input").data("city")
                    suburb_array.push(suburb_data)
                }

            });
	 	}

	 	suburbs = suburb_array.toString()

        taginput = "<input type='hidden' class='tag_input search_suburbs' name='search_suburbs' value='"+suburbs+"'>"
        $(".flatmate_tag_input_suburbs").append(taginput)

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


$(".search-dropdown").click(function(event){
	
	
//    console.log('fdhndfhjdnfhkn')
    var is_shown = $(".modal_shown").hasClass("show")
    console.log('Is shownnnnnnnnnnnnnnnn : ',is_shown)
    if (is_shown == false){
        //           console.log('111111111111111111111111111111111')
        $('#search-text-id').text('WHERE ARE YOU LOOKING?');
                  $(".search-btn-close").removeClass('d-none')

        if($(window).width() <= 768){

            console.log('hooooooooooooooo')
			//$(this).hide();
            $('.search-bar-responsive').css('display','none')  
			$('#new-closebutton').removeClass('d-none');
			$("#dropdownMenuButton").css('margin-top','65px')
			$(".navbar-brand").css('display','none');
			$("#top_menu_collapse .navbar-nav").css('width','100%');
        }
    }
    else{
    $('#search-text-id').text('Search share accommodation');
//            console.log('222222222222222222222222222')
          $(".search-btn-close").addClass('d-none')
    }

});
	
$("#new-closebutton").click(function(event){
	
  
        if($(window).width() <= 768){

            console.log('4181188717777777777777')
			//$(this).hide();
			$('#new-closebutton').addClass('d-none');
            $('.search-bar-responsive').css('display','block')  
			$("#dropdownMenuButton").modal('hide');
			$("#top_menu_collapse .navbar-nav").css('width','75%');
			$(".navbar-brand").css('display','block');
			
		}

});


$(".search-btn-close").click(function(event){
        $("#dropdownMenuButton").modal('hide');
        $(this).addClass('d-none')
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
$("#hide-advance-filter-flatmates").css('display','block')
$("#hide-advance-filter-teamups").css('display','block')
$("#advance-filter-rooms").css('display','none')
$("#advance-filter-flatmates").css('display','none')
$("#advance-filter-teamups").css('display','none')
})


$("#hide-advance-filter-rooms").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-rooms").css('display','none')
$("#hide-advance-filter-flatmates").css('display','none')
$("#hide-advance-filter-teamups").css('display','none')
$("#advance-filter-rooms").css('display','block')
$("#advance-filter-flatmates").css('display','block')
$("#advance-filter-teamups").css('display','block')
 })


$("#advance-filter-flatmates").click(function(event){
$(".advanced-option").css('display','block')
$("#hide-advance-filter-flatmates").css('display','block')
$("#hide-advance-filter-rooms").css('display','block')
$("#hide-advance-filter-teamups").css('display','block')
$("#advance-filter-flatmates").css('display','none')
$("#advance-filter-rooms").css('display','none')
$("#advance-filter-teamups").css('display','none')
})



$("#hide-advance-filter-flatmates").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-rooms").css('display','none')
$("#hide-advance-filter-flatmates").css('display','none')
$("#hide-advance-filter-teamups").css('display','none')
$("#advance-filter-rooms").css('display','block')
$("#advance-filter-flatmates").css('display','block')
$("#advance-filter-teamups").css('display','block')
})


$("#advance-filter-teamups").click(function(event){
$(".advanced-option").css('display','block')
$("#hide-advance-filter-flatmates").css('display','block')
$("#hide-advance-filter-rooms").css('display','block')
$("#hide-advance-filter-teamups").css('display','block')
$("#advance-filter-flatmates").css('display','none')
$("#advance-filter-rooms").css('display','none')
$("#advance-filter-teamups").css('display','none')
})


$("#hide-advance-filter-teamups").click(function(event){
$(".advanced-option").css('display','none')
$("#hide-advance-filter-rooms").css('display','none')
$("#hide-advance-filter-flatmates").css('display','none')
$("#hide-advance-filter-teamups").css('display','none')
$("#advance-filter-rooms").css('display','block')
$("#advance-filter-flatmates").css('display','block')
$("#advance-filter-teamups").css('display','block')
})



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
//
//
//});

var clicks1 = false
var clicks2 = false
var clicks3 = false

$("#rooms").on("click", function() {
	if (clicks1)
	{
		$(this).removeAttr('style', 'background-color: #e9573e !important;color : white !important');
		$('.navbar').removeAttr('style', 'background-color: #e9573e !important');
		$(".rooms-btn").css('display','none');

	}
	else
	{
		$(this).attr('style', 'background-color: #e9573e !important;color : white !important')
		$(".rooms-btn").css('display','block');
		$(".flatmates-btn").css('display','none');
		$(".teamups-btn").css('display','none');
		$('#search-submit-start').css('display','none')
		$('.search-room-btn').attr('style','background-color:#37bc9b !important')
		$('#flatmates').removeAttr('style', 'background-color: #e9573e !important')
		$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
		$('.navbar').attr('style', 'background-color: #e9573e !important')
	}
	clicks1 = !clicks1
	clicks2 = false
	clicks3 = false

});



if ((window.location.href.indexOf("listing_type=list") > -1 )|| (window.location.href.indexOf("list_place_preview") >-1)){
$('.navbar').attr('style', 'background-color: #e9573e !important')
}

if ((window.location.href.indexOf("listing_type=find") > -1) || (window.location.href.indexOf("find_place_preview")>-1)){
$('.navbar').attr('style', 'background-color: #17a2b8 !important')
}

$("#rooms").off("click", function(){
$(this).attr('style', 'background-color: white !important;color : #e9573e !important')
$(".rooms-btn").css('display','none');
})



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

$("#flatmates").on("click", function() {
	if (clicks3)
	{
		$(this).removeAttr('style', 'background-color: #17a2b8 !important;color : white !important')
		$('.navbar').removeAttr('style', 'background-color: #17a2b8 !important')
		$(".flatmates-btn").css('display','none');
	}
	else
	{
		$(this).attr('style', 'background-color: #17a2b8 !important;color : white !important')
		$(".flatmates-btn").css('display','block');
		$(".rooms-btn").css('display','none');
		$(".teamups-btn").css('display','none');
		$('#search-submit-start').css('display','none')
		$('.search-flat-btn').attr('style','background-color:#37bc9b !important')
		$('#rooms').removeAttr('style', 'background-color: #e9573e !important')
		$('#teamups').removeAttr('style', 'background-color: #e9573e !important')
		$('.navbar').attr('style', 'background-color: #17a2b8 !important')
	}
	clicks3 = !clicks3
	clicks2 = false
	clicks1 = false
});



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

$("#teamups").on("click", function() {
	if (clicks2)
	{
		$(this).removeAttr('style', 'background-color: #ffc107 !important;color : white !important')
		$('.navbar').removeAttr('style', 'background-color: #ffc107 !important')
		$(".teamups-btn").css('display','none');
	}
	else
	{
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
	}
	clicks2 = !clicks2
	clicks1 = false
	clicks3 = false
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


    $(".tags_input").tagComplete({
        autocomplete: {
//          data: data,
            freeEdit:false,
            params : function(value){
                return {q:value,current_url:window.location.pathname};
            },
            ajaxOpts: {
                url: '/get_suburbss',
                type: "GET",
                success: function(result){
                }
            },
            proccessData: function(data){
//                 console.log('Dataaaaaaa 123: ',data)
                 var res = []
                    for(i=0;i<data.length;i++){
//                        console.log('label :',data[i]['label'])
                        res.push(data[i]['label'])
                    }
//                    console.log('data :/: ',res)
                 return res;
            },
        }
    })


    $(".tag_input").keydown(function(e) {
        switch (e.which) {
            case 40:
                $('li:not(:last-child).abcc').removeClass('abcc')
                    .next().addClass('abcc');
                break;

            case 38:
                $('li:not(:first-child).abcc').removeClass('abcc')
                    .prev().addClass('abcc');
                break;
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