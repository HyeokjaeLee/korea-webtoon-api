"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weekday = exports.get_json_data = void 0;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
exports.weekday = weekday;
var get_json_data = function (url) {
    var xmlhttp = new XMLHttpRequest();
    var json_data = "";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                json_data = JSON.parse(xmlhttp.responseText);
            }
            catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };
    xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
    xmlhttp.send();
    return json_data;
};
exports.get_json_data = get_json_data;
