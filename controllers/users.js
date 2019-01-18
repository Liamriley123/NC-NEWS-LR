const connection = require('../db/connection');

exports.sendUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .where('username', username)
    .then(([user]) => {
      if (user) return res.send({ user });
      return Promise.reject({ status: 404, msg: 'user not found' });
    })
    .catch(next);
};
