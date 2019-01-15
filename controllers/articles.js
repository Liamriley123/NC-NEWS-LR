const connection = require("../db/connection");

exports.sendArticles = (req, res, next) => {
  connection("articles")
    .select("*")
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
