const path = require('path');
const config = require('config');
const jws = require('jws');
const encryption = new(require(path.join(__dirname, 'encryption')))(config.get('encryption.algorithm'), config.get('encryption.secret'));

let authenticated = function(req, res, next) {
  let encryptedToken = req.body.token || req.query.token || req.headers['x-access-token'];
  let token = encryption.decrypt(encryptedToken);
  if (token) {
    if (jws.verify(token, config.get('jws.algorithm'), config.get('jws.key'))) {
      const user = jws.decode(token);
      req.user = JSON.parse(user.payload);
    } else {
      return res.status(400).json({ message: 'Unable to decrypt token.' });
    }
  } else {
    return res.status(403).json({ message: 'Unable to decrypt token.' });
  }
  next();
};
authenticated.unless = require('express-unless');
module.exports = authenticated;
