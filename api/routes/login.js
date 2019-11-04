const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.find()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No found user with id: " + id
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  // const user = {
  //   login: req.body.login,
  //   password: req.body.password
  // };
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    login: req.body.login,
    password: req.body.password
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST to /login",
        createdUser: user
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
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
