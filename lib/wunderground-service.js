var http = require('http');
var fs = require('fs');
var path = require('path');
var config = {};
var apiKey = '';

function WundergroundService(weatherConfig) {
	config = weatherConfig;
	var filepath = path.join(__dirname, '../config/', config.keyfile);
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err, data) {
		if (err) {
			console.log(err)
		} else {
			apiKey = data;
		}
		return this;
	});
}

WundergroundService.prototype.getConditionsForZip = function(zip, cb) {
	var options = {
		host: config.apiDomain,
		path: config.apiBaseUrl + apiKey + '/conditions/q/' + zip + '.json'
	};
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