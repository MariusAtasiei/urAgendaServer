"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const task_1 = __importDefault(require("../models/task"));
exports.createTask = (req, res) => {
    const { body } = req;
    const { userId } = req.query;
    body.userId = userId;
    try {
        task_1.default.create(body);
        return res.json({ message: "Task created successfully" });
    }
    catch ({ message }) {
        return res.json({ error: message });
    }
};
exports.getTasks = (req, res) => {
    let { query } = req;
    if (query.starting)
        query.starting = JSON.parse(query.starting);
    const findTasks = task_1.default.find(query).select("-__v").sort("starting");
    findTasks.exec((err, tasks) => {
        if (err)
            return res.json({ error: err.message });
        return res.json({ tasks });
    });
};
exports.getTask = (req, res) => {
    const { id } = req.params;
    const findTask = task_1.default.findById(id).select("-__v");
    findTask.exec((err, task) => {
        if (err)
            return res.json({ error: err.message });
        return res.json({ task });
    });
};
exports.updateTask = (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const findAndUpdateTask = task_1.default.findByIdAndUpdate(id, body);
    findAndUpdateTask.exec((err, task) => {
        if (err)
            return res.json({ error: err.message });
        return res.json({ task });
    });
};
exports.deleteTask = (req, res) => {
    const { id } = req.params;
    const findAndDeleteTask = task_1.default.findByIdAndDelete(id);
    findAndDeleteTask.exec((err, task) => {
        if (err)
            return res.json({ error: err.message });
        return res.json({ task });
    });
};
