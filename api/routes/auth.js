const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const checkAuth = require('../middlewares/check-auth');
const User = require("../models/user");

router.get("/users", async (req, res) => {
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

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  User.find({ email: email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          error: 'Error, user with this email already exists'
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: username,
              email: email,
              password: hash,
            });
            user.
              save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  isUserCreated: true,
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                })
              });
          }
        });
      }
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          error: 'Auth failed',
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(404).json({
            error: 'Auth failed',
          });
        }

        if (result) {
          const { _id, username, email } = user;
          const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
          }, process.env.JWT_KEY, { expiresIn: '6h' });
          return res.status(200).json({
            isLoggedIn: true,
            id: _id,
            username,
            email,
            token: token,
          });
        }

        return res.status(404).json({
          error: 'Auth failed',
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
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

router.patch("/:id", (req, res) => {
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

router.post("/getUser", (req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (decoded) {
      return res.status(200).json({
        user: decoded
      });
    } else {
      return res.status(500).json({
        error: 'Your token is invalid',
      });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: err.message === 'jwt expired' ? 'Your token is expired. Please login again' : err.message
    });
  }
});

router.delete("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  User.remove({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'User deleted',
        result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
