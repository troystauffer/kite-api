var weatherService = {};

function Weather(_weatherService) {
	weatherService = _weatherService;
	return this;
}

Weather.prototype.getConditionsForZip = function(req, res) {
	req.checkParams('zip', 'A valid zip code is required.').notEmpty().isNumeric().isLength(5, 5);
	var errors = req.validationErrors();
	if (errors) return res.status(400).json({ info: 'The data provided to the API was invalid or incomplete.', errors: errors });
	weatherService.getConditionsForZip(req.params.zip, function(err, conditions) {
		if (err) {
			res.status(400).json({ info: 'Error getting weather data.', errors: [err] });
		} else {
			res.json(conditions);
		}
	});
}

module.exports = Weather;