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
var passport = require('passport');
var jwt = require('express-jwt');
var unsecuredRoutes = require(path.join(__dirname, 'config/unsecuredRoutes'));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(validator());

router.use(jwt({secret:config.stormpath.secret}).unless({path: unsecuredRoutes}));

// set 'unauthorized' response
router.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') res.status(401).json({success:false,message:'Token missing or invalid.'});
});

app.use('/v1', router);


client.getApplication(config.stormpath.appUri, function(err, spApp) {
	if (err) throw err;
	application = spApp;

	// define routes
	require(path.join(__dirname, 'routes/weather'))(router, services[config.weatherService]);
	require(path.join(__dirname, 'routes/user'))(router, application, passport);

	app.listen(config.port);
	console.log('Web app started on port ' + config.port + '...');
});
