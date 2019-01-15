const articlesRouter = require('express').Router();
const { sendArticles, sendArticleById } = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter.route('/:article_id').get(sendArticleById);

module.exports = articlesRouter;
