exports.handle400 = (err, req, res, next) => {
  console.log(err);
  const codes400 = ['22P02', '42703', '23502'];
  if (codes400.includes(err.code) || err.status === 400) {
    res.status(400).send({ msg: err.toString() });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  console.log(err.code);
  res.status(404).send({ msg: err.msg });
};

exports.handle405 = (req, res) => {
  res.status(405).send({ msg: 'incorrect method used' });
};
