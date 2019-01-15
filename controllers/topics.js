const connection = require("../db/connection");

exports.sendTopics = (req, res, next) => {
  console.log("Getting topics");
  connection("topics")
    .select("*")
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  //   const { slug, description } = req.body;
  //   if (!slug || !description) {
  //     Promise.reject({
  //       status: 400,
  //       msg: "400 not all parts of request body sent"
  //     });
  //   } else {
  connection("topics")
    .insert(req.body)
    .returning("*")
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.sendArticlesByTopic = (req, res, next) => {
  const { limit, sort_by, order, p } = req.query;
  connection("articles")
    .select(
      { author: "articles.username" },
      "title",
      "articles.article_id",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    //.from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.body as comment_count")
    .groupBy("articles.article_id")
    .where(req.params)
    .limit(limit || 10)
    .orderBy(sort_by || "created_at", order || "desc")
    .offset((p - 1) * limit || 0)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
//404 topic that doesnt exist
