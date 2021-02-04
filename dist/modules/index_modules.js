"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keep_host = exports.get_data_from_worker = exports.hosting = exports.create_router = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var worker_threads_1 = require("worker_threads");
var http_1 = __importDefault(require("http"));
var exp = express_1.default();
exp.use(cors_1.default());
var create_router = function (url, data) {
    exp.get(url, function (request, response) {
        response.json(data);
    });
};
exports.create_router = create_router;
var hosting = function (port) {
    exp.listen(process.env.PORT || port, function () {
        console.log("API hosting started on port " + port);
    });
};
exports.hosting = hosting;
var get_data_from_worker = function (dir) {
    return new Promise(function (resolve, reject) {
        var worker = new worker_threads_1.Worker(dir);
        worker.on("message", function (data) { return resolve(data); });
    });
};
exports.get_data_from_worker = get_data_from_worker;
var keep_host = function (url) {
    setInterval(function () {
        http_1.default.get(url);
    }, 600000);
};
exports.keep_host = keep_host;
