odoo.define('pragtech_flatmates.back_button_whole_property', function (require) {
    $(document).ready(function() {
            $(document).on('click','.whole_property_go_back,.about_template_go_back,.rent_bond_bills_go_back,.room_availability_go_back,.about_who_lives_here_template_go_back,.property_images_go_back,.list_place_describe_your_flatmate_go_back,.flatmate_preference_template_go_back,.list_place_accepting_go_back,.list_place_describe_yourself_go_back,.list_place_about_others_go_back,.list_place_comment_about_property_go_back',function()
            {
               console.log("--------------**---------------",window.location.pathname)
               if (window.location.pathname=='/listplace/whole-property/about')
               {
               window.location.replace('/listplace/whole-property/property-type')
               }
               else if (window.location.pathname=='/listplace/student-accomodation/about')
               {
               window.location.replace('/listplace/student-accomodation/property-type')
               }
               else{
               window.location.replace('/listplace/describe-your-place/accommodation')
               }
               if (window.location.pathname=='/listplace/whole-property/who-lives-here')
               {
               window.location.replace('/listplace/whole-property/about')
               }
               if(window.location.pathname =='/listplace/whole-property/room-availability'){
               window.location.replace('/listplace/whole-property/who-lives-here')
               }
               if(window.location.pathname == '/listplace/whole-property/property-images'){
               window.location.replace('/listplace/whole-property/room-availability')
               }
               if(window.location.pathname=='/listplace/whole-property/describe-your-flatmate'){
               window.location.replace('/listplace/whole-property/property-images')
               }
               if(window.location.pathname=='/listplace/whole-property/flatmate-preference'){
               window.location.replace('/listplace/whole-property/describe-your-flatmate')
               }
               if(window.location.pathname=='/listplace/whole-property/accepting'){
               window.location.replace('/listplace/whole-property/flatmate-preference')
               }
               if(window.location.pathname=='/listplace/whole-property/introduce-yourself'){
               window.location.replace('/listplace/whole-property/accepting')
               }
               if(window.location.pathname=='/listplace/whole-property/about-others'){
               window.location.replace('/listplace/whole-property/introduce-yourself')
               }
               if(window.location.pathname=='/listplace/whole-property/about-property'){
               window.location.replace('/listplace/whole-property/about-others')
               }

    //
            })

            if (window.location.pathname=='/listplace/describe-your-place/accommodation' && localStorage.getItem('list_place_array'))
            {

                local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                if(local_storage_data.length != 0 && local_storage_data[0]){
                if(local_storage_data[0]['accommodation_type']){
                if (local_storage_data[0]['accommodation_type'] == 'whole-property'){
                    $('.whole-property').removeClass('items-cirle-hover')
                    $('.whole-property').addClass('accommodation-listing-item-active')
                    $('.whole-property').find("path").attr('class', 'active_svg_icon');
                    $('.whole-property').prepend('<div src="" class="active_tick_icon"></div>');
                    $('.accommodation-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('whole-property')
                }
                if(local_storage_data[0]['accommodation_type'] == 'student-accomodation'){
                    $('.student-accomodation').removeClass('items-cirle-hover')
                    $('.student-accomodation').addClass('accommodation-listing-item-active')
                    $('.student-accomodation').find("path").attr('class', 'active_svg_icon');
                    $('.student-accomodation').prepend('<div src="" class="active_tick_icon"></div>');
                    $('.accommodation-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('student-accomodation')
                }
                if(local_storage_data[0]['accommodation_type'] == 'sharehouse'){
                    $('.share-house').removeClass('items-cirle-hover')
                    $('.share-house').addClass('accommodation-listing-item-active')
                    $('.share-house').find("path").attr('class', 'active_svg_icon');
                    $('.share-house').prepend('<div src="" class="active_tick_icon"></div>');
                    $('.porerty-type-group').show()
                    $('#type_of_accomodation').val('sharehouse')
                    if (local_storage_data[0]['property_type'] == 'house')
                    {
                        $('#property_type_input_house').parent()
                      .addClass("bedroom-btn-active") //Add class wrong to the label
                      .siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.
                        $('.accommodation-next-btn').prop("disabled", false);            }

                    if (local_storage_data[0]['property_type'] == 'flat')
                    {
                        $('#property_type_input_flat').parent()
                      .addClass("bedroom-btn-active") //Add class wrong to the label
                      .siblings().removeClass("bedroom-btn-active"); // Remove classes from the other labels.
                      $('.accommodation-next-btn').prop("disabled", false);
                    }
                }
                if(local_storage_data[0]['accommodation_type'] == 'homestay'){
                    $('.homestay').removeClass('items-cirle-hover')
                    $('.homestay').addClass('accommodation-listing-item-active')
                    $('.homestay').find("path").attr('class', 'active_svg_icon');
                    $('.homestay').prepend('<div src="" class="active_tick_icon"></div>');
                    $('.accommodation-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('homestay')
                }
                }
                }
            }

            if (window.location.pathname=='/listplace/whole-property/property-type' && localStorage.getItem('list_place_array')){
                var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                if(local_storage_data.length != 0 && local_storage_data[0]){
                if(local_storage_data[0]['whole_property_property_type']){
                if(local_storage_data[0]['whole_property_property_type'] == "granny_flat"){
                    $('.granny-flat').addClass('bedroom-btn-active')
                    $('.studio').removeClass('bedroom-btn-active')
                    $('.2-bedrooms').removeClass('bedroom-btn-active')
                    $('.1-bedrooms').removeClass('bedroom-btn-active')
                    $('.whole-property-type-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('whole-property')
                }
                if(local_storage_data[0]['whole_property_property_type'] == "2_bedrooms"){
                    $('.2_bedrooms').addClass('bedroom-btn-active')
                    $('.studio').removeClass('bedroom-btn-active')
                    $('.granny-flat').removeClass('bedroom-btn-active')
                    $('.1-bedrooms').removeClass('bedroom-btn-active')
                    $('.whole-property-type-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('whole-property')
                }
                if(local_storage_data[0]['whole_property_property_type'] == "1_bedrooms"){
                    $('.1_bedrooms').addClass('bedroom-btn-active')
                    $('.studio').removeClass('bedroom-btn-active')
                    $('.2-bedrooms').removeClass('bedroom-btn-active')
                    $('.granny-flat').removeClass('bedroom-btn-active')
                    $('.whole-property-type-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('whole-property')
                }
                if(local_storage_data[0]['whole_property_property_type'] == "studio"){
                    $('.studio').addClass('bedroom-btn-active')
                    $('.granny-flat').removeClass('bedroom-btn-active')
                    $('.2-bedrooms').removeClass('bedroom-btn-active')
                    $('.1-bedrooms').removeClass('bedroom-btn-active')
                    $('.whole-property-type-next-btn').prop("disabled", false);
                    $('#type_of_accomodation').val('whole-property')
                }
                }
                }
            }


            if (window.location.pathname=='/listplace/whole-property/about' && localStorage.getItem('list_place_array')){
                var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                if(local_storage_data.length != 0 && local_storage_data[0]){
                if(local_storage_data[0]['property_address']){
                $('#autocomplete').val(local_storage_data[0]['property_address'])
                $('#street_number').val(local_storage_data[0]['street_number'])
                $('#route').val(local_storage_data[0]['street2'])
                $('#locality').val(local_storage_data[0]['street3'])
                $('#administrative_area_level_2').val(local_storage_data[0]['city'])
                $('#administrative_area_level_1').val(local_storage_data[0]['state'])
                $('#postal_code').val(local_storage_data[0]['zip_code'])
                $('#latitude').val(local_storage_data[0]['latitude'])
                $('#longitude').val(local_storage_data[0]['longitude'])
                $('#north').val(local_storage_data[0]['north'])
                $('#south').val(local_storage_data[0]['south'])
                $('#east').val(local_storage_data[0]['east'])
                $('#west').val(local_storage_data[0]['west'])
                $('#type_of_accomodation').val(local_storage_data[0]['accommodation_type'])

                $.each($(document).find('input[name=bath_rooms]'), function(){
                    if($(this).val() == local_storage_data[0]['total_bathrooms'])
                    {
                        $(this.parentNode).addClass('bedroom-btn-active')
                    }
                })

                $.each($(document).find('input[name=bed_rooms]'), function(){
                    if($(this).val() == local_storage_data[0]['total_bedrooms'])
                    {
                        $(this.parentNode).addClass('bedroom-btn-active')
                    }
                })
                $("#parking").val(local_storage_data[0]['parking']);
                $("#internet").val(local_storage_data[0]['internet']);

                $.each($(document).find('input[name=room_furnishing_types]'), function(){
                    if($(this).val() == local_storage_data[0]['room_furnishing_type'])
                    {
                        $(this.parentNode).addClass('bedroom-btn-active')
                    }
                })
                $('.about-next-btn').prop("disabled", false);
                }
                }

            }

            if (window.location.pathname=='/listplace/whole-property/who-lives-here' && localStorage.getItem('list_place_array')){
                var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                if(local_storage_data.length != 0 && local_storage_data[0]){
                if(local_storage_data[0]['weekly_rent']){
                    $('#weekly_rent').val(local_storage_data[0]['weekly_rent'])
                    $("#bond").val(local_storage_data[0]['bond']);
                    $("#bill").val(local_storage_data[0]['bill']);
                    $('.rent-bond-bill-btn').prop("disabled", false);
                    $('#type_of_accomodation').val(local_storage_data[0]['accommodation_type'])
                }
                }
            }

            if (window.location.pathname=='/listplace/whole-property/room-availability' && localStorage.getItem('list_place_array')){
                 var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                 if(local_storage_data.length != 0 && local_storage_data[0]){
                 if(local_storage_data[0]['avail_date']){
                 $('#txtdate').val(local_storage_data[0]['avail_date'])
                 $('#min_len_stay').val(local_storage_data[0]['min_length_of_stay'])
                 $('#max_len_stay').val(local_storage_data[0]['max_length_of_stay'])
                 $('#type_of_accomodation').val(local_storage_data[0]['accommodation_type'])
                 $('.room-avail-btn').prop("disabled", false);
                 }
                 }
            }
            if (window.location.pathname=='/listplace/whole-property/property-images' && localStorage.getItem('list_place_array')){
                var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
            }
            if (window.location.pathname=='/listplace/whole-property/flatmate-preference' && localStorage.getItem('list_place_array')){
                var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                if(local_storage_data.length != 0 && local_storage_data[0]){
                if(local_storage_data[0]['flatmate_preference_type']){
                $.each($(document).find('input[name=flatmate_Preference_type]'), function(){
                    if($(this).val() == local_storage_data[0]['flatmate_preference_type'])
                    {
                        $(this.parentNode).addClass('bedroom-btn-active')
                    }
                })

                $('.flatmate-pref-nxt-btn').prop("disabled", false);
                }
                }

            }
            if (window.location.pathname=='/listplace/whole-property/accepting' && localStorage.getItem('list_place_array')){
                 var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                 if(local_storage_data.length != 0 && local_storage_data[0]){
                 if(local_storage_data[0]['accepting']){
                 for(var i=0;i<local_storage_data[0]['accepting'].length;i++){
                     if (local_storage_data[0]['accepting'][i] == 'backpackers'){
                         $('#set-backpackers').removeClass('items-cirle-hover')
                         $('#set-backpackers').addClass('accommodation-listing-item-active')
                         $('#set-backpackers').find("path").attr('class', 'active_svg_icon');
                         $('#set-backpackers').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'students'){
                         $('#set-students').removeClass('items-cirle-hover')
                         $('#set-students').addClass('accommodation-listing-item-active')
                         $('#set-students').find("path").attr('class', 'active_svg_icon');
                         $('#set-students').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'smokers'){
                         $('#set-smokers').removeClass('items-cirle-hover')
                         $('#set-smokers').addClass('accommodation-listing-item-active')
                         $('#set-smokers').find("path").attr('class', 'active_svg_icon');
                         $('#set-smokers').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'LGBTI'){
                         $('#set-lgbt-friendly').removeClass('items-cirle-hover')
                         $('#set-lgbt-friendly').addClass('accommodation-listing-item-active')
                         $('#set-lgbt-friendly').find("path").attr('class', 'active_svg_icon');
                         $('#set-lgbt-friendly').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == '40_year_old'){
                         $('#set-over-40').removeClass('items-cirle-hover')
                         $('#set-over-40').addClass('accommodation-listing-item-active')
                         $('#set-over-40').find("path").attr('class', 'active_svg_icon');
                         $('#set-over-40').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'children'){
                         $('#set-children').removeClass('items-cirle-hover')
                         $('#set-children').addClass('accommodation-listing-item-active')
                         $('#set-children').find("path").attr('class', 'active_svg_icon');
                         $('#set-children').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'pets'){
                         $('#set-pets').removeClass('items-cirle-hover')
                         $('#set-pets').addClass('accommodation-listing-item-active')
                         $('#set-pets').find("path").attr('class', 'active_svg_icon');
                         $('#set-pets').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'retirees'){
                         $('#set-retirees').removeClass('items-cirle-hover')
                         $('#set-retirees').addClass('accommodation-listing-item-active')
                         $('#set-retirees').find("path").attr('class', 'active_svg_icon');
                         $('#set-retirees').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                     else if(local_storage_data[0]['accepting'][i] == 'on_welfare'){
                         $('#set-benefits').removeClass('items-cirle-hover')
                         $('#set-benefits').addClass('accommodation-listing-item-active')
                         $('#set-benefits').find("path").attr('class', 'active_svg_icon');
                         $('#set-benefits').prepend('<div src="" class="active_tick_icon"></div>');
                         $('.accepting-nxt-btn').prop("disabled", false);
                     }

                 }
                 }
                 }
            }

            if (window.location.pathname=='/listplace/whole-property/about-others' && localStorage.getItem('list_place_array')){
                 var local_storage_data = JSON.parse(localStorage.getItem('list_place_array'))
                 if(local_storage_data.length != 0 && local_storage_data[0]){
                 if(local_storage_data[0]['about_you_and_your_flatmates']){
                 $('#comment').val(local_storage_data[0]['about_you_and_your_flatmates'])
                 $('.about-others-nxt-btn').prop("disabled", false);
                 }
                 }
            }
    })
})