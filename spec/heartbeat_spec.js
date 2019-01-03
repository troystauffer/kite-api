const path = require('path');
const request = require('supertest');
const express = require('express');
const router = express.Router();
const app = new(require(path.join(__dirname, '../express_app')))(router);

beforeAll(() => {
  new (require(path.join(__dirname, '../routes/system')))(router);
});

describe('Server', () => {
  it('responds to a heartbeat request', (done) => {
    request(app)
      .get('/v1/info')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done.fail(err);
        expect(res.body.success).toBe(true);
        done();
      });
  });
});
