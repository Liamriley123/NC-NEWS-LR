const connection = require('../db/connection');

exports.sendArticles = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  connection('articles')
    .select(
      { author: 'articles.username' },
      'title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.body as comment_count')
    .groupBy('articles.article_id')
    .where(req.params)
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .offset((p - 1) * limit || 0)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select(
      { author: 'articles.username' },
      'title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.body as comment_count')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
