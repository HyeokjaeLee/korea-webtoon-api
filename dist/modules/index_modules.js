"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepHosting = exports.getData_from_Worker = exports.hosting = exports.createRouter = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var worker_threads_1 = require("worker_threads");
var http_1 = __importDefault(require("http"));
var exp = express_1.default();
exp.use(cors_1.default());
var createRouter = function (router, data, router_list) {
    exp.get(router, function (request, response) {
        response.json(data);
    });
    return router;
};
exports.createRouter = createRouter;
var hosting = function (port) {
    exp.listen(process.env.PORT || port, function () {
        console.log("API hosting started on port " + port);
    });
};
exports.hosting = hosting;
var getData_from_Worker = function (dir) {
    return new Promise(function (resolve, reject) {
        var worker = new worker_threads_1.Worker(dir);
        worker.on("message", function (data) { return resolve(data); });
    });
};
exports.getData_from_Worker = getData_from_Worker;
var keepHosting = function (url) {
    setInterval(function () {
        http_1.default.get(url);
    }, 600000);
};
exports.keepHosting = keepHosting;
