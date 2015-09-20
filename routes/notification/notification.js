var db = {};

function Notification(_db) {
	db = _db;
	return this;
}

Notification.prototype.addNotification = function(req, res) {
	if (!req.user.hasOwnProperty('sub')) return res.status(401).json({info:'Token invalid.'});
	req.checkBody('zip', 'A valid zip code is required.').notEmpty().isNumeric().isLength(5, 5);
	req.checkBody('optimum', 'A valid boolean value required for optimum.').isBoolean();
	var errors = req.validationErrors();
	if (errors) return res.status(400).json({ info: 'The data provided to the API was invalid or incomplete.', errors: errors });
	db.User.findOne({ where: {stormpathHref:req.user.sub}}).then(function(user) {
		if(!user) return res.status(500).json({info:'Unable to load user details.'});
		db.Notification.find({ where: { userId: user.id, zip: req.body.zip }}).then(function(notification) {
			if (notification) {
				notification.optimum = req.body.optimum;
				notification.save().then(function(n) {
					res.status(200).json(n);
				});
			} else {
				db.Notification.create({
					userId: user.id,
					zip: req.body.zip,
					optimum: req.body.optimum
				}).then(function(n) {
					res.status(201).json(n);
				});
			}
		});
	});
}

module.exports = Notification;