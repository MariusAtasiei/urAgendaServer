"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// @ts-ignore
const uuidv1_1 = __importDefault(require("uuidv1"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    hashedPassword: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    confirmed: { type: Boolean, default: false },
    salt: { type: String },
}, { timestamps: true });
userSchema.virtual("password").set(function (password) {
    // @ts-ignore
    this._password = password;
    // @ts-ignore
    this.salt = uuidv1_1.default();
    // @ts-ignore
    this.hashedPassword = this.encryptPassword(password);
});
userSchema.methods = {
    authenticate: function (password) {
        const encryptPass = this.encryptPassword(password);
        return encryptPass === this.hashedPassword;
    },
    encryptPassword: function (password) {
        if (!password)
            return "";
        try {
            return crypto_1.default.createHmac("sha1", this.salt).update(password).digest("hex");
        }
        catch (err) {
            return "";
        }
    },
    token: function (_id) {
        if (!_id)
            return "";
        const id = _id.toString();
        try {
            return crypto_1.default.createHmac("sha1", this.salt).update(id).digest("hex");
        }
        catch (err) {
            return "";
        }
    },
};
exports.default = mongoose_1.model("User", userSchema);
