const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { Comment } = require("./models/Comment");

const bodyparser = require("body-parser");
const config = require("./config/keys");
const cookieparser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { Board } = require("./models/Board");
const multer = require("multer");
// const { request } = require("http");
// const { userInfo } = require("os");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
mongoose
  .connect(config.MongoURI)
  .then(() => console.log("mongo conect"))
  .catch((err) => console.log(err));

app.post("/api/users/register", (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((docs) => {
      if (!docs) {
        return res.json({
          loginsuccess: false,
          message: "제공 된 이메일에 해당하는 유저가 없습니다",
        });
      }
      docs.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) return res.json({ loginsuccess: false, message: "비밀번호가 틀렸습니다" });

        docs.generateToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie("x_auth", user.token).status(200).json({ loginsuccess: true, userId: user._id });
        });
      });
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(() => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 파일이 저장될 경로 설정
    cb(null, "img/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and JPG files are allowed"), false);
  }
};

const upload = multer({
  storage,
});
app.post("/api/upload", upload.single("file"), (req, res) => {
  // 업로드된 파일은 req.file에서 접근 가능

  res.json({ message: "File uploaded successfully", a: res.req.file });
});

// 글 작성
app.post("/api/write", (req, res) => {
  const board = new Board(req.body);
  board
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
// 댓글작성
app.post("/api/comment/savecomment", (req, res) => {
  const comment = new Comment(req.body);

  comment
    .save()
    .then((comment) => {
      return Comment.findById(comment._id).populate("writer").exec();
    })
    .then((result) => {
      return res.status(200).json({ success: true, result });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});
//저장된 댓글 전송
app.post("/api/comment/getcomment", (req, res) => {
  Comment.find({ commentId: req.body._id })
    .populate("writer")
    .exec()
    .then((comments) => {
      res.status(200).json({ success: true, comments });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// app.post("/api/board/write", (req, res) => {
//   const { writer, title, content } = req.body;

//   const board = new Board({ writer, title, content });
//   board
//     .save()
//     .then(() => {
//       res.json({ message: "success" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json({ message: false });
//     });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
