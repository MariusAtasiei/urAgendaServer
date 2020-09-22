"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    repeat: { type: Boolean, default: false },
    todo: { type: Boolean, default: true },
    starting: { type: Date, required: true },
    userId: { type: String, required: true },
    ending: Date,
    days: Array,
    day: Date,
    description: String,
});
exports.default = mongoose_1.model("Task", taskSchema);
