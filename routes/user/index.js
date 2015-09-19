var path = require('path');


module.exports = function(router, application, passport, db) {

	var User = require(path.join(__dirname, 'user'));
	var user = new User(application, passport, db);

	router.post('/login', user.auth);
	router.post('/account', user.createAccount);
};