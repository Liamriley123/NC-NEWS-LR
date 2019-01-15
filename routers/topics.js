const topicsRouter = require('express').Router();
const {
  sendTopics,
  sendArticlesByTopic,
  addTopic,
} = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addTopic);
topicsRouter.route('/:topic/articles').get(sendArticlesByTopic);

module.exports = topicsRouter;
