const connection = require("../db/connection");

exports.sendTopics = (req, res, next) => {
  connection("topics")
    .select("*")
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  const { slug, description } = req.body;
  //   if (!slug || !description) {
  //     Promise.reject({
  //       status: 400,
  //       msg: "400 not all parts of request body sent"
  //     });
  //   } else {
  connection(topics)
    .insert(req.body)
    .returning("*")
    .then(([topic]) => {
      res.status(200).send({ topic });
    })
    .catch(next);
  //}
};

exports.sendArticlesByTopic = (req, res, next) => {
  const {
    limit = 10,
    order_by = "created_at",
    sort_order = "desc",
    ...filterOwners
  } = req.query;
  connection("articles")
    .select("*")
    .where(req.params)
    .limit(limit)
    .orderBy(order_by, sort_order)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
