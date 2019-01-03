const path = require('path');
const request = require('supertest');
const express = require('express');
const router = express.Router();
const app = new(require(path.join(__dirname, '../../express_app')))(router);
const db = require(path.join(__dirname, '../support/db'));

beforeAll(() => {
  new (require(path.join(__dirname, '../../routes/authenticate')))(router, db);
});

describe('Authenticate', () => {
  it('returns an error when no email is provided', (done) => {
    request(app).post('/v1/authenticate')
      .send({ password: 'mypass' })
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
    request(app).post('/v1/authenticate')
      .send({ email: 'test@example.com' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) done.fail(err);
        expect(res.body.success).toBe(false);
        expect(res.body.response.error).toBe('Required parameters not provided.');
        expect(res.body.response.detail).toEqual([ 'A valid password is required.' ]);
        done();
      });
  });

  it('returns an error when a blank password is provided', (done) => {
    request(app).post('/v1/authenticate')
      .send({ email: 'test@example.com', password: '' })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) done.fail(err);
        expect(res.body.success).toBe(false);
        expect(res.body.response.error).toBe('Required parameters not provided.');
        expect(res.body.response.detail).toEqual([ 'A valid password is required.' ]);
        done();
      });
  });

  it('returns an error when an invalid email is provided', (done) => {
    request(app).post('/v1/authenticate')
      .send({ email: 'not_valid', password: 'mypass' })
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

  it('returns an authentication token when a valid email and password are provided', (done) => {
    request(app).post('/v1/authenticate')
      .send({ email: 'test@example.com', password: 'mypass' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done.fail(err);
        expect(res.body.success).toBe(true);
        expect(res.body.response.token).toBeDefined();
        done();
      });
  });
});
