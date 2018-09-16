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
	var APIkey = "QlTUwsUi5u9Hs1jFEACAilJlbJRuKvRp";
	
	var colors = ["00ff00", "33ff00", "66ff00", "99ff00", "ccff00", "ffff00", "ffcc00"];
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	var city;

	function dateDiffInDays(a, b) {
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}
	
	function give_me_some_inspiration(ori, departure_date, return_date, max_price){
		var APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G";
		var duration = dateDiffInDays(new Date(departure_date),new Date(return_date));
		$.ajax({
			type: 'GET',
			url: "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=" + APIkey + "&origin=" + ori + "&departure_date=" + departure_date + "&max_price" + max_price + "&duration" + duration.toString()
		}).done(function(response) {	
			destination = {
				name: response.results.destination,
				departure_date: response.results.departure_date,
				return_date: response.results.return_date,
				price: response.results.price,
				airline: response.results.airline,
			}
		});
	}

	function find_poi(lat, long, rad){
		var APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G";
		$.ajax({
			type: 'GET',
			url: "https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle?apikey=" + APIkey + "&latitude=" + lat + "&longitude=" + long + "&radius=" + rad
		}).done(function(response) {	
			points_of_interest = {
				name: response.points_of_interest.title,
				categories: response.points_of_interest.categories,
				grades: response.points_of_interest.grades,
				main_image: response.points_of_interest.main_image,
				details: response.points_of_interest.details,
				location: response.points_of_interest.location,
				walk_time: response.points_of_interest.walk_time
			}
		});
	}

	function getDestination(code){
		$.ajax({
			type: 'GET',
			url: "https://api.sandbox.amadeus.com/v1.2/location/" + code + "?apikey=" + APIkey
		}).done(function(response) {
			var total =  0;
			for (var i=0; i<response.airports.length; i++){
				total = total + response.airports[i].aircraft_movements;
			}	
			
			city = {
				name: response.city.name,
				state: response.city.state,
				country: response.city.country,
				center: {lat:  response.city.location.latitude, lng: response.city.location.longitude},
				movement: total
			}
		});
	}
	
	
	$('#submit').click(function() {
	
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