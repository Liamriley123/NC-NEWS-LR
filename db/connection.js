// current environment
const ENV = process.env.NODE_ENV || "development";
// knex module
const knex = require("knex");

// config object for project
const dbConfig =
  ENV === "production"
    ? {
        client: "pg",
        connection: {
          database: DATABASE_URL
        }
      }
    : require("../knexfile")[ENV];

// object with a load of functionality that we can then pass to our controllers
const connection = knex(dbConfig);
module.exports = connection;
