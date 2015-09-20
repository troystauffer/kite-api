function Req() {
	return { 
		user: {
			sub: 'a_url'
		},
		checkBody: function() {return this},
		checkParams: function() {return this},
		notEmpty: function() {return this},
		isNumeric: function() {return this},
		isLength: function() {return this},
		isBoolean: function() {return this},
		isEmail: function() {return this},
		validationErrors: function() {return null},
		logIn: function(user, cb) { cb(null); }
	};
}

module.exports = Req;