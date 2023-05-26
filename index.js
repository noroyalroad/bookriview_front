const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://zhyunz123:root@cluster0.jtpve7r.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("mongo conect"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
