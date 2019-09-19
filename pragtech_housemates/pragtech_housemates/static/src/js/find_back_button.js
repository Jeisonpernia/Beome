odoo.define('pragtech_flatmates.find_back_button', function (require) {
    $(document).ready(function() {
        var current_location = window.location.pathname
        if(current_location == '/find-place/describe-your-ideal-place/accommodation'){
             var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
//             console.log("------ find place ----",local_storage_data.length)
             if(local_storage_data && local_storage_data[0]){
             if(local_storage_data[0]['find_property_looking_for']){
             for (var i =0 ; i< local_storage_data[0]['find_property_looking_for'].length;i++){

                if(local_storage_data[0]['find_property_looking_for'][i] == "Rooms in an existing share house")
                {
                        $('.find-sharehouse').removeClass('items-cirle-hover')
                        $('.find-sharehouse').addClass('accommodation-listing-item-active')
                        $('.find-sharehouse').find("path").attr('class', 'active_svg_icon');
                        $('.find-sharehouse').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=rooms_in_existing_share_house]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "Whole property for rent")
                {
                        $('.find-wholeproperty').removeClass('items-cirle-hover')
                        $('.find-wholeproperty').addClass('accommodation-listing-item-active')
                        $('.find-wholeproperty').find("path").attr('class', 'active_svg_icon');
                        $('.find-wholeproperty').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=whole_property]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "on")
                {
                        $('.find-studio').removeClass('items-cirle-hover')
                        $('.find-studio').addClass('accommodation-listing-item-active')
                        $('.find-studio').find("path").attr('class', 'active_svg_icon');
                        $('.find-studio').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=studio]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "Granny Flats")
                {
                        $('.find-grannyflats').removeClass('items-cirle-hover')
                        $('.find-grannyflats').addClass('accommodation-listing-item-active')
                        $('.find-grannyflats').find("path").attr('class', 'active_svg_icon');
                        $('.find-grannyflats').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=granny_flat]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "One Bed Flat")
                {
                        $('.find-onebedflat').removeClass('items-cirle-hover')
                        $('.find-onebedflat').addClass('accommodation-listing-item-active')
                        $('.find-onebedflat').find("path").attr('class', 'active_svg_icon');
                        $('.find-onebedflat').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=one_bed_flat]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "Homestay")
                {
                        $('.find-homestay').removeClass('items-cirle-hover')
                        $('.find-homestay').addClass('accommodation-listing-item-active')
                        $('.find-homestay').find("path").attr('class', 'active_svg_icon');
                        $('.find-homestay').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[v=homestay]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "Shared Room")
                {
                        $('.find-shared-room').removeClass('items-cirle-hover')
                        $('.find-shared-room').addClass('accommodation-listing-item-active')
                        $('.find-shared-room').find("path").attr('class', 'active_svg_icon');
                        $('.find-shared-room').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=shared_room]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_property_looking_for'][i] == "Student accommodation")
                {
                        $('.find-studentaccommodation').removeClass('items-cirle-hover')
                        $('.find-studentaccommodation').addClass('accommodation-listing-item-active')
                        $('.find-studentaccommodation').find("path").attr('class', 'active_svg_icon');
                        $('.find-studentaccommodation').prepend('<div src="" class="active_tick_icon"></div>');
                        $('.find-accommodation-next-btn').prop("disabled", false);
                        $("input[id=student_accommodation]").attr('checked','checked')

                }
             }

             if (local_storage_data[0]['find_teamups_status'] == true){
             $("input[name='temaups']").prop('checked', true);
             }

             else
             {
             $("input[name='temaups']").prop('checked', false);
             }
             }
             }

        }

        if (current_location == '/find-place/describe-your-ideal-place/about-flatmates'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))

            if(local_storage_data.length != 0){
                var suburb_array=[];
                console.log("======== suburb array ===========",suburb_array)
                if(local_storage_data[0]['suburbs']){
                    for (var i=0;i<local_storage_data[0]['suburbs'].length;i++){
                        if(suburb_array.length !=0){
                        console.log('--- in iffffffff ---- ')
                            if(suburb_array[0] != local_storage_data[0]['suburbs'][i]['suburb_name'] ){
                                latitude = local_storage_data[0]['suburbs'][i]['latitude']
                                longitude = local_storage_data[0]['suburbs'][i]['longitude']
                                suburb_name = local_storage_data[0]['suburbs'][i]['suburb_name']
                                city = local_storage_data[0]['suburbs'][i]['city']
                                post_code = local_storage_data[0]['suburbs'][i]['post_code']
                                closeTag = "<span class='close'></span>";
                                inputTag = "<input type='hidden' class='tag_input' data-lat='"+latitude+"' data-long='"+longitude+"' data-suburb_name='"+suburb_name+"' data-city='"+city+"' data-post_code='"+post_code+"'>"
                                tagText = local_storage_data[0]['suburbs'][i]['suburb_name'] +','+ local_storage_data[0]['suburbs'][i]['post_code']
                                tag = $("<span data-id='"+0+"' class='tag'>"+
                                    tagText+inputTag+closeTag+
                                    "</span>");
                                    $('.tags_container').prepend(tag)
                                    suburb_array[0]=local_storage_data[0]['suburbs'][i]['suburb_name']
                                    $('.propert_submit_btn_in_find').prop('disabled', false);
                            }
                        }
                        else{
                        console.log('--- in else ---- ')
                        latitude = local_storage_data[0]['suburbs'][i]['latitude']
                                longitude = local_storage_data[0]['suburbs'][i]['longitude']
                                suburb_name = local_storage_data[0]['suburbs'][i]['suburb_name']
                                city = local_storage_data[0]['suburbs'][i]['city']
                                post_code = local_storage_data[0]['suburbs'][i]['post_code']
                                closeTag = "<span class='close'></span>";
                                inputTag = "<input type='hidden' class='tag_input' data-lat='"+latitude+"' data-long='"+longitude+"' data-suburb_name='"+suburb_name+"' data-city='"+city+"' data-post_code='"+post_code+"'>"
                                tagText = local_storage_data[0]['suburbs'][i]['suburb_name'] +','+ local_storage_data[0]['suburbs'][i]['post_code']
                                tag = $("<span data-id='"+0+"' class='tag'>"+
                                    tagText+inputTag+closeTag+
                                    "</span>");
                                    $('.tags_container').prepend(tag)
                                    suburb_array.push(local_storage_data[0]['suburbs'][i]['suburb_name'] )
                                    $('.propert_submit_btn_in_find').prop('disabled', false);

                        }

                    }

                    $('.propert_submit_btn_in_find').prop('disabled', false);
                }
            }
            console.log("------- current_location -after prepend--------",local_storage_data)



        }

        if (current_location == '/find-place/describe-your-ideal-place/rent-timing'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
            console.log("------- current_location ---------",local_storage_data)
            if(local_storage_data.length != 0){
                if(local_storage_data[0]['find_weekly_budget']){
                    $('#find-budget').val(local_storage_data[0]['find_weekly_budget'])
                    $('#find-txtdate').val(local_storage_data[0]['find_move_date'])
                    $('#find-preferred-stay').val(local_storage_data[0]['find_preferred_length_stay'])
                    $('.submit-rent-timing').prop("disabled", false);
                }
            }

        }

        if (current_location == '/find-place/describe-your-ideal-place/property-preferences'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
            console.log("------- current_location ---------",local_storage_data)
            if(local_storage_data.length != 0){
                if(local_storage_data[0]['find_room_furnishing']){
                $.each($(document).find('input[name=find-room_furnishing]'), function(){
                if($(this).val() == local_storage_data[0]['find_room_furnishing'])
                {
                $(this.parentNode).addClass('bedroom-btn-active')
                }
                })

                 $.each($(document).find('input[name=find-internet_type]'), function(){
                if($(this).val() == local_storage_data[0]['find_internet_type'])
                {
                $(this.parentNode).addClass('bedroom-btn-active')
                }
                })

                 $.each($(document).find('input[name=find-bathroom_type]'), function(){
                if($(this).val() == local_storage_data[0]['find_bathroom_type'])
                {
                $(this.parentNode).addClass('bedroom-btn-active')
                }
                })

                 $.each($(document).find('input[name=find-parking_type]'), function(){
                if($(this).val() == local_storage_data[0]['find_parking_type'])
                {
                $(this.parentNode).addClass('bedroom-btn-active')
                }
                })

                 $.each($(document).find('input[name=find-no-of-flatmates]'), function(){
                if($(this).val() == local_storage_data[0]['find_no_of_flatmates'])
                {
                $(this.parentNode).addClass('bedroom-btn-active')
                }
                })
                $('.submit-property-preferences').prop("disabled", false);
                }
            }
        }

        if(current_location == '/find-place/describe-your-ideal-place/introduce-flatmates'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
            console.log("------- current_location ---------",local_storage_data)
            if(local_storage_data.length != 0){
            if(local_storage_data[0]['about_you']){
            $.each($(document).find('input[name=find-place-for]'), function(){
            if($(this).val() == local_storage_data[0]['about_you']['place_for'])
            {
            $(this.parentNode).addClass('bedroom-btn-active')
            $(this).click()
            }
            })
             $('input[name=find_first_name_0]').val(local_storage_data[0]['about_you']['record'][0]['name'])
            $('input[name=your_age_0]').val(local_storage_data[0]['about_you']['record'][0]['age'])

            $.each($(document).find('input[name=find-place-for-gender_0]'), function(){
            if($(this).val() == local_storage_data[0]['about_you']['record'][0]['gender'])
            {
            $(this.parentNode).addClass('bedroom-btn-active')
            $(this).click()
            }
            })

            if(local_storage_data[0]['about_you']['record'][1]){

            $('input[name=find_first_name_1]').val(local_storage_data[0]['about_you']['record'][1]['name'])
            $('input[name=your_age_1]').val(local_storage_data[0]['about_you']['record'][1]['age'])

            $.each($(document).find('input[name=find-place-for-gender_1]'), function(){
            if($(this).val() == local_storage_data[0]['about_you']['record'][1]['gender'])
            {
            $(this.parentNode).addClass('bedroom-btn-active')
            $(this).click()
            }
            })
            }
            if(local_storage_data[0]['about_you']['record'][2]){
            $('input[name=find_first_name_2]').val(local_storage_data[0]['about_you']['record'][1]['name'])
            $('input[name=your_age_2]').val(local_storage_data[0]['about_you']['record'][1]['age'])

            $.each($(document).find('input[name=find-place-for-gender_2]'), function(){
            if($(this).val() == local_storage_data[0]['about_you']['record'][1]['gender'])
            {
            $(this.parentNode).addClass('bedroom-btn-active')
            $(this).click()
            }
            })
            }
            }
            }
        }

        if(current_location == '/find-place/describe-your-ideal-place/employment'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
            console.log("------- current_location ---------",local_storage_data)
            if(local_storage_data.length != 0){
            if(local_storage_data[0]['find_employment_status']){
            for (var i =0 ; i< local_storage_data[0]['find_employment_status'].length;i++){

                if(local_storage_data[0]['find_employment_status'][i] == "working_part_time")
                {
                        $('.find_working_part_time').removeClass('items-cirle-hover')
                        $('.find_working_part_time').addClass('accommodation-listing-item-active')
                        $('.find_working_part_time').find("path").attr('class', 'active_svg_icon');
                        $('.find_working_part_time').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=working_part_time]").attr('checked','checked')

                }
                else if (local_storage_data[0]['find_employment_status'][i] == "working_full_time")
                {
                        $('.find_working_full_time').removeClass('items-cirle-hover')
                        $('.find_working_full_time').addClass('accommodation-listing-item-active')
                        $('.find_working_full_time').find("path").attr('class', 'active_svg_icon');
                        $('.find_working_full_time').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=working_full_time]").attr('checked','checked')

                }

                else if (local_storage_data[0]['find_employment_status'][i] == "working_holiday")
                {
                        $('.find_working_holiday').removeClass('items-cirle-hover')
                        $('.find_working_holiday').addClass('accommodation-listing-item-active')
                        $('.find_working_holiday').find("path").attr('class', 'active_svg_icon');
                        $('.find_working_holiday').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=working_holiday]").attr('checked','checked')

                }

                else if (local_storage_data[0]['find_employment_status'][i] == "retired")
                {
                        $('.find_retired').removeClass('items-cirle-hover')
                        $('.find_retired').addClass('accommodation-listing-item-active')
                        $('.find_retired').find("path").attr('class', 'active_svg_icon');
                        $('.find_retired').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=retired]").attr('checked','checked')

                }

                else if (local_storage_data[0]['find_employment_status'][i] == "unemployed")
                {
                        $('.find_unemployed').removeClass('items-cirle-hover')
                        $('.find_unemployed').addClass('accommodation-listing-item-active')
                        $('.find_unemployed').find("path").attr('class', 'active_svg_icon');
                        $('.find_unemployed').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=unemployed]").attr('checked','checked')

                }

                else if (local_storage_data[0]['find_employment_status'][i] == "backpacker")
                {
                        $('.find_backpacker').removeClass('items-cirle-hover')
                        $('.find_backpacker').addClass('accommodation-listing-item-active')
                        $('.find_backpacker').find("path").attr('class', 'active_svg_icon');
                        $('.find_backpacker').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=backpacker]").attr('checked','checked')

                }

                else if (local_storage_data[0]['find_employment_status'][i] == "student")
                {
                        $('.find_student').removeClass('items-cirle-hover')
                        $('.find_student').addClass('accommodation-listing-item-active')
                        $('.find_student').find("path").attr('class', 'active_svg_icon');
                        $('.find_student').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=student]").attr('checked','checked')

                }
            }
            }
            }
        }

        if(current_location == '/find-place/describe-your-ideal-place/lifestyle'){
            var local_storage_data = JSON.parse(localStorage.getItem('find_place_record'))
            console.log("------- current_location ---------",local_storage_data)
            if(local_storage_data.length != 0){
            if(local_storage_data[0]['find_lifestyle']){
            for (var i =0 ; i< local_storage_data[0]['find_lifestyle'].length;i++){

                if(local_storage_data[0]['find_lifestyle'][i] == "smoker")
                {
                        $('.find_smoker').removeClass('items-cirle-hover')
                        $('.find_smoker').addClass('accommodation-listing-item-active')
                        $('.find_smoker').find("path").attr('class', 'active_svg_icon');
                        $('.find_smoker').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=smoker]").attr('checked','checked')

                }

                else if(local_storage_data[0]['find_lifestyle'][i] == "lgbti")
                {
                        $('.find_lgbti').removeClass('items-cirle-hover')
                        $('.find_lgbti').addClass('accommodation-listing-item-active')
                        $('.find_lgbti').find("path").attr('class', 'active_svg_icon');
                        $('.find_lgbti').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=lgbti]").attr('checked','checked')

                }

                else if(local_storage_data[0]['find_lifestyle'][i] == "pets")
                {
                        $('.find_pets').removeClass('items-cirle-hover')
                        $('.find_pets').addClass('accommodation-listing-item-active')
                        $('.find_pets').find("path").attr('class', 'active_svg_icon');
                        $('.find_pets').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=pets]").attr('checked','checked')

                }

                else if(local_storage_data[0]['find_lifestyle'][i] == "children")
                {
                        $('.find_children').removeClass('items-cirle-hover')
                        $('.find_children').addClass('accommodation-listing-item-active')
                        $('.find_children').find("path").attr('class', 'active_svg_icon');
                        $('.find_children').prepend('<div src="" class="active_tick_icon"></div>');
                        $("input[id=children]").attr('checked','checked')

                }
            }
            }
            }
        }


    })
})