"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnconfirmedAccounts = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const user_1 = __importDefault(require("../models/user"));
const moment_1 = __importDefault(require("moment"));
exports.deleteUnconfirmedAccounts = () => node_cron_1.default.schedule("* 2 * * *", () => {
    const expireDate = moment_1.default().subtract(1, "day");
    user_1.default.deleteMany({
        confirmed: false,
        createdAt: { $lte: expireDate },
    }).exec((err, { n, ok, deletedCount }) => {
        if (err)
            console.log(`DATA ERASE FAILED: ${err.message}`);
        else if (ok)
            console.log(`DATA ERASED: ${n} matches, ${deletedCount} deleted`);
        else
            console.log(`DATA ERASE FAILED: Data could not be deleted`);
    });
});
