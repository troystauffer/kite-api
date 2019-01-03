const path = require('path');
const config = require('config');
const express = require('express');
const router = express.Router();
const db = require('knex')(config.get('database'));
const morgan = require('morgan');

class App {
  constructor() {
    const app = new(require(path.join(__dirname, 'express_app')))(router);
    app.use(morgan(config.get('morgan.format'), config.get('morgan.options')));
    new (require(path.join(__dirname, 'routes/system')))(router);
    new (require(path.join(__dirname, 'routes/authenticate')))(router, db);
    new (require(path.join(__dirname, 'routes/user')))(router, db);

    const port = config.get('port');
    app.listen(port);
    console.log(`Web app running on ${port}...`);
  }
}

module.exports = App;
