odoo.define('pragtech_flatmates.dynamic_url', function (require) {

$(document).ready(function() {

    //Create Dynamic url

    $(".accommodation-next-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/property-type"
             $('#list_place_accommodation_form_id').attr('action', action);
            }
            else if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/about"
             $('#list_place_accommodation_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/about"
             $('#list_place_accommodation_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/about"
             $('#list_place_accommodation_form_id').attr('action', action);
            }
        });


        $(".about-next-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/who-lives-here"
             $('#list_place_about_property_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/who-lives-here"
             $('#list_place_about_property_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/who-lives-here"
             $('#list_place_about_property_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/who-lives-here"
             $('#list_place_about_property_form_id').attr('action', action);
            }
        });


        $(".currnt_live_in_proprty_bttn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/about-rooms"
             $('#about_who_lives_here_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/about-rooms"
             $('#about_who_lives_here_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/about-rooms"
             $('#about_who_lives_here_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/about-rooms"
             $('#about_who_lives_here_form_id').attr('action', action);
            }
        });



        $(".about-rooms-next-bttn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/rent-bond-bills"
             $('#about_rooms_template_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/rent-bond-bills"
             $('#about_rooms_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/rent-bond-bills"
             $('#about_rooms_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/rent-bond-bills"
             $('#about_rooms_template_form_id').attr('action', action);
            }
        });



        $(".rent-bond-bill-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/room-availability"
             $('#rent_bond_bills_template_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/room-availability"
             $('#rent_bond_bills_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/room-availability"
             $('#rent_bond_bills_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/room-availability"
             $('#rent_bond_bills_template_form_id').attr('action', action);
            }
        });



        $(".room-avail-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/property-images"
             $('#room_availability_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/property-images"
             $('#room_availability_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/property-images"
             $('#room_availability_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/property-images"
             $('#room_availability_form_id').attr('action', action);
            }
        });



        $(".property-images-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/describe-your-flatmate"
             $('#property_images_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/describe-your-flatmate"
             $('#property_images_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/describe-your-flatmate"
             $('#property_images_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/describe-your-flatmate"
             $('#property_images_form_id').attr('action', action);
            }
        });



        $(".describe-your-flatmate-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/flatmate-preference"
             $('#list_place_describe_your_flatmate_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/flatmate-preference"
             $('#list_place_describe_your_flatmate_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/flatmate-preference"
             $('#list_place_describe_your_flatmate_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/flatmate-preference"
             $('#list_place_describe_your_flatmate_form_id').attr('action', action);
            }
        });





        $(".flatmate-pref-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            //console.log('NNNNNNNNNNNNNNNNNNNNNNNNNN4444',accommodation_type)
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/accepting"
             $('#flatmate_preference_template_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/accepting"
             $('#flatmate_preference_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/accepting"
             $('#flatmate_preference_template_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/accepting"
             $('#flatmate_preference_template_form_id').attr('action', action);
            }
        });





        $(".accepting-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            //console.log('NNNNNNNNNNNNNNNNNNNNNNNNNN4444',accommodation_type)
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/introduce-yourself"
             $('#list_place_accepting_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/introduce-yourself"
             $('#list_place_accepting_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/introduce-yourself"
             $('#list_place_accepting_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/introduce-yourself"
             $('#list_place_accepting_form_id').attr('action', action);
            }
        });






        $(".describe-yourself-and-property-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            //console.log('NNNNNNNNNNNNNNNNNNNNNNNNNN6666',accommodation_type)
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/about-others"
             $('#list_place_describe_yourself_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/about-others"
             $('#list_place_describe_yourself_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/about-others"
             $('#list_place_describe_yourself_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/about-others"
             $('#list_place_describe_yourself_form_id').attr('action', action);
            }
        });





        $(".about-others-nxt-btn").on("click", function()
        {
            var accommodation_type = $('#type_of_accomodation').val()
            var action = ""

            if(accommodation_type == "sharehouse"){
                action = "/listplace/share-house/about-property"
             $('#list_place_about_others_form_id').attr('action', action);
            }
            else if (accommodation_type == "whole-property"){
               action = "/listplace/whole-property/about-property"
             $('#list_place_about_others_form_id').attr('action', action);
            }
            else if(accommodation_type == "student-accomodation"){
                action = "/listplace/student-accomodation/about-property"
             $('#list_place_about_others_form_id').attr('action', action);
            }
            else if(accommodation_type == "homestay"){
                action = "/listplace/homestay/about-property"
             $('#list_place_about_others_form_id').attr('action', action);
            }
        });

    });

 });