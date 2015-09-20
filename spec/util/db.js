module.exports = {
	User: {
		create: function() {
			return new Promise(function(resolve, reject) {
				resolve({id:1});
			});
		},
		findOne: function() {
			return new Promise(function(resolve, reject) {
				resolve({id:1});
			});
		}
	},
	Notification: {
		find: function() {
			return new Promise(function(resolve, reject) {
				resolve({
					id: 1,
					userId: 1,
					zip: 12345,
					optimum: true,
					save: function() {
						return new Promise(function(resolve, reject) {
							resolve({
								id: 1,
								userId: 1,
								zip: 12345,
								optimum: true
							});
						});
					}
				});
			});
		},
		create: function() {
			return new Promise(function(resolve, reject) {
				resolve({
					id: 1,
					userId: 1,
					zip: 12345,
					optimum: true
				});
			});
		}
	}
}