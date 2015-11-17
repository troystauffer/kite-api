'use strict';

const express = require('express');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const config = new (require(path.join(__dirname, 'config/')));
const log = (require('bunyan')).createLogger(config.log);
const validator = require('express-validator');
const services = {};
services.wunderground = new (require(path.join(__dirname, 'lib/wunderground-service')))(config.wunderground, log);
const router = express.Router();
const stormpath = require('stormpath');
const apiKey = new stormpath.ApiKey( config.stormpath.id, config.stormpath.secret );
const client = new stormpath.Client({apiKey: apiKey});
const passport = require('passport');
const jwt = require('express-jwt');
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecuredRoutes'));
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const EventEmitter = require('events').EventEmitter;
const util = require('util');

let application = null;

function App() {
	EventEmitter.call(this);
	let self = this;
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.use(bodyparser.json());
	app.use(validator());

	router.use(jwt({secret:config.stormpath.secret}).unless({path: unsecuredRoutes}));

	// set 'unauthorized' response
	router.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
		if (err.name === 'UnauthorizedError') res.status(401).json({success:false,message:'Token missing or invalid.'});
	});

	app.use('/v1', router);

	client.getApplication(config.stormpath.appUri, function(err, spApp) {
		if (err) throw err;
		application = spApp;

		// define routes
		require(path.join(__dirname, 'routes/weather'))(router, services[config.weatherService]);
		require(path.join(__dirname, 'routes/user'))(router, application, passport, db, config.stormpath.secret, log);
		require(path.join(__dirname, 'routes/notification'))(router, db);

		app.listen(config.port);
		log.info('Web app started on port ' + config.port + '...');
		self.emit('listening', app);
	});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;