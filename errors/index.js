exports.handle404 = (err, req, res, next) => {
  res.status(404).send({ msg: err.msg });
};

exports.handle400 = (err, req, res, next) => {
  const codes400 = ["22P02", "42703"];
  if (codes400.includes(err.code)) {
    res.status(400).send({ msg: err.toString() });
  } else next(err);
};
