const topicsRouter = require('express').Router();
const {
  sendTopics,
  sendArticlesByTopic,
  addTopic,
  addArticleByTopic,
} = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addTopic);
topicsRouter
  .route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(addArticleByTopic);

module.exports = topicsRouter;
