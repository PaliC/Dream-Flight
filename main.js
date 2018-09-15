$(document).ready(function() {
  $('#weatherLocation').click(function() {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=7a56d05c52d62e22e7ecfda51f894493`,
      type: 'GET',
      data: {
        format: 'json'
      },
      success: function(response) {
        $('#showHumidity').text(`The humidity in Chicago is ${response.main.humidity}%`);
        $('#showTemp').text(`The temperature in Kelvins is ${response.main.temp}.`);
      },
      error: function() {
        $('#errors').text("There was an error processing your request. Please try again.");
      }
    });
  });
});