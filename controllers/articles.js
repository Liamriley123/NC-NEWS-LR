const connection = require("../db/connection");

exports.sendArticles = (req, res, next) => {
  const { limit = 10, order, p = 1 } = req.query;
  const validSort = [
    "votes",
    "created_at",
    "username",
    "comment_count",
    "body",
    "article_id",
    "topic",
    "author"
  ];
  const sortBy = validSort.includes(req.query.sort_by)
    ? req.query.sort_by
    : "created_at";
  connection("articles")
    .select(
      { author: "articles.username" },
      "title",
      "articles.article_id",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.body as comment_count")
    .groupBy("articles.article_id")
    .limit(limit || 10)
    .orderBy(sortBy, order || "desc")
    .offset((p - 1) * limit || 0)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  if (Number.isNaN(+inc_votes)) {
    next({
      status: 400,
      msg:
        "you must input data in the form { inc_votes : newVote } to change the vote."
    });
  } else {
    connection("articles")
      .where("articles.article_id", article_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(([article]) => {
        if (article) {
          return res.send({ article });
        }
        return next({
          status: 404,
          msg: `article not found with id ${article_id}`
        });
      })
      .catch(next);
  }
};
exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection("articles")
    .select(
      { author: "articles.username" },
      "title",
      "articles.article_id",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.body as comment_count")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(([article]) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no articles found under that article id"
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  connection("articles")
    .where("articles.article_id", article_id)
    .del()
    .then(response => {
      if (response === 0)
        next({ status: 404, msg: "no articles to delete with this ID" });
      else res.status(204).send({ msg: "article deleted" });
    })
    .catch(next);
};

exports.sendCommentsByArticle = (req, res, next) => {
  const {
    limit = 10,
    sort_by = "created_at",
    order = "desc",
    p = 1
  } = req.query;
  connection("comments")
    .select(
      { author: "comments.username" },
      "comments.comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.body"
    )
    .leftJoin("articles", "comments.article_id", "articles.article_id")
    .where("articles.article_id", req.params.article_id)
    .limit(limit || 10)
    .orderBy(sort_by, order)
    .offset((p - 1) * limit || 0)
    .then(comments => {
      if (comments.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "no comments found under that article"
        });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  connection("comments")
    .insert({
      article_id,
      body,
      username
    })
    .returning("*")
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 0;
  if (Number.isNaN(parseInt(inc_votes, 10)))
    return next({ status: 400, msg: "invalid inc_votes" });
  return connection("comments")
    .leftJoin("articles", "articles.article_id", "comments.article_id")
    .where("comment_id", comment_id)
    .andWhere("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, msg: "404 not found" });
      return res.send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  connection("comments")
    .where("comment_id", comment_id)
    .andWhere("article_id", article_id)
    .del()
    .then(response => {
      if (response === 0)
        return Promise.reject({ status: 404, msg: "comment not found" });
      return res.status(204).send({ msg: "comment deleted" });
    })
    .catch(next);
};
