var LocalStrategy = require('passport-local').Strategy;
var application = {};
var passport = {}

function User(spApp, pp) {
	application = spApp;
	passport = pp;
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(username, password, done) {
			var authReq = {
				username: username,
				password: password
			};
			application.authenticateAccount(authReq, function onAuthcResult(err, result) {
				if (err) return done(null, false, { message: 'Login failed.'});
				return done(null, { token:result.getAccessToken() });
			})
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(username, done) {
		done(null, user);
	});

	return this;
}

User.prototype.auth = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (!user) return res.status(500).json({info: info.message});
		req.logIn(user, function(err) {
			if (err) return next(err);
			res.json({ token: user.token });
		});
	})(req, res, next);
	// res.json({success:true, message:'hooray'});
}

module.exports = User;