const path = require("path");
const endpoints = require("../endpoints");

exports.sendJSON = (req, res, next) => {
  res.json(endpoints);
};
