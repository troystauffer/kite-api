var path = require('path');
describe('Notification', function() {
	var Req = require(path.join(__dirname, '../util/req'));
	var req = {};
	var notification = {};
	var res = {};
	var Res = require(path.join(__dirname, '../util/res'));
	var db = require(path.join(__dirname, '../util/db'));

	beforeAll(function() {
		var Notification = require(path.join(__dirname, '../../routes/notification/notification'));
		notification = new Notification(db);
	});

	beforeEach(function() {
		res = new Res();
		req = new Req();
	})

	describe('add route', function() {
		it('should error when invalid data is provided', function() {
			var error = {"param": "zip", "msg": "A valid zip code is required.", "value": "1234"};
			var response = {
				"info": "The data provided to the API was invalid or incomplete.",
				"errors": [error]
			};
			req.body = {
				zip: '1234',
				optimum: true
			};
			req.validationErrors = function() { return [error] };
			res.on('json', validateInvalidZipCode);
			res.on('status', validateStatus);
			function validateInvalidZipCode(res) {
				expect(res.response).toEqual(response);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(400);
			}
			notification.addNotification(req, res);
			res.removeListener('json', validateInvalidZipCode);
			res.removeListener('status', validateStatus);
		});

		it('should return a notification object when created successfully', function() {
			var response = {
				id: 1,
				userId: 1,
				zip: 12345,
				optimum: true
			};
			req.body = {
				zip: 12345,
				optimum: true
			};
			res.on('json', validateResponse);
			res.on('status', validateStatus);
			function validateResponse(res) {
				expect(res.response).toEqual(response);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(200);
			}
			notification.addNotification(req, res);
			res.removeListener('json', validateResponse);
			res.removeListener('status', validateStatus);
		})
	});
});