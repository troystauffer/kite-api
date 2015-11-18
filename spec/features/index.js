'use strict';
const path = require('path');
const config = new (require(path.join(__dirname, '../../config/')));
const stormpath = new (require(path.join(__dirname, '../../lib/stormpath')))(config.stormpath);

describe('kite-api', function() {
	this.timeout(5000);
	let app = {};
	let server = {};
	let App = {};
	let application = null;
	let user = new (require('./user'))(app);
	let weather = new (require('./weather'))(app);

	let setup = function(express) {
		app = express.app;
		server = express.server;
	}

	before('server setup', function(done) {
		stormpath.on('connected', function(_application) {
			application = _application;
			App = new (require(path.join(__dirname, '../../app.js')));
			App.on('listening', function(express) {
				app = express.app;
				server = express.server;
				user.setApp(app);
				user.setApplication(application);
				weather.setApp(app);
			});
			setTimeout(function() { done(); }, 2000);
		});
		stormpath.connect();
	});

	user.run();
	weather.run();
});