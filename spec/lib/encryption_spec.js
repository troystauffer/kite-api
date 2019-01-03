const path = require('path');
const config = require('config');
const encryption = new(require(path.join(__dirname, '../../lib/encryption')))(config.get('encryption.algorithm'), config.get('encryption.secret'));

describe('Encryption', () => {
  it('should encrypt data', (done) => {
    let encrypted = encryption.encrypt('this');
    expect(encrypted).toEqual('699ba7e8');
    done();
  });

  it('should decrypt data', (done) => {
    let encrypted = encryption.decrypt('699ba7e8');
    expect(encrypted).toEqual('this');
    done();
  });
});
