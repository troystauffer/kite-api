require('dotenv').config();

module.exports = {
  database: {
    client: 'sqlite',
    connection: { filename: './kite_api_db.sqlite' }
  },
  port: 3001,
  apiPrefix: '/v1',
  morgan: {
    format: 'dev',
    options: {
      skip: (req) => { return req.url == '/favicon.ico'; }
    }
  },
  jws: {
    key: process.env.SESSION_KEY,
    algorithm: 'HS256'
  },
  encryption: {
    algorithm: 'aes-256-ctr',
    secret: process.env.SESSION_KEY
  }
}
