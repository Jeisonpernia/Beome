odoo.define('pragtech_flatmates.place_search', function (require) {
	
	var autocomplete;
	var componentForm = {
			  street_number: 'short_name',
			  route: 'long_name',
			  locality: 'long_name',
			  administrative_area_level_1: 'short_name',
			  country: 'long_name',
			  postal_code: 'short_name'
			};
	function initialize() {
		
		  var input = document.getElementById('search_places');
		  
		  autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
		  
		  // Set initial restrict to the greater list of countries.
          autocomplete.setComponentRestrictions({'country': 'au'});

          // When the user selects an address from the dropdown, populate the address fields in the form.
          google.maps.event.addListener(autocomplete, 'place_changed', function() {
        	  fillInAddress();
          });
	}
	
	function fillInAddress() {
	  // Get the place details from the autocomplete object.
	  var place = autocomplete.getPlace();
	  // Get each component of the address from the place details
	  // and fill the corresponding field on the search_places search box.
	  var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      document.getElementById('search_places').value = address;
	  
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});

