'use strict';
const path = require('path');

module.exports = function(router, weatherService) {
	const weather = new (require(path.join(__dirname, 'weather')))(weatherService);

	router.get('/weather/:zip', weather.getConditionsForZip);
};