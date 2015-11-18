'use strict';
const path = require('path');
const config = new (require(path.join(__dirname, '../../config/')));
const stormpath = new (require(path.join(__dirname, '../../lib/stormpath')))(config.stormpath);
const fs = require('fs');
const normalizedPath = path.join(__dirname, './');

let tests = {};

fs.readdirSync(normalizedPath).forEach(function(file) {
	if (file != 'index.js') tests[file] = new (require("./" + file));
});

describe('kite-api', function() {
	this.timeout(5000);
	let app = {};
	let server = {};
	let App = {};
	let application = null;

	before('server setup', function(done) {
		stormpath.on('connected', function(_application) {
			application = _application;
			App = new (require(path.join(__dirname, '../../app.js')));
			App.on('listening', function(express) {
				app = express.app;
				server = express.server;
				let initdata = {app: app, application: application};
				for (var key in tests) {
					if (tests.hasOwnProperty(key)) {
						tests[key].init(initdata);
					}
				}
			});
			setTimeout(function() { done(); }, 2000);
		});
		stormpath.connect();
	});

	for (var key in tests) {
		if (tests.hasOwnProperty(key)) {
			tests[key].run();
		}
	}
});