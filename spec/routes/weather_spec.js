var path = require('path');
describe('Weather routes', function() {
	var Req = require(path.join(__dirname, '../util/req'));
	var req = {};
	var weather = {};
	var res = {};
	var Res = require(path.join(__dirname, '../util/res'));
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
		res = new Res();
		req = new Req();
	})

	it('should return conditions for a valid zip code', function() {
		req.params = { zip: 12345 };
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
			"info": "The data provided to the API was invalid or incomplete.",
			"errors": [error]
		};
		req.params = { zip: 1234 };
		req.validationErrors = function() { return [error] };
		res.on('json', validateInvalidZipCode);
		function validateInvalidZipCode(res) {
			expect(res.response).toEqual(response);
		}
		weather.getConditionsForZip(req, res);
		res.removeListener('json', validateInvalidZipCode);
	});
});