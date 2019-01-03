const path = require('path');
const config = require('config');
const jws = require('jws');
const easyPbkdf2 = require("easy-pbkdf2")();
const encryption = new(require(path.join(__dirname, '../lib/encryption')))(config.get('encryption.algorithm'), config.get('encryption.secret'));

class AuthenticateRoutes {
  constructor(router, db) {
    router.post('/authenticate', (req, res) => {
      req.checkBody('email', 'Email is required.').notEmpty();
      req.checkBody('email', 'Email must be a valid email address.').isEmail();
      req.checkBody('password', 'A valid password is required.').notEmpty();
      if (req.validationErrors())
        return res.status(400).json({
          success: false,
          response: {
            error: 'Required parameters not provided.',
            detail: req.validationErrors().map((error) => { return error.msg })
          }
        });
      db('users').where({ email: req.body.email }).then(rows => {
        let user = rows[0];
        easyPbkdf2.verify(user.salt, user.passwordHash, req.body.password, (err, valid) => {
          if (valid) {
            let token = generateToken({ user_id: user.id, email: user.email, name: user.name });
            return res.status(200).json({ success: valid, response: { token: token }});
          }
          return res.status(401).json({ success: false, error: 'Invalid email and password combination' });
        });
      });
    });
  }
}

function generateToken(data) {
  let token = jws.sign({
    header: { alg: config.get('jws.algorithm') },
    payload: data,
    secret: config.get('jws.key')
  });
  return encryption.encrypt(token);
}

module.exports = AuthenticateRoutes;
