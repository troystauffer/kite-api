const config = require('config');
const db = require('knex')(config.get('database'));
const easyPbkdf2 = require("easy-pbkdf2")();

class AuthenticateRoutes {
  constructor(router) {
    router.post('/authenticate', (req, res) => {
      // db('users').then(rows => { return res.json(rows)})
      req.checkBody('email', 'Email is required.').notEmpty();
      req.checkBody('email', 'Email must be a valid email address.').isEmail();
      req.checkBody('password', 'A valid password is required.').notEmpty();
      if (req.validationErrors())
        return res.status(400).json({ success: false, response: { error: 'Required parameters not provided.' }});
      db('users').where({ email: req.body.email }).then(rows => {
        let user = rows[0];
        easyPbkdf2.verify(user.salt, user.passwordHash, req.body.password, (err, valid) => {
          if (valid) return res.status(200).json({ success: valid });
          return res.status(401).json({ success: false, error: 'Invalid email and password combination' });
        });
      });
    });
  }
}

module.exports = AuthenticateRoutes;
