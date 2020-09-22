"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_1 = require("../controllers/task");
const router = express_1.Router();
router.route("").get(task_1.getTasks).post(task_1.createTask);
router.route("/:id").get(task_1.getTask).put(task_1.updateTask).delete(task_1.deleteTask);
exports.default = router;
