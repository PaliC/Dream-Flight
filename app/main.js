var map = null;

var cityCodes = {};

var circles = [];

function getCodes(){
	$.ajax({
		url:'./city_data.txt',
		async: false,
		success: function (data){
			var json = data.parse();
			for (var i=0; i < json.codes.length; i++){
				var obj = json.codes[i];
				var key = Object.keys(obj);
				cityCodes[key] = obj[key];
				alert(key);
				alert(cityCodes[key].name);
			}
		}
    });
}

function initMap() {
	// Create the map.
	map = new google.maps.Map(document.getElementById('map'), {
	zoom: 3,
	center: {lat: 0, lng: 0},
	mapTypeId: 'roadmap'
	});
	getCodes();
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
	
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;

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
				
				var cityCode = response.results[i].destination;
				if(cityCode in cityCodes){
					var city = cityCodes[cityCode];
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
				}
				else{
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
			}
		});
	});
});