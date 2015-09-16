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
				},
				stormpath: {
					id: '5IQUQJ7DLF0MRAFU78DM36MG1',
					secret: process.env.STORMPATH_KEY || '',
					appUri: 'https://api.stormpath.com/v1/applications/7fEjxYxu47G4JepLNEm1Ls'
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
				},
				stormpath: {
					id: '5IQUQJ7DLF0MRAFU78DM36MG1',
					secret: process.env.STORMPATH_KEY || '',
					appUri: 'https://api.stormpath.com/v1/applications/7fEjxYxu47G4JepLNEm1Ls'
				}
			};
	}
};