'use strict';
const path = require('path');

module.exports = function(router, application, passport, db, secret, log) {
	const user = new (require(path.join(__dirname, 'user')))(application, passport, db, secret, log);

	router.post('/login', user.auth);
	router.post('/account', user.createAccount);
};