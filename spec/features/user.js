'use strict';
const path = require('path');
const request = require('supertest');
const chai = require('chai');
const config = new (require(path.join(__dirname, '../../config/')));
const db = new (require(path.join(__dirname, '../../models/')))(config.database);
const async = require('async');

let app = null;
let application = null;
chai.should();

function User() {
	return this;
}

User.prototype.setApp = function(_app) {
	app = _app;
}

//stormpath
User.prototype.setApplication = function(_application) {
	application = _application;
}

User.prototype.run = function() {
	describe('user', function() {
		let email = 'test' + Math.floor((Math.random() * 100000) + 1) + '@example.com';

		after(function(done) {
			setTimeout(function(){
				db.User.findOne({ where:{ email: email }}).then(function(user) {
					user.destroy().then(function() {
						application.getAccounts({ username: email }, function(err, accounts) {
							if (err) throw err;
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
		
		describe('create account', function() {
			describe('with no email', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						password: 'Password1',
						firstname: 'Test',
						lastname: 'User'
					})
					.expect(400)
					.expect({'info': 'The data provided to the API was invalid or incomplete.', 'errors': [{'param': 'email', 'msg': 'Email is required.'}, {'param': 'email', 'msg': 'Email must be a valid email address.'}]}, done);
				});
			});

			describe('with an invalid email', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: 'asdf',
						password: 'Password1',
						firstname: 'Test',
						lastname: 'User'
					})
					.expect(400)
					.expect({'info': 'The data provided to the API was invalid or incomplete.', 'errors': [{'param': 'email', 'msg': 'Email must be a valid email address.', 'value': 'asdf'}]}, done);
				});
			});

			describe('with no password', function() {
				let email = 'test' + Math.floor((Math.random() * 100000) + 1) + '@example.com';
				it('should return an error', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: email,
						firstname: 'Test',
						lastname: 'User'		
					})
					.expect(400)
					.expect({'info': 'The data provided to the API was invalid or incomplete.', 'errors': [{'param': 'password', 'msg': 'A valid password is required.'}]}, done);
				});
			});

			describe('with no first name', function() {
				let email = 'test' + Math.floor((Math.random() * 100000) + 1) + '@example.com';
				it('should return an error', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: email,
						password: 'Password1',
						lastname: 'User'		
					})
					.expect(400)
					.expect({'info': 'The data provided to the API was invalid or incomplete.', 'errors': [{'param': 'firstname', 'msg': 'A valid first name is required.'}]}, done);
				});
			});

			describe('with no last name', function() {
				let email = 'test' + Math.floor((Math.random() * 100000) + 1) + '@example.com';
				it('should return an error', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: email,
						password: 'Password1',
						firstname: 'Test'
					})
					.expect(400)
					.expect({'info': 'The data provided to the API was invalid or incomplete.', 'errors': [{'param': 'lastname', 'msg': 'A valid last name is required.'}]}, done);
				});
			});

			describe('successfully', function() {
				it('should return a successful message', function(done) {
					request(app)
					.post('/v1/account')
					.send({
						email: email,
						password: 'Password1',
						firstname: 'Test',
						lastname: 'User'		
					})
					.expect(201)
					.expect({'info': 'Account created successfully.'}, done);
				});
			});
		});

		describe('login', function() {
			describe('with no password', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/login')
					.send({ email: email })
					.expect(401)
					.expect({'info': 'Missing credentials'}, done);
				});
			});

			describe('with no email', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/login')
					.send({ password: 'Password1' })
					.expect(401)
					.expect({'info': 'Missing credentials'}, done);
				});
			});

			describe('with invalid credentials', function() {
				it('should return an error', function(done) {
					request(app)
					.post('/v1/login')
					.send({
						email: email,
						password: 'asdf'
					})
					.expect(401)
					.expect({'info': 'Login failed.'}, done);
				});
			});

			describe('successfully', function() {
				it('should return a successful message', function(done) {
					request(app)
					.post('/v1/login')
					.send({
						email: email,
						password: 'Password1'
					})
					.expect(200)
					.end(function(err, res) {
						if (err) return done(err);
						res.body.token.should.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+\=]*$/);
						done();
					});
				});
			});
		});
	});
}

module.exports = User;