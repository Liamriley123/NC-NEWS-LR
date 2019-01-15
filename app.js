const app = require("express")();
const apiRouter = require("./routers/api");
const { handle404, handle400 } = require("./errors/index");

app.use("/api", apiRouter);

app.use(handle400);
app.use(handle404);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(500)
    .send({ msg: "faileddddd! :/, sorry something unexpected went wrong" });
});

module.exports = app;
