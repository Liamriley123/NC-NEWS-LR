const path = require("path");

exports.sendJSON = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "endpoints.JSON"), null, err => {
    if (err) next(err);
  });
};
