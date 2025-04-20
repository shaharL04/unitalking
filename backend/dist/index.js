"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const originCheckMiddleware_1 = __importDefault(require("./middlewares/originCheckMiddleware"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(corsMiddleware_1.default);
app.use(originCheckMiddleware_1.default);
app.use(body_parser_1.default.json());
app.use('/', index_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map