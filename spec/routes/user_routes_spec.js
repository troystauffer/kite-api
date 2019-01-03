const path = require('path');
const config = require('config');
const request = require('supertest');
const express = require('express');
const router = express.Router();
const app = new(require(path.join(__dirname, '../../express_app')))(router);
const db = require(path.join(__dirname, '../support/db'));

beforeAll(() => {
  new (require(path.join(__dirname, '../../routes/user')))(router, db);
});

describe('User routes', () => {
  describe('create', () => {
    it('returns an error when no email is provided', (done) => {
      request(app).post(config.get('apiPrefix') + '/users')
        .send({ name: 'Test User', password: 'mypass' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) done.fail(err);
          expect(res.body.success).toBe(false);
          expect(res.body.response.error).toBe('Required parameters not provided.');
          expect(res.body.response.detail).toEqual([ 'Email is required.', 'Email must be a valid email address.' ]);
          done();
        });
    });

    it('returns an error when no password is provided', (done) => {
      request(app).post(config.get('apiPrefix') + '/users')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) done.fail(err);
          expect(res.body.success).toBe(false);
          expect(res.body.response.error).toBe('Required parameters not provided.');
          expect(res.body.response.detail).toEqual([ 'Password is required.' ]);
          done();
        });
    });

    it('returns an error when no name is provided', (done) => {
      request(app).post(config.get('apiPrefix') + '/users')
        .send({ password: 'mypass', email: 'test@example.com' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) done.fail(err);
          expect(res.body.success).toBe(false);
          expect(res.body.response.error).toBe('Required parameters not provided.');
          expect(res.body.response.detail).toEqual([ 'Name is required.' ]);
          done();
        });
    });

    it('returns an error when an invalid email is provided', (done) => {
      request(app).post(config.get('apiPrefix') + '/users')
        .send({ name: 'Test User', password: 'mypass', email: 'example.com' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) done.fail(err);
          expect(res.body.success).toBe(false);
          expect(res.body.response.error).toBe('Required parameters not provided.');
          expect(res.body.response.detail).toEqual([ 'Email must be a valid email address.' ]);
          done();
        });
    });

    it('returns a success message', (done) => {
      request(app).post(config.get('apiPrefix') + '/users')
        .send({ name: 'Test User', password: 'mypass', email: 'test@example.com' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) done.fail(err);
          expect(res.body.success).toBe(true);
          done();
        });
    });
  });
});
