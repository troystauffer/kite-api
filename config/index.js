module.exports = function(){
	'use strict';
	switch(process.env.NODE_ENV){
		case 'development':
		default:
			return {
				port: process.env.PORT || 3000,
				weatherService: 'wunderground',
				openweathermap: {
					apiDomain: 'api.openweathermap.org',
					apiBaseUrl: '/data/2.5',
					apiKey: process.env.OPENWEATHERMAP_KEY || ''
				},
				wunderground: {
					apiDomain: 'api.wunderground.com',
					apiBaseUrl: '/api/',
					apiKey: process.env.WUNDERGROUND_KEY || ''
				}
			};
	
		case 'production':
			return {
				port: process.env.PORT,
				weatherService: 'wunderground',
				openweathermap: {
					apiDomain: 'api.openweathermap.org',
					apiBaseUrl: '/data/2.5',
					apiKey: process.env.OPENWEATHERMAP_KEY || ''
				},
				wunderground: {
					apiDomain: 'api.wunderground.com',
					apiBaseUrl: '/api/',
					apiKey: process.env.WUNDERGROUND_KEY || ''
				}
			};
	}
};