const path = require("path");
const endpoints = require("../endpoints");

exports.sendJSON = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "endpoints.JSON"), null, err => {
  //   if (err) next(err);
  // });
  res.json(endpoints);
};
