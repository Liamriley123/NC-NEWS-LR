const path = require("path");
const endpoints = require("../public/endpoints");

exports.sendJSON = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "endpoints.JSON"), null, err => {
  //   if (err) next(err);
  // });
  res.json(endpoints);
};
