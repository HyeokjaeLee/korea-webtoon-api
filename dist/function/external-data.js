"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXmlAPI2JSON = exports.getJsonAPI = void 0;
var convert = __importStar(require("xml-js"));
var request = __importStar(require("request"));
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var getJsonAPI = function (url) {
    var xmlhttp = new XMLHttpRequest();
    var json_data;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                json_data = JSON.parse(xmlhttp.responseText);
            }
            catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
            }
        }
    };
    xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
    xmlhttp.send();
    return json_data;
};
exports.getJsonAPI = getJsonAPI;
var getXmlAPI2JSON = function (url) {
    return new Promise(function (resolve, reject) {
        request.get(url, function (err, res, body) {
            if (err) {
                console.log("err => " + err);
            }
            else {
                if (res.statusCode == 200) {
                    var JSON_Data = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
                    resolve(JSON_Data);
                }
            }
        });
    });
};
exports.getXmlAPI2JSON = getXmlAPI2JSON;
