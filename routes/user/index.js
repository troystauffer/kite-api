const config = require('config');
const db = require('knex')(config.get('database'));
const easyPbkdf2 = require("easy-pbkdf2")();

class UserRoutes {
  constructor(router) {
    router.post('/users', (req, res) => {
      req.checkBody('email', 'Email is required').notEmpty().isEmail();
      req.checkBody('name', 'Name is required').notEmpty();
      req.checkBody('password', 'Password is required').notEmpty();
      if (req.validationErrors()) {
        return res.status(400).json({
          success: false,
          response: { error: 'Required parameters not provided.', detail: req.validationErrors() }
        });
      }
      let salt = easyPbkdf2.generateSalt();
      easyPbkdf2.secureHash(req.body.password, salt, (err, passwordHash) => {
        db('users').insert({
          email: req.body.email,
          name: req.body.name,
          passwordHash: passwordHash,
          salt: salt
        }).then(user => {
          return res.status(201).json({ success: true });
        });
      });
    });
  }
}

module.exports = UserRoutes;
