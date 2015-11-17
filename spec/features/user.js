'use strict';
const path = require('path');
const request = require('supertest');
const chai = require('chai');

let expect = chai.expect;
let App = {};
let app = {};


describe('server response', function () {
	this.timeout(5000);
	
	before(function(done) {
		App = new (require(path.join(__dirname, '../../app.js')));
		App.on('listening', function(_app) {
			app = _app;
			done();
		});
	});

	it('should return 200', function (done) {
		request(app)
		.get('/v1/weather/37091')
		// .expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res){
			if (err) throw err;
			done();
		});
	});
});