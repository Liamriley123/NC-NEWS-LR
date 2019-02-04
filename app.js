const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./routers/api");
const {
  handle404,
  handle400,
  handle422,
  handle500
} = require("./errors/index");

app.use(bodyParser.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handle400);
app.use(handle422);
app.use(handle404);
app.use(handle500);

module.exports = app;
