const Crypto = require('crypto');

let _this = {};

class Encryption {
  constructor(algorithm, secret) {
    _this.algorithm = algorithm;
    _this.secret = secret;
  }

  encrypt(text) {
    let cipher = Crypto.createCipher(_this.algorithm, _this.secret);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(text) {
    try {
      let decipher = Crypto.createDecipher(_this.algorithm, _this.secret);
      let dec = decipher.update(text, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    } catch (e) {
      return false;
    }
  }
}

module.exports = Encryption;
