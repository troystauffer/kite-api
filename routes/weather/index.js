var path = require('path');


module.exports = function(router, weatherService) {

	var Weather = require(path.join(__dirname, 'weather'));
	var weather = new Weather(weatherService);

	router.get('/weather/:zip', weather.getConditionsForZip);
};