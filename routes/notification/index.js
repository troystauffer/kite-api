'use strict';
const path = require('path');

module.exports = function(router, db) {
	const notification = new (require(path.join(__dirname, 'notification')))(db);

	router.post('/notification', notification.addNotification);
};