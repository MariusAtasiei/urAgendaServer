"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const user_1 = __importDefault(require("./routes/user"));
// import { deleteUnconfirmedAccounts } from "./middlewares/auth"
dotenv_1.default.config();
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(cors_1.default());
const uri = process.env.MONGODB_URI || "";
mongoose_1.default.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
mongoose_1.default.connection.once("open", () => console.log("Mongo connection established"));
app.use("/user", user_1.default);
app.use("/user", auth_1.default);
app.use("/task", task_1.default);
app.get("/", (req, res) => res.json("Server running"));
// deleteUnconfirmedAccounts()
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running"));
