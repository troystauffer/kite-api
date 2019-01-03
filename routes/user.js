const config = require('config');
const easyPbkdf2 = require("easy-pbkdf2")();

class UserRoutes {
  constructor(router, db) {
    router.post('/users', (req, res) => {
      req.checkBody('email', 'Email is required.').notEmpty();
      req.checkBody('email', 'Email must be a valid email address.').isEmail();
      req.checkBody('name', 'Name is required.').notEmpty();
      req.checkBody('password', 'Password is required.').notEmpty();
      if (req.validationErrors()) {
        return res.status(400).json({
          success: false,
          response: {
            error: 'Required parameters not provided.',
            detail: req.validationErrors().map((error) => { return error.msg })
          }
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
