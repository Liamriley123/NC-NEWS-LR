const connection = require('../db/connection');

exports.sendArticles = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  // const validSort = ['votes','created_ad','username','comment_count']
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
    // .where(req.params)
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .offset((p - 1) * limit || 0)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes || Number.isNaN(+inc_votes)) {
    next({
      status: 400,
      msg:
        'you must input data in the form { inc_votes : newVote } to change the vote.',
    });
  } else {
    connection('articles')
      .where('articles.article_id', article_id)
      .increment('votes', inc_votes)
      .returning('*')
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
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
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'no articles found under that article id',
        });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .where('articles.article_id', article_id)
    .del()
    .then(() => {
      res.status(204).send({ msg: 'article deleted' });
    });
};

exports.sendCommentsByArticle = (req, res, next) => {
  const {
    limit,
    sort_by = 'created_at',
    sort_ascending = 'false',
    p,
  } = req.query;
  connection('comments')
    .select(
      { author: 'comments.username' },
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.body',
    )
    .leftJoin('articles', 'comments.article_id', 'articles.article_id')
    .where('articles.article_id', req.params.article_id)
    .limit(limit || 10)
    .orderBy(sort_by, sort_ascending === 'true' ? 'asc' : 'desc')
    .offset((p - 1) * limit || 0)
    .then((comments) => {
      if (comments.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'no comments found under that article',
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  connection('comments')
    .insert({
      article_id,
      body,
      username,
    })
    .returning('*')
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  console.log(article_id);
  const { inc_votes } = req.body;
  if (!inc_votes || Number.isNaN(+inc_votes)) {
    next({
      status: 400,
      msg:
        'you must input data in the form { inc_votes : newVote } to change the vote.',
    });
  } else {
    connection('comments')
      .where({ comment_id, article_id })
      .increment('votes', inc_votes)
      .returning('*')
      .then((comment) => {
        if (comment.length < 1) {
          return Promise.reject({
            status: 404,
            msg: 'no comments found under that article',
          });
        }
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  connection('comments')
    .where('comments.comment_id', comment_id)
    .del()
    .then(() => {
      if (comments.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'no comments found under that article',
        });
      }
      res.status(204).send({ msg: 'comment deleted' });
    });
};
