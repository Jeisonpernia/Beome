odoo.define('pragtech_flatmates.list_place', function (require)
{// Start of Odoo Deine
$(document).ready(function()
{// Start of document

     "use strict";

     // For display popup message(tooltip) on Property address field
    $('[data-toggle="tooltip"]').tooltip();
    ////////////////////////////////////////////
//  ======================================================
//  = --------------  General Statements  -------------- =
//  ======================================================
//  Note: These below statement get executed if we hit
//  any of the path mention in if condition

    var window_pathname = window.location.pathname

    if (window_pathname.includes('about-others'))
    {
//        console.log ("In general statement if (window_pathname.includes('about-others'))")
        if ($(this).find("#comment").val().length<10)
            $('.about-others-nxt-btn').prop("disabled", true)
    }


   if (window.location.pathname == '/listplace/whole-property/about')
    {

//        console.log ("In general statement if (window.location.pathname == '/listplace/whole-property/about'))")
        var room_type = JSON.parse(localStorage.getItem('list_place_array'));

        if (room_type[0]['whole_property_property_type'] == '1_bedrooms' || room_type[0]['whole_property_property_type'] == 'studio')
        {
            $('.about_total_bedrooms').addClass('d-none');
            $('.about_total_bathrooms').addClass('d-none')
        }

    }

    if (window.location.pathname == '/listplace/share-house/flatmate-preference')
    {
        //console.log ("In general statement if (window.location.pathname == '/listplace/share-house/flatmate-preference')",$(document).find('input[name="flatmate_Preference_type"]:checked'))
        if ($(document).find('input[name="flatmate_Preference_type"]:checked').length == 0)
            $(".flatmate-pref-nxt-btn").prop("disabled",false)
//        else

    }


//  = --------------  End of General Statements  -------------- =

//  ================================================================================================
//  = --------------  Validations for /listplace/describe-your-place/accommodation  -------------- =
//  ================================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above




//  = --------------  End of Validations for /listplace/describe-your-place/accommodation  -------------- =

//  ===============================================================================================
//  = --------------  Validations for /list-place/share-house/flatmate-preference  -------------- =
//  ===============================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above

  $(".bedroom-btn > input[name='flatmate_Preference_type']:radio").click(function() {
    //console.log ("In template /list-place/share-house/flatmate-preference")

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


// Room availability
// Code added  by dhrup
        $('#txtdate').on('keyup change',function()
        		{
        		    $('#txtdate').prop("readonly",true)

        		});

//  =======================================================================================
//  = --------------  Validations for /listplace/share-house/about-others  -------------- =
//  = -------------  Validations for /listplace/share-house/about-property  ------------- =
//  =======================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above

    $("#comment").keyup(function()
    {
//        console.log ($(this).val().length)
        //console.log ("In template /listplace/share-house/about-others -- or -- /listplace/share-house/about-property")
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


//  ==========================================================================================
//  = --------------  Validations for /listplace/share-house/property-images  -------------- =
//  ==========================================================================================
//  Note: Check whether this js is not visible on other than two pages mentioned in a
//  comment above

//  document.getElementById('upload').addEventListener('change', handleFileSelect, false);

//  function handleFileSelect(evt) {
//    var files = evt.target.files; // FileList object
//    console.log (files)
//    // Loop through the FileList and render image files as thumbnails.
//    for (var i = 0, f; f = files[i]; i++) {
//        console.log (f)
//      // Only process image files.
//      if (!f.type.match('image.*')) {
//        continue;
//      }
//
//      var reader = new FileReader();
//
//      // Closure to capture the file information.
//      reader.onload = (function(theFile) {
//        return function(e) {
//          // Render thumbnail.
//          console.log ("EEEE",e)
////          var span = document.createElement('span');
////          span.innerHTML = ['<img class="thumb" src="', e.target.result,
////                            '" title="', escape(theFile.name), '"/>'].join('');
////          document.getElementById('list').insertBefore(span, null);
//        };
//      })(f);
//
//      // Read in the image file as a data URL.
//      reader.readAsDataURL(f);
//    }
//  }

    //form data of Property and room images Page
    $('#property_images_form_id').submit(function( event )
    {
        var oldArray = JSON.parse(localStorage.getItem('list_place_array'));
        if (array_of_image)
            oldArray[0]['property_images'] = array_of_image
        localStorage.setItem('list_place_array', JSON.stringify(oldArray));

        //console.log('hereeeeeeeeeeeeeeeeeeeeeeeeee',array_of_image);
        //console.log('LOCAL STORAGE 33 : ',localStorage.getItem('list_place_array'))

    });

    $('.scroll-forward').on('click',function()
    {
        $('.scrolling-wrapper').animate( { scrollLeft: '+=360' }, 400 , 'easeOutSine');
    });

    $('.scroll-backward').on('click',function()
    {
        $('.scrolling-wrapper').animate( { scrollLeft: '-=360' }, 400, 'easeOutSine');
    });

    $( ".scrolling-wrapper" ).scroll(function()
    {

    //        console.log ("Scroll - Client ----------",$('.scrolling-wrapper')[0].scrollWidth - $('.scrolling-wrapper')[0].clientWidth)
//            console.log ("------1",$('.scrolling-wrapper').scrollLeft())
//            console.log ($(document).find('.scrolling-wrapper')[1].scrollLeft)
    //        .scrollLeftMax
    //        console.log ($('.scrolling-wrapper').scrollLeft())

        if (window_pathname.includes('list_place_preview'))
        {
//            console.log ("Scroll -----------",$(document).find('.scrolling-wrapper')[1].scrollWidth)
//            console.log ("Client -----------",$(document).find('.scrolling-wrapper')[1].clientWidth)
//            console.log ("Scroll - Client ----------",$('.scrolling-wrapper')[1].scrollWidth - $('.scrolling-wrapper')[1].clientWidth)
//            console.log ($(document).find('.scrolling-wrapper')[1].scrollLeft)
//            console.log ($(document).find('.scroll-forward')[1])
//            if (($(document).find('.scrolling-wrapper')[1].scrollWidth - $(document).find('.scrolling-wrapper')[1].clientWidth) == $(document).find('.scrolling-wrapper')[1].scrollLeft)
//                $(document).find('.scroll-forward')[1].addClass("d-none")
//            if (($(document).find('.scrolling-wrapper')[1].scrollWidth - $(document).find('.scrolling-wrapper')[1].clientWidth) != $(document).find('.scrolling-wrapper')[1].scrollLeft)
//                $(document).find('.scroll-forward')[1].removeClass("d-none")
//            if ($('.scrolling-wrapper')[1].scrollLeft!=0)
//                $(document).find('.scroll-backward')[1].removeClass("d-none")
//            if ($('.scrolling-wrapper')[1].scrollLeft==0)
//                $(document).find('.scroll-backward')[1].addClass("d-none")
        }
        else
        {
            if (($('.scrolling-wrapper')[0].scrollWidth - $('.scrolling-wrapper')[0].clientWidth) == $('.scrolling-wrapper').scrollLeft())
                $('.scroll-forward').addClass("d-none")
            if (($('.scrolling-wrapper')[0].scrollWidth - $('.scrolling-wrapper')[0].clientWidth) != $('.scrolling-wrapper').scrollLeft())
                $('.scroll-forward').removeClass("d-none")
            if ($('.scrolling-wrapper').scrollLeft()!=0)
                $('.scroll-backward').removeClass("d-none")
            if ($('.scrolling-wrapper').scrollLeft()==0)
                $('.scroll-backward').addClass("d-none")
        }
        //console.log ("In Scroll Event")
    });




/* ------------------------------ Temp */

    $('.scroll-property-forward').on('click',function()
    {
        $('.property-wrapper').animate( { scrollLeft: '+=360' }, 400 , 'easeOutSine');
    });

    $('.scroll-property-backward').on('click',function()
    {
        $('.property-wrapper').animate( { scrollLeft: '-=360' }, 400, 'easeOutSine');
    });

    $( ".property-wrapper" ).scroll(function() {

        //console.log ($('.property-wrapper')[0].scrollWidth - $('.property-wrapper')[0].clientWidth)
        //console.log ($('.property-wrapper').scrollLeft())
//        .scrollLeftMax
        //console.log ($('.property-wrapper').scrollLeft())
        if (($('.property-wrapper')[0].scrollWidth - $('.property-wrapper')[0].clientWidth) == $('.property-wrapper').scrollLeft())
            $('.scroll-property-forward').addClass("d-none")
        if (($('.property-wrapper')[0].scrollWidth - $('.property-wrapper')[0].clientWidth) != $('.property-wrapper').scrollLeft())
            $('.scroll-property-forward').removeClass("d-none")
        if ($('property-wrapper').scrollLeft()!=0)
            $('.scroll-property-backward').removeClass("d-none")
        if ($('.property-wrapper').scrollLeft()==0)
            $('.scroll-property-backward').addClass("d-none")
        //console.log ("In Scroll Event")

    });

    if (window_pathname.includes('/property-images') || window_pathname.includes('/list_place_preview'))
    {
        var array_of_image = []
    }

    $(document).on('click','.delete-image',function()
    {
    //console.log("Deletteeeeeeeeeeeeeee",$(this).parents('.slider'))
    var find_current_image = $(this).parents('.slider')
    var img_path = find_current_image.find('img').attr('src')
    var img_to_remove = img_path.replace('data:image/jpeg;base64,','')


    for (var i=array_of_image.length-1; i>=0; i--) {
        if (array_of_image[i] === img_to_remove) {
            array_of_image.splice(i, 1);
            // break;       //<-- Uncomment  if only the first term has to be removed
        }
    }

    if (array_of_image.length == 0)
    {
        $(".center-add-photos").removeClass("d-none")
        $(".add-furniture").removeClass("d-none")
        $(".mid-add-photos").addClass("d-none")
    }
    //console.log("Deletteeeeeeeeeeeeeee",array_of_image.length)
    //console.log("Deletteeeeeeeeeeeeeee",array_of_image.length)
    find_current_image.remove()

    })
    $(document).on('change','#upload,#upload1',function()
    {

        var files_rec = document.getElementById($(this).attr("id"));
        //console.log("-----------------",files_rec)

        if (files_rec.files.length != 0)
        {
            $(".center-add-photos").addClass("d-none")
            $(".add-furniture").addClass("d-none")
            $(".mid-add-photos").removeClass("d-none")
        }

        for (var rec = 0; rec < files_rec.files.length; rec++)
        {
            var reader = new FileReader();


//            console.log("-----------------",files_rec.files[rec])
            reader.onload = (function(theFile)
            {
                return function(e)
                {
                    var file_path = e.target.result
//                    console.log ("Result 1",file_path)
                    file_path = file_path.slice(file_path.indexOf(',')+1)
//                    console.log ("Result 2",file_path)
                    array_of_image.push(file_path)
//<span class="slider">
//<a href="#">
//<span class="delete-slider">
//<i class="fa fa-trash fa-2x">
//</i>
//</span>
//</a>
//<img class="slider-img card" src="data:image/jpeg;base64,'+file_path+'"/>



                    $(document).find('.scrolling-wrapper').append('<span class="slider"><a href="#"><span class="delete-slider"><i class="fa fa-trash fa-2x delete-image"></i></span></a><img class="slider-img card" src="data:image/jpeg;base64,'+file_path+'"/></span>')
//                    if (array_of_image.length == files_rec.files.length)

                    //console.log (array_of_image.length)
                    if ($('.scroll-forward').hasClass("d-none"))
                        $('.scroll-forward').removeClass("d-none")
                };
            })(files_rec.files[rec]);
//            reader.readAsBinaryString(files_rec.files[rec])

            reader.readAsDataURL(files_rec.files[rec])
        }

    });


$(document).on('change','#change_photos',function()
    {

        var files_rec = document.getElementById($(this).attr("id"));
        console.log("-----------------",files_rec.files.length)

//        if (files_rec.files.length != 0)
//        {
//            $(".center-add-photos").addClass("d-none")
//            $(".add-furniture").addClass("d-none")
//            $(".mid-add-photos").removeClass("d-none")
//        }


        for (var rec = 0; rec < files_rec.files.length; rec++)
        {
            var reader = new FileReader();
//            console.log("-----------------",files_rec.files[rec])
            reader.onload = (function(theFile)
            {
                return function(e)
                {
                    var file_path = e.target.result
//                    console.log ("Result 1",file_path)
                    file_path = file_path.slice(file_path.indexOf(',')+1)
//                    console.log ("Result 2",file_path)
                    array_of_image.push(file_path)
//                    console.log ("Result 2",array_of_image.length)

                    $(document).find('.add-photos-list_preview').append('<span class="slider"><a href="#"><span class="delete-slider"><i class="fa fa-trash fa-2x delete-list-image"></i></span></a><img class="slider-img card" src="data:image/jpeg;base64,'+file_path+'"/></span>')
//                    if (array_of_image.length == files_rec.files.length)
                    if (files_rec.files.length == array_of_image.length)
                    {
                            var property_id =17

                            $.ajax({
                            url:'/add/image/data',
                            type:'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": {'array_of_image': array_of_image, 'property_id' : property_id }}),
                            success: function(data)
                            {
                                console.log ("Controlllerrrrrrrrrrrrr")
                            }
                            })
                    }
                };
            })(files_rec.files[rec]);
//            reader.readAsBinaryString(files_rec.files[rec])

            reader.readAsDataURL(files_rec.files[rec])
            console.log("-----------Length array",array_of_image.length)
        }

    });

$(document).on('click','.delete-list-image',function()
    {
    //console.log("Deletteeeeeeeeeeeeeee",$(this).parents('.slider'))
    var find_current_image = $(this).parents('.slider')
    var img_path = find_current_image.find('img').attr('src')
    var img_to_remove = img_path.split(',')

    $(this).parent().parent().parent().remove()
    
//    console.log ("----ddddddddddddddddddd---",img_to_remove[1])
    var property_id =17
    var data = {'array_of_image': img_to_remove[1], 'property_id' : property_id }
    $.ajax({
    url:'/delete/image/data',
    type:'POST',
    dataType: 'json',
    async: true,
    contentType: 'application/json',
    data: JSON.stringify({'jsonrpc': "2.0", 'method': "call", "params": data}),
    success: function(data)
    {
        console.log ("Controlllerrrrrrrrrrrrr")
    }
    })

    });





    // Need to implement a RED "tell us a little more (10 character minimum)" for INTRODUCE YOURSELF
        var $input = $('#comment');

        if (window_pathname.includes('about-others'))
        {
        //console.log ("In general statement if (window_pathname.includes('about-others'))")
        if ($(this).find("#comment").val().length<10)
            $('.about-others-nxt-btn').prop("disabled", true)

        if ($input.val().length == 0 )
            {
                $('.styles__errorMessage1').hide();
            }
        }



        $input.on('keyup', function (){
            if ($input.val().length == 0 )
                {
                    $('.styles__errorMessage1').hide();
                    // Code added by dhrup
                    $('#comment').removeClass("border-red")
                }

            if ($input.val().length <= 9 )
                {
                    $('.styles__errorMessage1').show();
                    // Code added by dhrup
                    $('#comment').addClass("border-red")
                }
            else
               {
                    $('.styles__errorMessage1').hide();
                    // Code added by dhrup
                    $('#comment').removeClass("border-red")
               }


        });



    var $input1 = $(".property_something");
        if (window_pathname.includes('about-property'))
        {
                     if ($input1.val().length == 0 )
                    {
                        $('.styles__errorMessage2').hide();
                    }
            //console.log ("In general statement if (window_pathname.includes('about-property'))")
            if ($(this).find("#comment").val().length<10)
                $('.about-property-nxt-btn').prop("disabled", true)
        }
        $input1.on('keyup', function (){

            if ($input1.val().length == 0 )
                {
                    $('.styles__errorMessage2').hide();
                    // Code added by dhrup
                    $('.property_something').removeClass("border-red");
                }

            if ($input1.val().length <= 9 )
                {
                    $('.styles__errorMessage2').show();
                    // Code added by dhrup
                    $('.property_something').addClass("border-red");
                }
            else
                {
                    $('.styles__errorMessage2').hide();
                    // Code added by dhrup
                    $('.property_something').removeClass("border-red");
                }
        });

//  = --------------  End of Validations for /listplace/share-house/property-images  -------------- =
});// End of document
});// End of Odoo Deine
