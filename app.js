const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./api/routes/auth");
const studentsRoutes = require("./api/routes/students");
const logger = require("./logger");

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
      logger.info("Connection with DB was succesfully")
    }
  })
  .catch(e => logger.error(e));

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
app.use("/students", studentsRoutes);

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

// const toDoBoard = [
//   {
//     idList: uuid(),
//     title: "My to do list",
//     tasks: [
//       {
//         id: uuid(),
//         name: "Co",
//         selected: true
//       },
//       {
//         id: uuid(),
//         name: "Destroy half of the universe",
//         selected: false
//       }
//     ]
//   }
// ];

// const dbConnect = async () => {
//   db_connect();
//   // const connect = await MongoClient.connect(url, option);
//   // return connect;
// };

// app.get("/list", (_, res) => {
//   return res.json(toDoBoard);
// });

// app.get("/list/:id", (req, res) => {
//   const list = toDoBoard.find(l => l.idList === req.params.id);
//   if (!list) {
//     res.sendStatus(404);
//   }
//   res.json(list);
// });

// app.post("/list", (req, res) => {
//   console.log(req.body);
//   if (
//     typeof req.body.title !== "string" ||
//     !Array.isArray(req.body.tasks) ||
//     req.body.tasks.some(
//       item =>
//         typeof item.id !== "string" ||
//         typeof item.name !== "string" ||
//         typeof item.selected !== "boolean"
//     )
//   ) {
//     res.sendStatus(400);
//   } else {
//     const newList = {
//       idList: uuid(),
//       title: req.body.title,
//       tasks: req.body.tasks.map(item => ({
//         id: uuid(),
//         name: item.name,
//         selected: item.selected
//       }))
//     };
//     toDoBoard.push(newList);
//     res.json(newList);
//   }
// });

// app.put("/list/:id", (req, res) => {
//   if (
//     typeof req.body.title !== "string" ||
//     !Array.isArray(req.body.tasks) ||
//     req.body.tasks.some(
//       item =>
//         typeof item.id !== "string" ||
//         typeof item.name !== "string" ||
//         typeof item.selected !== "boolean"
//     )
//   ) {
//     res.sendStatus(400);
//   } else {
//     const listIndex = toDoBoard.findIndex(
//       list => list.idList === req.params.id
//     );
//     if (listIndex === -1) {
//       res.sendStatus(404);
//     } else {
//       const list = toDoBoard[listIndex];
//       toDoBoard[listIndex].title = req.body.title;
//       toDoBoard[listIndex].tasks = req.body.tasks;
//       res.sendStatus(200);
//     }
//   }
// });

// app.delete("/list/:id", (req, res) => {
//   const listIndex = toDoBoard.findIndex(list => list.idList === req.params.id);
//   if (listIndex === -1) {
//     res.sendStatus(404);
//   } else {
//     toDoBoard.splice(listIndex, 1);
//     res.sendStatus(200);
//   }
// });

// const port = 3001;

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });
