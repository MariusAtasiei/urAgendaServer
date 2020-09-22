"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSignedIn = exports.signOut = exports.resetPassword = exports.forgotPassword = exports.confirmation = exports.signIn = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = __importDefault(require("express-jwt"));
exports.signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const newUser = yield user_1.default.create(body);
        const { _id } = newUser;
        // @ts-ignore
        const token = newUser.token(_id);
        const client = process.env.CLIENT_URL;
        const confirmLink = `${client}/confirmation/${_id.toString()}&${token}`;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_KEY,
            },
        });
        const { email, name } = body;
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: "urAgenda | Confirmation Account",
            text: `Hello, ${name}!\n If you want to confirm your account on urAgenda, please click on the link below: \n ${confirmLink}`,
        };
        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                throw error;
            }
        });
        const key = process.env.JWT_KEY || "";
        const tok = jsonwebtoken_1.default.sign({ _id }, key);
        res.cookie("t", tok);
        return res.json({ user: { _id, name }, token });
    }
    catch ({ message }) {
        return res.json({ error: message });
    }
});
exports.signIn = (req, res) => {
    const { email, password } = req.body;
    const userFind = user_1.default.findOne({ email }).select("-__v");
    userFind.exec((err, user) => {
        if (err)
            return res.json({ error: err.message });
        else if (!user)
            return res.json({ error: "User not found" });
        else if (!user.authenticate(password))
            return res.json({ error: "Incorrect password " });
        const { _id, name } = user;
        const key = process.env.JWT_KEY || "";
        const token = jsonwebtoken_1.default.sign({ _id }, key);
        res.cookie("t", token);
        return res.json({ user: { _id, name }, token });
    });
};
exports.confirmation = (req, res) => {
    const { key } = req.params;
    const [id, token] = key.split("&");
    const confirmingUser = user_1.default.findById(id);
    confirmingUser.exec((err, user) => {
        if (err || !user)
            return res.json({ error: err.message || "Invalid token" });
        // @ts-ignore
        const confirm = user.token(id) !== token;
        if (confirm)
            return res.json({ error: "Invalid token" });
        user.confirmed = true;
        user.save();
        return res.json({ message: "User confirmed" });
    });
};
exports.forgotPassword = (req, res) => {
    const { key } = req.params;
    const findUser = user_1.default.findById(key).select("salt email name");
    findUser.exec((err, { salt, email, name }) => {
        if (err)
            res.json({ error: err.message });
        else if (!salt)
            res.json({ error: "User not found" });
        const client = process.env.CLIENT_URL;
        const forgotLink = `${client}/forgot-password/${key}&${salt}`;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_KEY,
            },
        });
        const mailOptions = {
            from: process.env.GMAIL_KEY,
            to: email,
            subject: "urAgenda | Forgot Password",
            text: `Hello, ${name}!\n For reseting your password use the link below: \n  ${forgotLink}`,
        };
        transporter.sendMail(mailOptions, function (error) {
            if (error)
                res.json({ error: error.message });
        });
        const message = "Email sent. Check your email for reset password link.";
        return res.json({ message });
    });
};
exports.resetPassword = (req, res) => {
    const { key } = req.params;
    const [id, salt] = key.split("&");
    const { password } = req.body;
    const resetingUser = user_1.default.findById(id);
    resetingUser.exec((err, user) => {
        if (err)
            throw err;
        else if (!user)
            throw "Invalid link";
        else if (user.salt !== salt)
            throw "Invalid link";
        user.password = password;
        user.save();
        return res.json({ message: "Password reset successfuly" });
    });
};
exports.signOut = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Signed out successfully" });
};
exports.requireSignedIn = express_jwt_1.default({
    secret: process.env.JWT_KEY || ".",
    algorithms: ["RS256"],
    userProperty: "auth",
});
