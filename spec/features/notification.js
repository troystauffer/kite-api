'use strict';

const request = require('supertest');
const path = require('path');
const config = new (require(path.join(__dirname, '../../config/')));
const db = new (require(path.join(__dirname, '../../models/')))(config.database);
const async = require('async');

let app = null;
let application = null;

function Notification() {
	return this;
}

Notification.prototype.init = function(data) {
	app = data.app;
	application = data.application;
}

Notification.prototype.run = function() {
	describe('notification', function() {
		describe('set notification', function() {
			describe('without authorization', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/notification')
					.send({
						'zip': '37091',
						'optimum': true
					})
					.expect(401, done);
				});
			});

			describe('with proper authorization', function() {
				let email = 'test' + Math.floor((Math.random() * 100000) + 1) + '@example.com';
				let token = '';

				before('authorized notification', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: email,
						password: 'Password1',
						firstname: 'Test',
						lastname: 'User'		
					})
					.end(function(err, res) {
						if (err) return done(err);
						request(app)
						.post('/v1/login')
						.send({
							email: email,
							password: 'Password1'
						})
						.end(function(err, res) {
							if (err) return done(err);
							token = res.body.token;
							done();
						});
					});
				});

				after('authorized notification', function(done) {
					setTimeout(function(){
						db.User.findOne({ where:{ email: email }}).then(function(user) {
							user.destroy().then(function() {
								application.getAccounts({ username: email }, function(err, accounts) {
									if (err) done(err);
									async.each(accounts.items, function(account, cb) {
										account.delete(function(err) {
											if (err) throw err;
											cb();
										});
									}, function(err) {
										if (err) throw err;
										done();
									});
								});
							});
						});
					}, 1000);
				});

				describe('without a zip', function() {
					it('should return an error', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'optimum': true
						})
						.expect(400)
						.expect({
							'info': 'The data provided to the API was invalid or incomplete.',
							'errors': [
								{
									'msg': 'Zip code is required.',
									'param': 'zip'
								},
								{
									'msg': 'Zip code must be numeric.',
									'param': 'zip'
								},
								{
									'msg': 'Zip code must be 5 digits.',
									'param': 'zip'
								}
							]
						}, done);
					});
				});

				describe('with an alpha zip', function() {
					it('should return an error', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'zip':'asdf',
							'optimum': true
						})
						.expect(400)
						.expect({
							'info': 'The data provided to the API was invalid or incomplete.',
							'errors': [
								{
									'msg': 'Zip code must be numeric.',
									'param': 'zip',
									'value': 'asdf'
								},
								{
									'msg': 'Zip code must be 5 digits.',
									'param': 'zip',
									'value': 'asdf'
								}
							]
						}, done);
					});
				});

				describe('with a 4 digit zip', function() {
					it('should return an error', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'zip':'1234',
							'optimum': true
						})
						.expect(400)
						.expect({
							'info': 'The data provided to the API was invalid or incomplete.',
							'errors': [
								{
									'msg': 'Zip code must be 5 digits.',
									'param': 'zip',
									'value': '1234'
								}
							]
						}, done);
					});
				});

				describe('without a value for optimum', function() {
					it('should return an error', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'zip':'37091'
						})
						.expect(400)
						.expect({
							'info': 'The data provided to the API was invalid or incomplete.',
							'errors': [
								{
									'msg': 'A valid boolean value required for optimum.',
									'param': 'optimum'
								}
							]
						}, done);
					});
				});

				describe('with an invalid value for optimum', function() {
					it('should return an error', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'zip':'37091',
							'optimum':'bananas'
						})
						.expect(400)
						.expect({
							'info': 'The data provided to the API was invalid or incomplete.',
							'errors': [
								{
									'msg': 'A valid boolean value required for optimum.',
									'param': 'optimum',
									'value': 'bananas'
								}
							]
						}, done);
					});
				});

				describe('with valid data', function() {
					it('should return notification data', function(done) {
						request(app)
						.post('/v1/notification')
						.set('Authorization', 'Bearer ' + token)
						.send({
							'zip':'37091',
							'optimum':true
						})
						.expect(201)
						.end(function(err, res) {
							if (err) return done(err);
							res.body.id.should.match(/\d*/);
							res.body.userId.should.match(/\d*/);
							res.body.zip.should.eq('37091');
							res.body.optimum.should.eq(true);
							done();
						});
					});
				});
			});
		});
	});
};

module.exports = Notification;