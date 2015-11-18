'use strict';

const path = require('path');
const request = require('supertest');
const chai = require('chai');

let app = null;

function Weather() {
	return this;
}

Weather.prototype.setApp = function(_app) {
	app = _app;
}

Weather.prototype.run = function() {
	describe('weather', function() {
		describe('conditions by zip', function() {
			describe('without an invalid zip code', function() {
				it('should return an error', function(done) {
					request(app)
					.get('/v1/weather/1')
					.expect(400)
					.expect({'info':'The data provided to the API was invalid or incomplete.', 'errors':[{'param':'zip','msg':'A valid zip code is required.','value':'1'}]}, done);
				});
			});

			describe('successfully', function() {
				it('should return the weather conditions', function(done) {
					request(app)
					.get('/v1/weather/37091')
					.expect(200)
					.end(function(err, res) {
						if (err) return done(err);
						res.body.weather.should.match(/\w*/);
						res.body.temperature_string.should.match(/\w*/);
						res.body.temp_f.should.match(/\d*/);
						res.body.temp_c.should.match(/\d*/);
						res.body.relative_humidity.should.match(/\w*/);
						res.body.wind_string.should.match(/\w*/);
						res.body.wind_dir.should.match(/\w*/);
						res.body.wind_degrees.should.match(/\d*/);
						res.body.wind_mph.should.match(/\d*/);
						res.body.wind_gust_mph.should.match(/\d*/);
						res.body.feelslike_string.should.match(/\w*/);
						res.body.feelslike_f.should.match(/\w*/);
						res.body.feelslike_c.should.match(/\w*/);
						res.body.visibility_mi.should.match(/\w*/);
						res.body.visibility_km.should.match(/\w*/);
						res.body.precip_1hr_in.should.match(/\w*/);
						res.body.precip_today_in.should.match(/\w*/);
						done();
					});
				});
			});
		});
	});
};

module.exports = Weather;