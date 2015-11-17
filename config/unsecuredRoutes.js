'use strict';

function unsecuredRoutes() {
	return [
		'/v1/login',
		'/v1/account',
		'/v1/test',
		/\/v1\/weather\/\d+/
	];
}

module.exports = new unsecuredRoutes();