const request = require('request');
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// test it
// function give_me_some_inspiration(ori, departure_date, return_date, max_price){
// 	var APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G";
// 	var duration = dateDiffInDays(new Date(departure_date),new Date(return_date));
// 	$.ajax({
// 		type: 'GET',
// 		inspiration_url : "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?origin=" + str(ori) + "&apikey=" + APIkey + "&max_price=" + str(max_price) + "&departure_date=" + departure_date + + "&duration=" + duration 
// 	}).done(function(response) {
		
// 	});
// }


function give_me_some_inspiration(ori, departure_date, return_date, max_price){
	var APIkey = "deruRte5Y9yrs4eK59paEuSZ9mGbGX0G";
    var duration = dateDiffInDays(new Date(departure_date),new Date(return_date));
    // var duration = 5;
    console.log(duration)
    var inspiration_url = "https://api.sandbox.amadeus.com//v1.2/flights/inspiration-search?apikey=" + APIkey + "&origin=" + ori + "&departure_date=" + departure_date + "&max_price" + max_price + "&duration" + duration.toString();
    request(inspiration_url, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      return body;
    //   console.log(body.explanation);
    });
}





console.log(give_me_some_inspiration("NYC","2018-12-25","2018-12-30",10000))