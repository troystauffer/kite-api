var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var Config = require(path.join(__dirname, 'config/'));
var config = new Config();
var validator = require('express-validator');
var services = {};
var WundergroundService = require(path.join(__dirname, 'lib/wunderground-service'));
services.wunderground = new WundergroundService(config.wunderground);
var router = express.Router();
var stormpath = require('stormpath');
var apiKey = new stormpath.ApiKey( config.stormpath.id, config.stormpath.secret );
var client = new stormpath.Client({apiKey: apiKey});
var application = null;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(validator());
app.use('/v1', router);

// routes
require(path.join(__dirname, 'routes/weather'))(router, services[config.weatherService]);

client.getApplication(config.stormpath.appUri, function(err, spApp) {
	if (err) throw err;
	application = spApp;
	app.listen(config.port);
	console.log('Web app started on port ' + config.port + '...');
});
