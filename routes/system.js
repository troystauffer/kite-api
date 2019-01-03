const config = require('config');
const db = require('knex')(config.get('database'));
class SystemRoutes {
  constructor(router) {
    router.get('/info', (req, res) => {
      return res.status(200).json({ success: true });
    });
  }
}

module.exports = SystemRoutes;
