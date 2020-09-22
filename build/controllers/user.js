"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = void 0;
const user_1 = __importDefault(require("../models/user"));
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const updateUser = user_1.default.findByIdAndUpdate(id, req.body);
    updateUser.exec((err, user) => {
        if (err)
            return res.json({ error: "The user could not be updated" });
        else if (!user)
            return res.json({ error: "The user could not be found" });
        return res.json({ user });
    });
};
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const deleteUser = user_1.default.findByIdAndDelete(id);
    deleteUser.exec((err) => {
        if (err)
            return res.json({ error: "The user could not be deleted" });
        return res.json({ message: "The user had been deleted" });
    });
};
