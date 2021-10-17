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
const express_1 = __importDefault(require("express"));
const naver_crawler_1 = require("./components/naver-crawler");
const exp = (0, express_1.default)();
const port = 3000;
exp.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
exp.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const naver = yield (0, naver_crawler_1.naver_crawler)();
    res.json(naver);
}));
//# sourceMappingURL=app.js.map