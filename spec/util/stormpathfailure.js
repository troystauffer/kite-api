var Stormpath = function () {
	return this;
};

Stormpath.prototype.authenticateAccount = function(authReq, cb) {
	return cb({}, null);
}

module.exports = Stormpath;