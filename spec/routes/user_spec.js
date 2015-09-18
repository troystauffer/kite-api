var path = require('path');
describe('User routes', function() {

	var res = {};
	var Res = require('../util/res');
	var user = {};
	var User = require(path.join(__dirname, '../../routes/user/user'));
	var passport = require('passport');
	var Stormpath = require('../util/stormpath');
	var stormpath = new Stormpath();
	var StormpathFailure = require('../util/stormpathfailure');
	var stormpathFailure = new StormpathFailure();
	var req = {
		logIn: function(user, cb) { cb(null); }	
	};

	beforeAll(function() {
		passport.initialize();
		passport.session();
	});

	beforeEach(function() {
		res = new Res();
		user = new User(stormpath, passport);
	});

	it('should return an error with an unsuccessful authentication', function() {
		user = new User(stormpathFailure, passport);
		req.body = {
			email: 'asdf',
			password: 'asdf'
		};
		var result = { info: 'Login failed.' };
		res.on('json', validateToken);
		function validateToken(res) {
			expect(res.response).toEqual(result);
		}
		user.auth(req, res, function(){});
		res.removeListener('json', validateToken);
	});

	it('should return a valid token with a successful authentication', function() {
		req.body = {
			email: 'asdf',
			password: 'asdf'
		};
		var result = { token: 'asdf1234' };
		res.on('json', validateToken);
		function validateToken(res) {
			expect(res.response).toEqual(result);
		}
		user.auth(req, res, function(){});
		res.removeListener('json', validateToken);
	});
});