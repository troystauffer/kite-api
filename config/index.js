module.exports = function(){
	'use strict';
	switch(process.env.NODE_ENV){
		case 'development':
		default:
			return {
				port: process.env.PORT || 3000,
				openweathermap: {
					apiDomain: 'api.openweathermap.org',
					apiBaseUrl: '/data/2.5',
					keyfile: 'openweathermap.key'
				},
				wunderground: {
					apiDomain: 'api.wunderground.com',
					apiBaseUrl: '/api/',
					keyfile: 'wunderground.key'
				}
			};
	
		case 'production':
			return {
				port: process.env.PORT,
				openweathermap: {
					apiDomain: 'api.openweathermap.org',
					apiBaseUrl: '/data/2.5',
					keyfile: 'openweathermap.key'
				},
				wunderground: {
					apiDomain: 'api.wunderground.com',
					apiBaseUrl: '/api/',
					keyfile: 'wunderground.key'
				}
			};
	}
};