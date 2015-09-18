var Stormpath = function () {
	return this;
};

Stormpath.prototype.authenticateAccount = function(authReq, cb) {
	var result = {
		getAccessToken: function() { return 'asdf1234'; }
	};
	return cb(null, result);
}

module.exports = Stormpath;