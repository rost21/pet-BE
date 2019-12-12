const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../../logger")

const Student = require("../models/student");

router.post("/", async (req, res) => {
  logger.trace(req.body)
  const student = new Student({
    id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    group: req.body.group,
    speciality: req.body.speciality,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const result = await student.save();
    logger.debug("Added student: ", result);
    res.status(201).json({
      addedStudent: student,
      isUserCreated: true
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      error: e
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const docs = await Student.find();
    logger.debug(docs)
    res.status(200).json(docs);
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      error: e
    });
  }
});

router.get("/dublicates", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $group: {
          _id: { firstName: "$firstName" },
          dublicates: { $addToSet: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gte: 2 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    logger.debug(result)
    res.status(200).json(result);
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      error: e
    });
  }
});

router.delete("/delete", async (req, res) => {
  logger.trace(req.body)
  const ids = req.body.ids;
  try {
    await Student.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } },
      { strict: false }
    );

    res.sendStatus(200);
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      error: e
    });
  }
});

module.exports = router;
