"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exp = (0, express_1.default)();
const port = 3000;
exp.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
exp.get("/", (req, res) => {
    const name = !req.query.name ? "World" : req.query.name;
    res.send(`Hello ${name}`);
});
//# sourceMappingURL=app.js.map