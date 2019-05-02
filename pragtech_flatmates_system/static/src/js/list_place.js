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

        console.log('hereeeeeeeeeeeeeeeeeeeeeeeeee',array_of_image);
        console.log('LOCAL STORAGE 33 : ',localStorage.getItem('list_place_array'))
        alert("dgdgh")
    });

    if (window_pathname.includes('/property-images'))
    {
        var array_of_image = []
    }

    $("#upload").change(function()
    {

        var files_rec = document.getElementById('upload');
//        console.log("-----------------",files_rec.files)


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
                    $(document).find('#images').append('<img src="data:image/jpeg;base64,'+file_path+'"  width="100" height="100"/>')
//                    if (array_of_image.length == files_rec.files.length)

                    console.log (array_of_image.length)

                };
            })(files_rec.files[rec]);
//            reader.readAsBinaryString(files_rec.files[rec])

            reader.readAsDataURL(files_rec.files[rec])
        }

    });

//  = --------------  End of Validations for /listplace/share-house/property-images  -------------- =
});// End of document
});// End of Odoo Deine