const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const { User } = require("./models/User");
const bodyparser = require("body-parser");
const config = require("./config/keys");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
mongoose
  .connect(config.MongoURI)
  .then(() => console.log("mongo conect"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  //user모델에 정보가 저장됨
  //실패 시, 실패한 정보를 보내줌
  user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
