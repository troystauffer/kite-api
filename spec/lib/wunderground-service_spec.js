var path = require('path');
describe('Wunderground Service', function() {
	var Config = require(path.join(__dirname, '../../config/'));
	var config = new Config();
	var WundergroundService = require(path.join(__dirname, '../../lib/wunderground-service'));
	var ws = new WundergroundService(config.wunderground);

	describe('function calls', function() {
		beforeEach(function() {
			spyOn(ws, 'callWundergroundAPI');
		});

		it('should call the api with the right params', function() {
			ws.getConditionsForZip(12345, function(err, conditions) {
				if (err) {
					fail('An error occurred calling getConditionsForZip');
				} else {
					expect(ws.callWundergroundAPI).toHaveBeenCalledWith('/conditions/q/12345.json');
				}
			});
		});
	})


	describe('exception handling', function() {
		var error = { 
			code: 'ENOENT',
			errno: 'ENOENT',
			syscall: 'getaddrinfo',
			hostname: 'api.wunderground.com'
		};
		beforeEach(function() {
			spyOn(ws, 'callWundergroundAPI').and.callFake(function(path, cb) {
				cb(error, null);
			});
		});
		it('should pass wunderground exceptions through', function() {
			ws.getConditionsForZip(12345, function(err, conditions) {
				expect(err).toEqual(error);
			})
		});
	});
});