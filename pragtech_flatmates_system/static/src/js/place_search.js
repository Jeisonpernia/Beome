odoo.define('pragtech_flatmates.place_search', function (require) {
	$(document).ready(function() {
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
			  
			  document.getElementById('search_places').value = '';
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
		  
		}
		
		//popular-location click event
		$(".popular-location").click(function(event){
			//Remove old element
			$('.token').remove();
			//Prepend new element
			var span = $('<span />').addClass('token').html(event.target.innerHTML);
			$("#search_places").before(span);
		});
		
		
		google.maps.event.addDomListener(window, 'load', initialize);
	});
});

