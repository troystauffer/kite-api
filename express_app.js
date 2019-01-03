const path = require('path');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const config = require('config');
const validator = require('express-validator');
const authenticated = require(path.join(__dirname, 'lib/authenticated'));
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecured_routes'))(config.get('apiPrefix'));


class ExpressApp {
  constructor(router) {
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    app.use(validator());
    router.use(authenticated.unless({ path: unsecuredRoutes }));
    app.use(config.get('apiPrefix'), router);
    return app;
  }
}

module.exports = ExpressApp;
