const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticleVotes,
  deleteArticle,
  sendCommentsByArticle,
  addCommentByArticle,
  updateCommentVotes,
  deleteComment,
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

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticle)
  .post(addCommentByArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes);
// .delete(deleteComment);

module.exports = articlesRouter;
