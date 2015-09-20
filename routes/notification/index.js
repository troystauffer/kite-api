var path = require('path');


module.exports = function(router, db) {

	var Notification = require(path.join(__dirname, 'notification'));
	var notification = new Notification(db);

	router.post('/notification', notification.addNotification);
};