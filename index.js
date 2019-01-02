const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require('body-parser');
const config = require('config');
const morgan = require('morgan');
const validator = require('express-validator');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(validator());
app.use(morgan(config.get('morgan.format'), config.get('morgan.options')));

// router.use(authenticated.unless({ path: unsecuredRoutes }));

const port = config.get('port');
app.use(config.get('apiPrefix'), router);

// heartbeat
router.get('/info', (req, res) => {
  return res.status(200).json({ success: true });
});


new (require(path.join(__dirname, 'routes/authenticate')))(router);
new (require(path.join(__dirname, 'routes/user')))(router);

app.listen(port);
console.log(`Web app running on ${port}...`);
