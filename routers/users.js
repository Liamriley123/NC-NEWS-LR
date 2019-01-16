const usersRouter = require('express').Router();
const { sendUsers, sendUserByUsername } = require('../controllers/users');
const { handle405 } = require('../errors/index');

usersRouter
  .route('/')
  .get(sendUsers)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .all(handle405);

module.exports = usersRouter;
