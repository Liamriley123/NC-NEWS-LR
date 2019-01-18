exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (table) => {
    // here use knex to create the new topics table
    table
      .string('slug')
      .primary()
      .unique(); // <-- here we create a column called slug which is our primary key
    table.string('description').notNullable(); // <-- here we create a field called description which will be a string
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
