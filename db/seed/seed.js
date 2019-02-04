const {
  topicData, userData, articleData, commentData,
} = require('../data');
const { formatData, formatComments } = require('../utils/index');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .returning('*')
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))
    .then(() => {
      const formattedData = articleData.map(articles => formatData(articles));
      return knex('articles')
        .insert(formattedData)
        .returning('*');
    })
    .then((articleRows) => {
      const articleLookup = articleRows.reduce((result, article) => {
        result[article.title] = article.article_id;
        return result;
      }, {});
      const formattedComments = formatComments(commentData, articleLookup);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    });
};
