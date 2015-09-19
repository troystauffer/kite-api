var Stormpath = function () {
	return this;
};

Stormpath.prototype.authenticateAccount = function(authReq, cb) {
	var result = {
		getAccessToken: function() { return 'asdf1234'; }
	};
	return cb(null, result);
}

Stormpath.prototype.createAccount = function(account, cb) {
	cb(null, {href:'http://example.com/testhref'});
}

module.exports = Stormpath;