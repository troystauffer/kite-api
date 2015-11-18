'use strict';
const _object = require('lodash/object');

module.exports = function(){
	let defaults = {
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
			id: '166E3L7RN0ZF4U4IIC4KVQERZ',
			secret: process.env.STORMPATH_KEY || '',
			appUri: 'https://api.stormpath.com/v1/applications/7fEjxYxu47G4JepLNEm1Ls'
		}
	};

	switch(process.env.NODE_ENV){
	case 'development':
	default:
		return _object.assign({
			port: process.env.PORT || 3000,
			database: {
				'dialect': 'sqlite',
				'storage': './kite-db.development.sqlite',
				'logging': false
			}, 
			log: {
				name: 'kite-api',
				streams: [
					{
						level: 'info',
						stream: process.stdout
					},
					{
						level: 'error',
						stream: process.stdout
					}
				]
			}
		}, defaults);

	case 'test':
		return _object.assign({
			port: process.env.PORT || 3000,
			database: {
				'dialect': 'sqlite',
				'storage': './kite-db.development.sqlite',
				logging: false
			}, 
			log: {
				name: 'kite-api-tests',
				level: 'error',
				stream: process.stdout
			}
		}, defaults);

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
			},
			database: {
				'use_env_variable': 'POSTGRES_CONNECTION_STRING',
				'dialect': 'postgres',
				'protocol': 'postgres',
				'native': true,
				'ssl': true,
				'dialectOptions': {
					'ssl': true
				},
				'logging': false
			}, 
			log: {
				name: 'kite-api',
				streams: [
					{
						level: 'info',
						stream: process.stdout
					},
					{
						level: 'error',
						stream: process.stderr
					}
				]
			}
		};
	}
};