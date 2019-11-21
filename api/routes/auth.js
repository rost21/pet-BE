const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("express-jwt");

const User = require("../models/user");

router.get("/", async (req, res, next) => {
  try {
    const docs = await User.find();
    res.status(200).json(docs);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e
    });
  }
});

router.post("/login/:username", async (req, res, next) => {
  const username = req.params.username;
  const { login, email, password } = req.body;
  console.log(req.body);
  try {
    const response = await User.findOne({ username: username });
    console.log(response);

    if (response) {
      if (
        response.password === password &&
        (response.login === login || response.email === email)
      ) {
        res.status(200).json({
          isLogin: true,
          user: response
        });
      } else {
        res.status(404).json({
          error: "Failed login!"
        });
      }
    } else {
      res.status(404).json({
        error: "No found user with username!"
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e
    });
  }
});

// router.get("/:id", (req, res, next) => {
//   const id = req.params.id;
//   User.findById(id)
//     .then(doc => {
//       console.log(doc);
//       if (doc) {
//         res.status(200).json(doc);
//       } else {
//         res.status(404).json({
//           message: "No found user with id: " + id
//         });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

router.post("/register", async (req, res, next) => {
  const user = new User({
    id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const result = await user.save();
    console.log("Created user: ", result);
    res.status(201).json({
      createdUser: user,
      isUserCreated: true
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e,
      isUserCreated: false
    });
  }
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  // console.log(updateOps);
  User.update({ _id: id }, { $set: { login: req.body.login } })
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  User.remove({ _id: id })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
