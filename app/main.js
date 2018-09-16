var map = null;

var circles = [];

function initMap() {
	// Create the map.
	  map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 3,
	  center: {lat: 0, lng: 0},
	  mapTypeId: 'roadmap'
	});
}

function getColor(price, max_price){
	var value = price - 100.0;
	var max_value = max_price - 100.0;
	if (value < 0)
		value = 0.0;
	if (max_value < 0)
		max_value = 0.0;
	var percentage = value / max_value;

	var r = Math.round(percentage * 255.0);
	var g = Math.round(255.0 - percentage * 255.0);
 
	var hexR = r.toString(16);
	if (r < 16) {
       hexR = "0" + hexR;
	}
	
	var hexG = g.toString(16);
	if (g < 16) {
       hexG = "0" + hexG;
	}
	
	return '#'+hexR+hexG+'00';
}

$(document).ready(function() {
	var APIkey = "knok2EsBatxfKdIeAXbAjhqQDGEFMAul";
	
	$('#go-button').click(function() {
		for (var i = 0; i < circles.length; i++)
			circles[i].setMap(null);
		circles = [];
		
		var origin = "NYC";
		var max_price = 500;
	
		$.ajax({
			type: 'GET',
			url: "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=" + origin + "&apikey=" + APIkey + "&max_price=" + max_price
		}).done(function(response) {
			for (var i=0; i<response.results.length; i++){
				// Add the circle for this city to the map.
				let price = response.results[i].price;
				let color = getColor(price, max_price);
				
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
						strokeColor: color,
						strokeOpacity: 1,
						strokeWeight: 2,
						fillColor: color,
						fillOpacity: 0.6,
						map: map,
						center: city.center,
						radius: Math.sqrt(city.movement) * 100
					});
					circles.push(cityCircle);
				});
			}
		});
	});
});