const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
  if (err) console.log("ERROR >>>>", err);
  else console.log(`Listening on port ${PORT}`);
});
