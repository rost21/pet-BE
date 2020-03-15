const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./api/routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(
    `mongodb+srv://root:${process.env.MONGO_PASSWORD}@cluster0-u4u29.mongodb.net/Main?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(res => {
    if (res) {
      console.log("Connection with DB was succesfully");
    }
  })
  .catch(e => console.log(e));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/auth", authRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
