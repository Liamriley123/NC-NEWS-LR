exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", table => {
    table
      .increments("comment_id")
      .primary()
      .unique();
    table.string("username").references("users.username");
    table.integer("article_id").references("articles.article_id");
    table.integer("votes").defaultTo(0);
    table.date("created_at");
    table.text("body", "longtext").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comments");
};
