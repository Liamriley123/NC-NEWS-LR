const topicsRouter = require('express').Router();
const {
  sendTopics,
  sendArticlesByTopic,
  addTopic,
  addArticleByTopic,
} = require('../controllers/topics');
const { handle405 } = require('../errors/index');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addTopic)
  .all(handle405);
topicsRouter
  .route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(addArticleByTopic)
  .all(handle405);

module.exports = topicsRouter;
