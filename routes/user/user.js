var LocalStrategy = require('passport-local').Strategy;
var application = {};
var passport = {};
var db = {};
var secret = '';
var njwt = require('njwt');

function User(_application, _passport, _db, _secret) {
	application = _application;
	passport = _passport;
	db = _db;
	secret = _secret;
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
				var jwt = result.getJwt();
				jwt = njwt.create(result.getJwt().body, secret);
				jwt.setExpiration(new Date().getTime() + (1000*60*60*2)); // 2 hours
				return done(null, { token:jwt.compact() });
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
		if (!user) return res.status(401).json({info: info.message});
		req.logIn(user, function(err) {
			if (err) return next(err);
			res.json({ token: user.token });
		});
	})(req, res, next);
}

User.prototype.createAccount = function(req, res) {
	req.checkBody('email', 'A valid email is required.').notEmpty().isEmail();
	req.checkBody('password', 'A valid password is required.').notEmpty();
	req.checkBody('firstname', 'A valid first name is required.').notEmpty();
	req.checkBody('lastname', 'A valid last name is required.').notEmpty();
	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({ info: 'The data provided to the API was invalid or incomplete.', errors: errors });
	var account = {
		givenName: req.body.firstname,
		surname: req.body.lastname,
		username: req.body.email,
		email: req.body.email,
		password: req.body.password
	};

	application.createAccount(account, function(err, createdAccount) {
		if (err) {
			if (err.status == 400 && err.code == 400) {
				return res.status(400).json({ info: 'Password invalid.', message: err.userMessage });
			}
			return res.status(400).json({ info: 'Error creating account.', message: 'An error occurred creating your account.' });
		}
		db.User.create({
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			stormpathHref: createdAccount.href
		}).then(function() {
			return res.status(201).json({ info: 'Account created successfully.' });
		});
	});
}


module.exports = User;