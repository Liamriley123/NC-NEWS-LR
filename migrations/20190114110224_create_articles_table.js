exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table
      .increments('article_id')
      .primary()
      .unique();
    table.string('title').notNullable();
    table.text('body', 'longtext').notNullable();
    table.integer('votes').defaultTo(0);
    table.string('topic').references('topics.slug');
    table.string('username').references('users.username');
    table.date('created_at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
