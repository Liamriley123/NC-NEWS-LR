const connection = require('../db/connection');

exports.sendTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.sendArticlesByTopic = (req, res, next) => {
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
    // .from("articles")
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .where(req.params)
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .offset((p - 1) * limit || 0)
    .then((articles) => {
      if (articles.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'no articles found under that topic',
        });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  const { title, body, username } = req.body;
  connection('articles')
    .insert({
      topic,
      title,
      body,
      username,
    })
    .returning('*')
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
