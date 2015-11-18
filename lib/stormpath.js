'use strict';
const stormpath = require('stormpath');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

let config = null;
let apiKey = null;
let client = null;
let self = null;
let log = null;

function Stormpath(_config, _log) {
	config = _config;
	log = _log;
	self = this;
	apiKey = new stormpath.ApiKey( config.id, config.secret );
	client = new stormpath.Client({apiKey: apiKey});
	EventEmitter.call(this);
}

Stormpath.prototype.connect = function() {
	client.getApplication(config.appUri, function(err, application) {
		if (err) {
			log.error(err);
			throw err;
		}
		self.emit('connected', application);
	});
};

util.inherits(Stormpath, EventEmitter);

module.exports = Stormpath;