odoo.define('pragtech_flatmates.lazy_load', function (require)
    {
    $(document).ready(function()
    {
//    console.log ("Document Height",$(document).height());
//    console.log ("Window Height",$(window).height());
//    console.log ("Window Scroll Top",$(window).scrollTop());

    var record_id = 0;
    var lock_scroll = false;
    function load_data(last_record_fetched)
    {
//        console.log ('Execution Time',record_id)
//        console.log (last_record_fetched)
        $.ajax({
                    url: '/get_product',
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": { 'record_id' : last_record_fetched}}),
                    success: function(data)
                    {

//                        console.log ("Dataaaaaaaaaaaaaaaaaaaaaaaa",data['result'].length)
                        if (data['result'].length == 0){$("#load_symbol").hide()}

                        var div = $("#lazy_load");
//                        console.log ("Divvvvvvvvvvvv", div)
                        for (index=0 ; index<data['result'].length; index++)
                        {

                            console.log ("Indexxxxx",data['result'][index]['id'])
                            record_id = data['result'][index]['id']
                            image = data['result'][index]['image']
                            street = data['result'][index]['street']
                            city = data['result'][index]['city']
                            description = data['result'][index]['description']
//                            console.log ("Record ID",record_id,"Img Source",img_src)
//                             div.append('<div class="col-md-3" style="height:320px">' +\
//data:image/jpeg;base64,
//                            div.append('<div class="test"><input field="text" id="property_id" value='+record_id+' hidden=true/><a href="#" type="button" id="property_button" style="text-decoration:none;" data-button-id='+record_id+' ><img src=data:image/jpeg;base64,'+img_src+' class="img-fluid"/><h5>'+area+'</h5><h7>'+title+'</h7><br/><p style="max-height:60px;overflow:hidden">'+description+'</p></a><p>Details about property</p><p align="center" >Text</p></div>')
//                            div.append('<div class="test"> <img src="http://lorempixel.com/700/450" /> </div>')
                            div.append('<div class="col-lg-3 col-sm-3 col-xs-12 property-content"><a href="#" type="button" class="property_button" data-button-id='+record_id+' ><div class="property-img"><img src=data:image/jpeg;base64,'+image+' class="img-fluid"/><div class="propety-ribbon">[New |  $300]</div></div><p class="property-listing-heading mt-2">'+street+','+city+'</p><p class="property-listing-subheading">To be added</p><p class="property-listing-para">'+description+'</p></a><div class="listing-tile-stats"><div class="property listing-tile-contact"><span class="icon"><svg class="message-icon" viewBox="0 0 50 50"><g><path fill="none" d="M0 0h50v50H0z"></path><path class="fill" d="M50 12.436L34.885 25.59 50 37.487v-25.05zM21.666 28.642C23.072 29.867 24.466 30 25 30s1.928-.133 3.334-1.358C29.752 27.406 48.046 11.487 50 9.786V7H0v2.78c3.012 2.623 20.3 17.67 21.666 18.862z"></path><path class="fill" d="M33.35 26.928l-3.702 3.222C27.73 31.82 25.758 32 25 32s-2.73-.18-4.648-1.85c-.35-.307-1.76-1.534-3.7-3.224L0 40.076V43h50v-2.97L33.35 26.93zM15.115 25.59L0 12.43v25.095L15.115 25.59z"></path></g></svg><span class="icon-label">Free to message</span></span></div></div></div>')
                        }

                        lock_scroll = false
                        //$("#load_symbol").replaceWith('<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div>')
                    },
                });
    }


        var siteurl= $(window.location)

        if (siteurl.attr('pathname') === '/' && record_id == 0)
        {
//        console.log ("In If loop ----------------------------")
        load_data(0)
        }

        $(window).scroll(function ()
        {
//    console.log ("Document Height",$(document).height());
//    console.log ("Window Height",$(window).height());
//    console.log ("Window Scroll Top",$(window).scrollTop());
//    console.log ("Difference Scroll Top",$(window).scrollTop(),$(document).height() - $(window).height() - 100)
            if (siteurl.attr('pathname') === '/')
            {
//                console.log("Testingggggggggggg")
                if ($(window).scrollTop()>= $(document).height() - $(window).height() - 270)
                {

                    if (lock_scroll == false)
                    {
//                    console.log ("------------------- Difference Scroll Top",$(window).scrollTop(),$(document).height() - $(window).height() - 100)
                        lock_scroll = true
                        setTimeout(function() {
                        load_data(record_id);
                        }, 1000)

                    }


                }
            }
        });


    });
});
