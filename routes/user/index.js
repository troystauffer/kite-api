var path = require('path');


module.exports = function(router, application, passport, db, secret) {

	var User = require(path.join(__dirname, 'user'));
	var user = new User(application, passport, db, secret);

	router.post('/login', user.auth);
	router.post('/account', user.createAccount);
};