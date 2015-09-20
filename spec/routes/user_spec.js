var path = require('path');
describe('User', function() {

	var res = {};
	var Res = require('../util/res');
	var user = {};
	var User = require(path.join(__dirname, '../../routes/user/user'));
	var passport = require('passport');
	var Stormpath = require(path.join(__dirname, '../util/stormpath'));
	var stormpath = new Stormpath();
	var StormpathFailure = require(path.join(__dirname, '../util/stormpathfailure'));
	var stormpathFailure = new StormpathFailure();
	var req = {};
	var Req = require(path.join(__dirname, '../util/req'));
	var db = require(path.join(__dirname, '../util/db'));

	beforeAll(function() {
		passport.initialize();
		passport.session();
	});

	beforeEach(function() {
		res = new Res();
		user = new User(stormpath, passport, db);
		req = new Req();
	});

	describe('authentication route', function() {
		it('should return an error with an unsuccessful authentication', function() {
			user = new User(stormpathFailure, passport);
			req.body = {
				email: 'asdf',
				password: 'asdf'
			};
			var result = { info: 'Login failed.' };
			res.on('json', validateToken);
			res.on('status', validateStatus);
			function validateToken(res) {
				expect(res.response).toEqual(result);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(401);
			}
			user.auth(req, res, function(){});
			res.removeListener('json', validateToken);
			res.removeListener('status', validateStatus);
		});

		it('should return a valid token with a successful authentication', function() {
			req.body = {
				email: 'asdf',
				password: 'asdf'
			};
			var result = { token: 'asdf1234' };
			res.on('json', validateToken);
			res.on('status', validateStatus);
			function validateToken(res) {
				expect(res.response).toEqual(result);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(200);
			}
			user.auth(req, res, function(){});
			res.removeListener('json', validateToken);
			res.removeListener('status', validateStatus);
		});
	});

	describe('account creation route', function() {

		it('should return an error when passed invalid data', function() {
			var error = {"param": "email", "msg": "A valid email is required.", "value": "asdf"};
			req.body = {
				email: 'asdf'
			};
			req.validationErrors = function() { return [error] };

			var result = { info: 'The data provided to the API was invalid or incomplete.', errors: [error] };
			res.on('json', validateError);
			res.on('status', validateStatus);
			function validateError(res) {
				expect(res.response).toEqual(result);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(400);
			}
			user.createAccount(req, res);
			res.removeListener('json', validateError);
			res.removeListener('status', validateStatus);
		});

		it('should return an error when stormpath rejects the password', function() {
			user = new User(stormpathFailure, passport, db);
			req.body = {
				email: 'test@example.com',
				password: 'weak',
				firstname: 'Test',
				lastname: 'Unit'
			};

			var result = { info: 'Password invalid.', message: 'Password must contain at least 1 numeric character.' };
			res.on('json', validateResult);
			res.on('status', validateStatus);
			function validateResult(res) {
				expect(res.response).toEqual(result);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(400);
			}
			user.createAccount(req, res);
			res.removeListener('json', validateResult);
			res.removeListener('status', validateStatus);
		});

		it('should return a success message upon account creation', function() {
			req.body = {
				email: 'test@example.com',
				password: 'Password1',
				firstname: 'Test',
				lastname: 'Unit'
			};

			var result = { info: 'Account created successfully.' };
			res.on('json', validateResult);
			res.on('status', validateStatus);
			function validateResult(res) {
				expect(res.response).toEqual(result);
			}
			function validateStatus(res) {
				expect(res.code).toEqual(201);
			}
			user.createAccount(req, res);
			res.removeListener('json', validateResult);
			res.removeListener('status', validateStatus);
		});
	});

});