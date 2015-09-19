var Stormpath = function () {
	return this;
};

Stormpath.prototype.authenticateAccount = function(authReq, cb) {
	return cb({}, null);
}

Stormpath.prototype.createAccount = function(account, cb) {
	cb({status:400, code:400, userMessage:'Password must contain at least 1 numeric character.'}, null);
}

module.exports = Stormpath;