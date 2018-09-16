var map = null;

function initMap() {
	// Create the map.
	  map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 3,
	  center: {lat: 0, lng: 0},
	  mapTypeId: 'terrain'
	});
}

$(document).ready(function() {
	var APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G";
	
	var colors = ["00ff00", "33ff00", "66ff00", "99ff00", "ccff00", "ffff00", "ffcc00"];
	
	$('#go-button').click(function() {
		let origin = "BOS";
		let price = 1000;
	
		$.ajax({
			type: 'GET',
			url: "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=" + origin + "&apikey=" + APIkey + "&max_price=" + price
		}).done(function(response) {
			for (var i=0; i<response.results.length; i++){
				// Add the circle for this city to the map.
				var cost = response.results[i].price;
				
				$.ajax({
					type: 'GET',
					url: "https://api.sandbox.amadeus.com/v1.2/location/" + response.results[i].destination + "?apikey=" + APIkey
				}).done(function(sec_response) {
					var total =  0;
					for (var i=0; i<sec_response.airports.length; i++){
						total = total + sec_response.airports[i].aircraft_movements;
					}				
					var city = {
						name: sec_response.city.name,
						state: sec_response.city.state,
						country: sec_response.city.country,
						center: {lat:  sec_response.city.location.latitude, lng: sec_response.city.location.longitude},
						movement: total
					}
				
					var cityCircle = new google.maps.Circle({
						strokeColor: '#008000',
						strokeOpacity: 1,
						strokeWeight: 2,
						fillColor: '#008000',
						fillOpacity: 0.6,
						map: map,
						center: city.center,
						radius: Math.sqrt(city.movement) * 100
					});
				});
			}
		});
	});
});