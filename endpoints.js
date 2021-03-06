module.exports = {
  '/api': [
    {
      '/topics': {
        '.GET': 'responds with an array of topic objects',
        '.POST':
          'accepts an object containing `slug` and `description` property, responds with the posted topic object',
      },
    },
    {
      '/topics/:topic/articles': {
        '.GET': 'responds with an array of article objects for a given topic',
        '.POST':
          'accepts an object containing a `title` , `body` and a `username` property and responds with the posted article',
      },
    },
    {
      '/articles': {
        '.GET': 'responds with an array of article objects',
      },
    },
    {
      '/articles/:article_id': {
        '.GET': 'responds with an article object of the article_id in params',
        '.PATCH':
          'accepts an object in the form `{ inc_votes: newVote }`, this end-point will respond with the article you have just updated',
        '.DELETE':
          'should delete the given article by `article_id` it will respond with 204 and no-content',
      },
    },
    {
      '/articles/:article_id/commemnts': {
        '.GET': 'responds with an array of comments for the given `article_id`',
        '.POST':
          'accepts an object with a `username` and `body` and responds with the posted comment',
      },
    },
    {
      '/articles/:article_id/commemnts/:comment_id': {
        '.PATCH':
          'accepts an object in the form `{ inc_votes: newVote }` and will respond with the comment you have just updated',
        '.DELETE':
          'should delete the given comment by `comment_id` and respond with 204 and no-content',
      },
    },
    {
      '/users': {
        '.GET': 'should respond with an array of user objects',
      },
    },
    {
      '/users/:username': {
        '.GET': 'should respond with a user object based on the username',
      },
    },
  ],
};
