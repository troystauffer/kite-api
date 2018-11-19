import 'dotenv/config';
import DB from './db';

require('./config');

const express = require('express');
const app = express();
const port = global.config.port;
const db = new DB();

app.listen(port, () => console.log(`kite-api listening on port ${port}`))
