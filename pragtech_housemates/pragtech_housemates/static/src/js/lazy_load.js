odoo.define('pragtech_flatmates.lazy_load', function (require)
    {
    $(document).ready(function()
    {
//    console.log ("Document Height",$(document).height());
//    console.log ("Window Height",$(window).height());
//    console.log ("Window Scroll Top",$(window).scrollTop());
    var lazy_load_repeat = 0;
    var fix_record_id=''
    var record_id = 0;

    var lock_scroll = false;

     $.ajax({
                url: '/get_id_of_last_record',
                type:'POST',
                dataType: 'json',
                async:false,
                data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {}}),
                contentType: 'application/json',
                success: function(data)
                {
                fix_record_id=data['result']['id']+1
                console.log("---data---get_id_of_last_record---",fix_record_id)
                record_id=fix_record_id

                }
           })
      console.log("---data---get_id_of_last_record--22222-",fix_record_id)



    function getURLparameters()
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        filters =[]
        domain = {}
    //            console.log ("In If loop ----------------------------",sPageURL)
    //            console.log ("In If loop ----------------------------",sURLVariables)
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
//            console.log ("In If loop -------------------11---------",sParameterName[0])
//            console.log ("In If loop -------------------11---------",sParameterName[1])
            if (sParameterName[1])
            {
                domain[sParameterName[0]]=sParameterName[1]
            }
        }
        filters.push(domain)
//        console.log("Filtersssss",filters)
        return filters
    }

    function load_data(last_record_fetched, filters, button_name)
    {
//        console.log ('Execution Time',record_id)
        console.log ("Buttttttttton", last_record_fetched, filters, button_name)

        if (button_name = 'home')
        {
            var data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id' : last_record_fetched, 'filters' : filters}})
        }
        if (button_name = 'shortlist')
        {
            var data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id' : last_record_fetched, 'filters' : filters}})
        }
        if (button_name == 'find' || button_name == 'list')
        {
            var data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id' : last_record_fetched, 'filters' : filters}})
        }
        if (last_record_fetched && filters)
        {
            console.log ("Insidddddddddddddddddddddddddddddddde")
            var data = JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id' : last_record_fetched, 'filters' : filters}})
        }

        $.ajax({
                    url: '/get_product',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: data,
                    beforeSend: function() {
                     $('.shortlist_loader').show();
                     },

                    success: function(data)
                    {$('.shortlist_loader').hide();
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",last_record_fetched)
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",lazy_load_repeat)

                        if (last_record_fetched == fix_record_id && lazy_load_repeat == 0 || last_record_fetched != fix_record_id && lazy_load_repeat == 1)
                        {
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",last_record_fetched == 0 && lazy_load_repeat == 0)
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",last_record_fetched != 0 && lazy_load_repeat == 1)

                            lazy_load_repeat = 1



                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",last_record_fetched)
                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",lazy_load_repeat)
                        if (data['result'] && data['result'].length == 0 ){$("#load_symbol").hide()}

                        var div = $("#lazy_load");
                        var shortlist_msg_div = $(".empty-shortlist");
                        var data_shortlist = $(".data-shortlist");
//                        console.log ("Divvvvvvvvvvvv", div)
                        for (index=0 ; index<data['result'].length; index++)
                        {

                            console.log ("Indexxxxx",data['result'][index]['id'])
                            record_id = data['result'][index]['id']
                            if (data['result'][index]['image'] != 'undefined')
                                image = data['result'][index]['image']
                            else
                                image=''
                            description = data['result'][index]['description']
                            weekly_budget = data['result'][index]['weekly_budget']
                            street = data['result'][index]['street']
                            city = data['result'][index]['city']
                            bathrooms = data['result'][index]['bathrooms']
                            bedrooms = data['result'][index]['bedrooms']
                            flatmates = data['result'][index]['flatmates']
                            name = data['result'][index]['name']
                            age = data['result'][index]['age']
                            gender = data['result'][index]['gender']
                            short_list = data['result'][index]['is_short_list']
                            display_string=data['result'][index]['display_string']



                            open_main_div = '<div class="col-lg-3 col-sm-6 col-xs-12 property-content col-md-6">'
                            link_open_div = '<a href="#" type="button" class="property_button" data-button-id='+record_id+' >'
                            open_image_div = '<div class="property-img"><img src=data:image/jpeg;base64,'+image+' class="img-fluid"/>'
                            close_image_div = '</div>'
                            // // Code commented by himesh
                            //star_div = '<div class="shortlist"><a href="#222" class="default-shortlist shortlist-button"><svg class="star" viewBox="0 0 64 61"><path class="fill" d="M63.922 23.13c-.195-.602-.726-1.03-1.354-1.095l-20.652-2.18L33.458.864c-.512-1.154-2.407-1.154-2.92 0l-8.454 18.99-20.652 2.18C.804 22.1.275 22.53.078 23.13c-.194.6-.02 1.26.45 1.684l15.43 13.918-4.31 20.336c-.13.62.112 1.256.624 1.627.28.203.608.305.938.305.276 0 .552-.07.8-.215L32 50.398l17.992 10.387c.544.315 1.226.278 1.738-.092.51-.37.756-1.008.625-1.625l-4.31-20.338 15.43-13.918c.466-.422.64-1.08.447-1.68z"></path></svg></a></div>'
                            // Code added by dhrup
                            if (short_list.toString() == 'true')
                            	star_div = '<div class="shortlist"><a href="/add_shortlists" class="shortlisted shortlist-button"><svg class="star" viewBox="0 0 64 61"><path class="fill" d="M63.922 23.13c-.195-.602-.726-1.03-1.354-1.095l-20.652-2.18L33.458.864c-.512-1.154-2.407-1.154-2.92 0l-8.454 18.99-20.652 2.18C.804 22.1.275 22.53.078 23.13c-.194.6-.02 1.26.45 1.684l15.43 13.918-4.31 20.336c-.13.62.112 1.256.624 1.627.28.203.608.305.938.305.276 0 .552-.07.8-.215L32 50.398l17.992 10.387c.544.315 1.226.278 1.738-.092.51-.37.756-1.008.625-1.625l-4.31-20.338 15.43-13.918c.466-.422.64-1.08.447-1.68z"></path></svg></a></div>'
                            else
                            	star_div = '<div class="shortlist"><a href="/add_shortlists" class="default-shortlist shortlist-button"><svg class="star" viewBox="0 0 64 61"><path class="fill" d="M63.922 23.13c-.195-.602-.726-1.03-1.354-1.095l-20.652-2.18L33.458.864c-.512-1.154-2.407-1.154-2.92 0l-8.454 18.99-20.652 2.18C.804 22.1.275 22.53.078 23.13c-.194.6-.02 1.26.45 1.684l15.43 13.918-4.31 20.336c-.13.62.112 1.256.624 1.627.28.203.608.305.938.305.276 0 .552-.07.8-.215L32 50.398l17.992 10.387c.544.315 1.226.278 1.738-.092.51-.37.756-1.008.625-1.625l-4.31-20.338 15.43-13.918c.466-.422.64-1.08.447-1.68z"></path></svg></a></div>'

                            property_name_div = '<p class="property-listing-subheading">'+display_string+'</p>'
                            description = description.replace(/<[^>]+>/ig, '');
                            description_div = '<p class="property-listing-para">'+description+'</p>'

                            free_to_message_div = '<div class="property listing-tile-contact"><span class="icon"><svg class="message-icon" viewBox="0 0 50 50"><g><path fill="none" d="M0 0h50v50H0z"></path><path class="fill" d="M50 12.436L34.885 25.59 50 37.487v-25.05zM21.666 28.642C23.072 29.867 24.466 30 25 30s1.928-.133 3.334-1.358C29.752 27.406 48.046 11.487 50 9.786V7H0v2.78c3.012 2.623 20.3 17.67 21.666 18.862z"></path><path class="fill" d="M33.35 26.928l-3.702 3.222C27.73 31.82 25.758 32 25 32s-2.73-.18-4.648-1.85c-.35-.307-1.76-1.534-3.7-3.224L0 40.076V43h50v-2.97L33.35 26.93zM15.115 25.59L0 12.43v25.095L15.115 25.59z"></path></g></svg><span class="icon-label">Free to message</span></span></div>'
                            link_close_div = '</a>'
                            close_main_div ='</div>'

//                            console.log ("12333333")


                            if (button_name == 'shortlist')
                            {
                                //console.log (shortlist_msg_div)
                                //console.log (data_shortlist)
                                if (!shortlist_msg_div.hasClass('d-none'))
                                    shortlist_msg_div.addClass('d-none')
                                if (data_shortlist.hasClass('d-none'))
                                    data_shortlist.removeClass('d-none')
                            }

                            if (data['result'][index]['listing_type'] == 'list')
                            {
                                if(city && street){
                                street_div = '<p class="property-listing-heading mt-2">'+street+', '+city+'</p>'
                                }
                                else if(city){
                                street_div = '<p class="property-listing-heading mt-2">'+city+'</p>'
                                }
                                else if(street){
                                street_div = '<p class="property-listing-heading mt-2">'+street+'</p>'
                                }
                                else{
                                street_div = '<p class="property-listing-heading mt-2"> </p>'
                                }


                                orange_image_ribbion = '<div class="propety-ribbon-orange">New |  $'+weekly_budget+'</div>'

                                list_bedroom_div = '<div class="property-listing-icons"><div class="listing-icon"><span class="icon"><svg class="bedroom" viewBox="0 0 50 50"><path class="stroke" fill="none" d="M25 11C4.8 11 1 14.7 1 18.4V49h6v-3h36v3h6V42.8 18.4c0-3.7-3.8-7.4-24-7.4zM49 26H1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10"></path><path class="stroke" fill="none" d="M5 22.4c0-3.6 1.8-5.4 9-5.4s9 1.8 9 5.4V26H5v-3.6zM27 22.4c0-3.6 1.8-5.4 9-5.4s9 1.8 9 5.4V26H27v-3.6z" stroke-width="2.002" stroke-linecap="round" stroke-miterlimit="10"></path></svg><span class="icon-label">'+bedrooms+'</span></span></div></div>'
                                list_bathroom_div = '<div class="property-listing-icons"><div class="listing-icon"><span class="icon"><svg class="bathroom" viewBox="0 0 50 50"><path class="stroke" fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" d="M1 22h48v4H1z"></path><path class="stroke" fill="none" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="10" d="M49 26c-1.7 0-3 1.3-3 3v5c0 5.5-4.5 10-10 10H14C8.5 44 4 39.5 4 34v-5c0-1.7-1.3-3-3-3M41 47c-1.7 0-3-1.3-3-3M9 47c1.7 0 3-1.3 3-3"></path><path class="stroke" fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" d="M39 6c0-2.8 2.2-5 5-5s5 2.2 5 5v16"></path><path class="stroke" fill="none" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10" d="M43 10h-8c0-2.2 1.8-4 4-4s4 1.8 4 4z"></path><circle class="fill" cx="39" cy="13" r="1"></circle><circle class="fill" cx="39" cy="16" r="1"></circle><circle class="fill" cx="39" cy="19" r="1"></circle><circle class="fill" cx="42" cy="13" r="1"></circle><circle class="fill" cx="43" cy="16" r="1"></circle><circle class="fill" cx="44" cy="19" r="1"></circle><circle class="fill" cx="36" cy="13" r="1"></circle><circle class="fill" cx="35" cy="16" r="1"></circle><circle class="fill" cx="34" cy="19" r="1"></circle></svg><span class="icon-label">'+bathrooms+'</span></span></div></div>'
                                list_occupant_div = '<div class="property-listing-icons"><div class="listing-icon"><span class="icon"><svg class="occupant" viewBox="0 0 50 50"><g><path fill="none" class="stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M29.4 30.7c-.1-1.5-.1-2.5-.1-3.8.7-.3 1.8-2.6 2-4.4.5 0 1.3-.6 1.6-2.6.1-1.1-.3-1.8-.7-1.9 1.6-2 1.3-10.2-4.6-10.2L26.8 6c-8.4 0-11.5 6.5-9.1 12-.3.2-.8.8-.7 1.9.2 2 1.1 2.5 1.6 2.6.2 1.9 1.4 4.1 2.1 4.4 0 1.3 0 2.4-.1 3.8C19 34.9 8.4 33.7 7.9 42h34.2c-.5-8.3-11.1-7.1-12.7-11.3z"></path><path fill="none" class="stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.1 12.5c-.3-.1-.7-.1-1-.1l-.7-1.4c-6.4 0-8.8 5-6.9 9.3-.2.1-.6.6-.5 1.5.2 1.6.8 2 1.2 2 .2 1.5 1.1 3.2 1.6 3.5 0 1 0 1.8-.1 3-1.2 3.3-9.3 2.4-9.7 8.8h7M42 39h7c-.4-6.4-8.4-5.5-9.6-8.8-.1-1.1-.1-1.9-.1-3 .5-.3 1.4-2 1.5-3.4.4 0 1-.4 1.2-2 .1-.8-.2-1.4-.5-1.5 1.2-1.6 1-7.9-3.5-7.9l-.6-1.4c-1.6 0-3.3.2-4.7.8"></path></g></svg><span class="icon-label">'+flatmates+'</span></span></div></div>'
                                list_details_div = '<div class="listing-tile-stats">'+list_bedroom_div+list_bathroom_div+list_occupant_div+'</div>'

                                var list_div = open_main_div+link_open_div+open_image_div+orange_image_ribbion+close_image_div+link_close_div+star_div+link_open_div+street_div+property_name_div+description_div+link_close_div+list_details_div+free_to_message_div+close_main_div

                                div.append(list_div)
                            }

                            if (data['result'][index]['listing_type'] == 'find')
                            {
                                if (gender)
                                    gender = gender.charAt(0).toUpperCase() + gender.slice(1)
                                name_div = '<p class="property-listing-heading mt-2">'+name+'</p>'

                                blue_image_ribbion = '<div class="propety-ribbon-blue">New |  $'+weekly_budget+'</div>'
                                age_gender_div = '<div class="listing-tile-stats"><div class="person-listing-icons"><span>'+gender+'</span><span class="listing-tile-applicant-age-stats">'+age+'</span></div></div>'

                                var find_div = open_main_div+link_open_div+open_image_div+blue_image_ribbion+close_image_div+link_close_div+star_div+link_open_div+name_div+property_name_div+description_div+link_close_div+age_gender_div+free_to_message_div+close_main_div
                                div.append(find_div)
                            }
                        }







//                            if (data['result'][index]['listing_type'] == 'List'){
//                                console.log('******************************* ',data['result'][index]['is_listing'])
//                                var weekly_rent = data['result'][index]['weekly_budget']
//                                div.append('<div class="col-lg-3 col-sm-3 col-xs-12 property-content"><a href="#" type="button" class="property_button" data-button-id='+record_id+' ><div class="property-img"><img src=data:image/jpeg;base64,'+image+' class="img-fluid"/><div class="list-ribbon"> New |  $'+weekly_rent+'</div></div><p class="property-listing-heading mt-2">'+street+','+city+'</p><p class="property-listing-subheading">To be added</p><p class="property-listing-para">'+description+'</p></a><div class="listing-tile-stats"><div class="property listing-tile-contact"><span class="icon"><svg class="message-icon" viewBox="0 0 50 50"><g><path fill="none" d="M0 0h50v50H0z"></path><path class="fill" d="M50 12.436L34.885 25.59 50 37.487v-25.05zM21.666 28.642C23.072 29.867 24.466 30 25 30s1.928-.133 3.334-1.358C29.752 27.406 48.046 11.487 50 9.786V7H0v2.78c3.012 2.623 20.3 17.67 21.666 18.862z"></path><path class="fill" d="M33.35 26.928l-3.702 3.222C27.73 31.82 25.758 32 25 32s-2.73-.18-4.648-1.85c-.35-.307-1.76-1.534-3.7-3.224L0 40.076V43h50v-2.97L33.35 26.93zM15.115 25.59L0 12.43v25.095L15.115 25.59z"></path></g></svg><span class="icon-label">Free to message</span></span></div></div></div>')
//                            }
//                            if (data['result'][index]['listing_type'] == 'Find'){
//                                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ :',data['result'][index]['is_finding'])
//
//                                div.append('<div class="col-lg-3 col-sm-3 col-xs-12 property-content"><a href="#" type="button" class="property_button" data-button-id='+record_id+' ><div class="property-img"><img src=data:image/jpeg;base64,'+image+' class="img-fluid"/><div class="find-ribbon"> New |  $'+weekly_budget+'</div></div><p class="property-listing-heading mt-2">'+street+','+city+'</p><p class="property-listing-subheading">To be added</p><p class="property-listing-para">'+description+'</p></a><div class="listing-tile-stats"><div class="property listing-tile-contact"><span class="icon"><svg class="message-icon" viewBox="0 0 50 50"><g><path fill="none" d="M0 0h50v50H0z"></path><path class="fill" d="M50 12.436L34.885 25.59 50 37.487v-25.05zM21.666 28.642C23.072 29.867 24.466 30 25 30s1.928-.133 3.334-1.358C29.752 27.406 48.046 11.487 50 9.786V7H0v2.78c3.012 2.623 20.3 17.67 21.666 18.862z"></path><path class="fill" d="M33.35 26.928l-3.702 3.222C27.73 31.82 25.758 32 25 32s-2.73-.18-4.648-1.85c-.35-.307-1.76-1.534-3.7-3.224L0 40.076V43h50v-2.97L33.35 26.93zM15.115 25.59L0 12.43v25.095L15.115 25.59z"></path></g></svg><span class="icon-label">Free to message</span></span></div></div></div>')
//
//                            }

//                            console.log ("Record ID",record_id,"Img Source",img_src)
//                             div.append('<div class="col-md-3" style="height:320px">' +\
//data:image/jpeg;base64,
//                            div.append('<div class="test"><input field="text" id="property_id" value='+record_id+' hidden=true/><a href="#" type="button" id="property_button" style="text-decoration:none;" data-button-id='+record_id+' ><img src=data:image/jpeg;base64,'+img_src+' class="img-fluid"/><h5>'+area+'</h5><h7>'+title+'</h7><br/><p style="max-height:60px;overflow:hidden">'+description+'</p></a><p>Details about property</p><p align="center" >Text</p></div>')
//                            div.append('<div class="test"> <img src="http://lorempixel.com/700/450" /> </div>')

                            //commented by sagar
//                            div.append('<div class="col-lg-3 col-sm-3 col-xs-12 property-content"><a href="#" type="button" class="property_button" data-button-id='+record_id+' ><div class="property-img"><img src=data:image/jpeg;base64,'+image+' class="img-fluid"/><div class="propety-ribbon">[New |  $300]</div></div><p class="property-listing-heading mt-2">'+street+','+city+'</p><p class="property-listing-subheading">To be added</p><p class="property-listing-para">'+description+'</p></a><div class="listing-tile-stats"><div class="property listing-tile-contact"><span class="icon"><svg class="message-icon" viewBox="0 0 50 50"><g><path fill="none" d="M0 0h50v50H0z"></path><path class="fill" d="M50 12.436L34.885 25.59 50 37.487v-25.05zM21.666 28.642C23.072 29.867 24.466 30 25 30s1.928-.133 3.334-1.358C29.752 27.406 48.046 11.487 50 9.786V7H0v2.78c3.012 2.623 20.3 17.67 21.666 18.862z"></path><path class="fill" d="M33.35 26.928l-3.702 3.222C27.73 31.82 25.758 32 25 32s-2.73-.18-4.648-1.85c-.35-.307-1.76-1.534-3.7-3.224L0 40.076V43h50v-2.97L33.35 26.93zM15.115 25.59L0 12.43v25.095L15.115 25.59z"></path></g></svg><span class="icon-label">Free to message</span></span></div></div></div>')


                        lock_scroll = false
                        //$("#load_symbol").replaceWith('<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div>')
                    }
                    }
                });
    }


        var siteurl= $(window.location)

        if (siteurl.attr('pathname') === '/' && record_id == fix_record_id)
        {
        filters =[]
        domain = {}

        domain['listing_type']='home'
        filters.push(domain)
        load_data(record_id, filters, 'home')
        }

        if (siteurl.attr('pathname') === '/search/records')
        {
        var filters = getURLparameters()
        load_data(record_id, filters, filters[0]['listing_type'])
        }

        if (siteurl.attr('pathname') === '/shortlists' && record_id == fix_record_id)
        {
        filters =[]
        domain = {}

        domain['listing_type']='shortlist'
        filters.push(domain)
        load_data(record_id, filters, 'shortlist')
        }


        $(window).scroll(function ()
        {
//    console.log ("Document Height",$(document).height());
//    console.log ("Window Height",$(window).height());
//    console.log ("Window Scroll Top",$(window).scrollTop());
//    console.log ("Difference Scroll Top",$(window).scrollTop(),$(document).height() - $(window).height() - 100)
            if (siteurl.attr('pathname') === '/')
            {
            filters =[]
            domain = {}

            domain['listing_type']='home'
            filters.push(domain)
//                console.log("Testingggggggggggg")
                if ($(window).scrollTop()>= $(document).height() - $(window).height() - 270)
                {

                    if (lock_scroll == false)
                    {
                        console.log ("------------------- Difference Scroll Top",record_id)
                        lock_scroll = true
                        setTimeout(function() {
                        load_data(record_id, filters, 'home')
                        }, 1000)

                    }


                }
            }

            if (siteurl.attr('pathname') === '/search/records')
            {

                if ($(window).scrollTop()>= $(document).height() - $(window).height() - 270)
                {

                    if (lock_scroll == false)
                    {
//                    console.log ("------------------- Difference Scroll Top",$(window).scrollTop(),$(document).height() - $(window).height() - 100)
                        lock_scroll = true
                        setTimeout(function() {
                        var filters = getURLparameters()
                        load_data(record_id, filters, filters[0]['listing_type'])
                        }, 1000)

                    }


                }
            }

            if (siteurl.attr('pathname') === '/shortlists')
            {
            filters =[]
            domain = {}

            domain['listing_type']='shortlist'
            filters.push(domain)
//                console.log("Testingggggggggggg")
                if ($(window).scrollTop()>= $(document).height() - $(window).height() - 270)
                {

                    if (lock_scroll == false)
                    {
//                    console.log ("------------------- Difference Scroll Top",$(window).scrollTop(),$(document).height() - $(window).height() - 100)
                        lock_scroll = true
                        setTimeout(function() {
                        load_data(record_id, filters, 'shortlist')
                        }, 1000)

                    }


                }
            }

        });


     });
});

