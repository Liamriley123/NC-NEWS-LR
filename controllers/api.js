const path = require("path");

exports.sendJSON = (req, res, next) => {
  res.sendFile("../endpoints.JSON", null, err => {
    if (err) next(err);
  });
};
