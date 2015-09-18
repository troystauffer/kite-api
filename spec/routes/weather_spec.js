var path = require('path');
describe('Weather routes', function() {

	var weather = {};
	var res = {};
	var conditions = {
		"current_observation": {
			"weather": "Clear",
			"temp_f": 56.6,
			"temp_c": 13.7,
			"relative_humidity": "62%",
		}
	};

	beforeAll(function() {
		var ws = {
			getConditionsForZip: function(zip, cb) {
				cb(null, conditions)
			}
		}
		var Weather = require(path.join(__dirname, '../../routes/weather/weather'));
		weather = new Weather(ws);
	});

	beforeEach(function() {
		res = require('../util/res');
	})

	it('should return conditions for a valid zip code', function() {
		var req = { 
			params: { zip: 12345 },
			checkParams: function() { return this; },
			notEmpty: function() { return this; },
			isNumeric: function() { return this; },
			isLength: function() { return this; },
			validationErrors: function() { return null; }
		};
		res.on('json', validateValidZipCode);
		function validateValidZipCode(res) {
			expect(res.response).toEqual(conditions);
		}
		weather.getConditionsForZip(req, res);
		res.removeListener('json', validateValidZipCode);
	});

	it('should error when an invalid zip code is provided', function() {
		var error = {"param": "zip", "msg": "A valid zip code is required.", "value": "1234"};
		var response = {
			"success": false,
			"message": "The data provided to the API was invalid or incomplete.",
			"errors": [error]
		};
		var req = { 
			params: { zip: 1234 },
			checkParams: function() { return this; },
			notEmpty: function() { return this; },
			isNumeric: function() { return this; },
			isLength: function() { return this; },
			validationErrors: function() { return [error] }
		};
		res.on('json', validateInvalidZipCode);
		function validateInvalidZipCode(res) {
			expect(res.response).toEqual(response);
		}
		weather.getConditionsForZip(req, res);
		res.removeListener('json', validateInvalidZipCode);
	});
});