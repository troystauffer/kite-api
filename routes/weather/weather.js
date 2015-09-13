var weatherService = {};

function Weather(ws) {
	weatherService = ws;
	return this;
}

Weather.prototype.getConditionsForZip = function(req, res) {
	req.checkParams('zip', 'A valid zip code is required.').notEmpty().isNumeric();
	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors });
	weatherService.getConditionsForZip(req.params.zip, function(err, conditions) {
		if (err) {
			res.status(400).json({ success: false, message: 'Error getting weather data.', errors: [err] });
		} else {
			res.json(conditions);
		}
	});
}

module.exports = Weather;