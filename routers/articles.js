const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticleVotes,
  deleteArticle,
  sendCommentsByArticle,
} = require('../controllers/articles');
const { handle405 } = require('../errors/index');

articlesRouter
  .route('/')
  .get(sendArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticleVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter.route('/:article_id/comments').get(sendCommentsByArticle);

module.exports = articlesRouter;
