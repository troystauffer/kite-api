
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments('id').unsigned().primary();
    t.string('email').notNull();
    t.string('name');
    t.string('passwordHash');
    t.string('salt');
    t.timestamps(true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
