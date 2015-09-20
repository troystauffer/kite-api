var http = require('http');
var config = {};
var apiKey = '';

function WundergroundService(_config) {
	config = _config;
	apiKey = config.apiKey;
	return this;
}

WundergroundService.prototype.getConditionsForZip = function(zip, cb) {
	this.callWundergroundAPI('/conditions/q/' + zip + '.json', function(err, conditions) {
		if (err) return cb(err, null)
		var res = {
			weather: conditions.current_observation.weather,
			temperature_string: conditions.current_observation.temperature_string,
			temp_f: conditions.current_observation.temp_f,
			temp_c: conditions.current_observation.temp_c,
			relative_humidity: conditions.current_observation.relative_humidity,
			wind_string: conditions.current_observation.wind_string,
			wind_dir: conditions.current_observation.wind_dir,
			wind_degrees: conditions.current_observation.wind_degrees,
			wind_mph: conditions.current_observation.wind_mph,
			wind_gust_mph: conditions.current_observation.wind_gust_mph,
			wind_kph: conditions.current_observation.wind_kph,
			wind_gust_kph: conditions.current_observation.wind_gust_kph,
			feelslike_string: conditions.current_observation.feelslike_string,
			feelslike_f: conditions.current_observation.feelslike_f,
			feelslike_c: conditions.current_observation.feelslike_c,
			visibility_mi: conditions.current_observation.visibility_mi,
			visibility_km: conditions.current_observation.visibility_km,
			precip_1hr_in: conditions.current_observation.precip_1hr_in,
			precip_today_in: conditions.current_observation.precip_today_in
		};
		cb (null, res)
	});
}

WundergroundService.prototype.callWundergroundAPI = function(path, cb) {
	var options = {
		host: config.apiDomain,
		path: config.apiBaseUrl + apiKey + path
	};
	var ret = {};
	var request = http.request(options, function(response) {
		var str = '';
		
		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('end', function() {
			cb(null, JSON.parse(str));
		});
	});
	request.on('error', function(e) {
		console.log(e);
		console.log(options);
		cb(e, null);
	});
	request.end();
}

module.exports = WundergroundService;