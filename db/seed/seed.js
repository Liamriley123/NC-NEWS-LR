const { topicData, userData, articleData, commentData } = require("../data");
const { formatData, formatComments } = require("../utils/index");

exports.seed = function(knex, Promise) {
  return knex("topics")
    .insert(topicData)
    .returning("*")
    .then(topicRows => {
      return knex("users")
        .insert(userData)
        .returning("*");
    })
    .then(userRows => {
      const formattedData = articleData.map(articles => {
        return formatData(articles);
      });
      return knex("articles")
        .insert(formattedData)
        .returning("*");
    })
    .then(articleRows => {
      const articleLookup = articleRows.reduce((result, article) => {
        result[article.title] = result.article_id;
        return result;
      }, {});
      const formattedComments = formatComments(commentData, articleLookup);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
