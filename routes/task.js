const express = require("express");
const router = express.Router();
const {getTasks, singleTask, deleteTask, updateTask, makeTask, completedTask, getDeadline, getAllDeadlines} = require("../controllers/task");
const { verify } = require("../middleware/task");

router.post("/task",verify, makeTask);
router.get("/task", getTasks);
router.get("/task", singleTask);
router.delete("/delete-task",verify, deleteTask);
router.put("/update-task",verify, updateTask);
router.put("/complete-task",verify, completedTask);
router.get("/get-deadline", getDeadline);
router.get("/get-all-deadline", getAllDeadlines);


module.exports = router;