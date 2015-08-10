var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var Config = require(path.join(__dirname, 'config/'));
var config = new Config();
var validator = require('express-validator')
var WundergroundService = require(path.join(__dirname, 'lib/wunderground-service'));
var weatherService = new WundergroundService(config.wunderground);
var router = express.Router();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(validator());
app.use('/v1', router);

// routes
require(path.join(__dirname, 'routes/weather'))(router, weatherService);

app.listen(config.port);
console.log('Web app started on port ' + config.port + '.');