odoo.define('pragtech_flatmates.place_autocomplete', function (require) {

$(document).ready(function() {
//    console.log('Readyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
    google.maps.event.addDomListener(window, 'load', initAutocomplete);

    var placeSearch, autocomplete;

    var componentForm = {
      street_number: 'long_name',
      sublocality_level_2: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };


    function initAutocomplete() {
        //console.log('INIT AutoCompleteeeeeeeeeeeeeeeeeeeeee ')
      // Create the autocomplete object, restricting the search predictions to
      // geographical location types.
      autocomplete = new google.maps.places.Autocomplete(
          document.getElementById('autocomplete'), {types: ['geocode']});

      autocomplete.setComponentRestrictions(
            {'country': ['au']});
      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      autocomplete.setFields(['address_component','geometry']);

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autocomplete.addListener('place_changed', fillInAddress);

      ////////////////////// On Search Accommodation ///////////////////////////////////////////////////
      autocomplete2 = new google.maps.places.Autocomplete(
          document.getElementById('autocomplete2'), {types: ['geocode']});

      autocomplete2.setComponentRestrictions(
            {'country': ['au']});
      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      autocomplete2.setFields(['address_component','geometry']);

      autocomplete2.addListener('place_changed', fillInAddress);


    }

    function fillInAddress() {
        //console.log('fillllllllll in addresssssssssssssssssss',autocomplete)
      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();
      //console.log('place :',place)

        ////////////////////////////////////////////////////////////////
                   // Code Added for Longitude and latitude //
        document.getElementById('latitude').value = '';
        document.getElementById('latitude').disabled = false;

        document.getElementById('longitude').value = '';
        document.getElementById('longitude').disabled = false;


        var lati_tude = place.geometry.location.lat()
        var longi_tude = place.geometry.location.lng()
        var north = place.geometry.viewport.getNorthEast().lat()
        var east = place.geometry.viewport.getNorthEast().lng()
        var south = place.geometry.viewport.getSouthWest().lat()
        var west = place.geometry.viewport.getSouthWest().lng()

        document.getElementById('latitude').value = lati_tude;
        document.getElementById('longitude').value = longi_tude;
        document.getElementById('north').value = north;
        document.getElementById('east').value = east;
        document.getElementById('south').value = south;
        document.getElementById('west').value = west;

        console.log('place.geometry------ :',place.geometry.viewport.getSouthWest().lat(),place.geometry.viewport.getSouthWest().lng(),place.geometry.viewport.getNorthEast().lat(),place.geometry.viewport.getNorthEast().lng())
        console.log('Long :',longi_tude,lati_tude)
       ///////////////////////////////////////////////////////////////////

      for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
      }

//      console.log('Address Components ::: ',place.address_components)

      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          document.getElementById(addressType).value = val;
        }
      }
      //console.log('???????????????????????????????????????',$('#street_number').val())
      if ($('#street_number').val() == ""){
            //console.log('*******************************************')
//            $('#propert_submit_btn').prop("disabled", true);
            $(".styles__errorMessage").show()
            // Code added by dhrup
            $('#autocomplete').addClass("border-red");
      }
      else{
            $(".styles__errorMessage").hide()
            // Code added by dhrup
            $('#autocomplete').removeClass("border-red");
//            $('#propert_submit_btn').prop("disabled", false);
      }


    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
      //console.log('geoooooooolocaaaaaaateeeeeeeeee')
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle(
              {center: geolocation, radius: position.coords.accuracy});

          autocomplete.setBounds(circle.getBounds());
        });
      }
    }



    });



});

