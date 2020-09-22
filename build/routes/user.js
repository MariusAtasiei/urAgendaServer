"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controllers/user");
const express_1 = require("express");
const router = express_1.Router();
router.route("/id=:id").put(user_1.updateUser).delete(user_1.deleteUser);
exports.default = router;
