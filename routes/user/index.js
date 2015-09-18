var path = require('path');


module.exports = function(router, application, passport) {

	var User = require(path.join(__dirname, 'user'));
	var user = new User(application, passport);

	router.post('/login', user.auth);
};