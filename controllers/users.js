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
  // const { username } = req.params;
  connection('users')
    .select('*')
    .where(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
