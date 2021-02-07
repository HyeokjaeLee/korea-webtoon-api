"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_json_data = exports.string_date_to_date_form = exports.$2num = void 0;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var get_json_data = function (url) {
    var xmlhttp = new XMLHttpRequest();
    var json_data;
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
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    return json_data;
};
exports.get_json_data = get_json_data;
var string_date_to_date_form = function (string_date) {
    var strArr = string_date.split("-");
    var numArr = [];
    for (var i = 0; i < 3; i++) {
        numArr[i] = Number(strArr[i]);
    }
    var date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
    return date;
};
exports.string_date_to_date_form = string_date_to_date_form;
var $2num = function (string_data) {
    return Number(string_data.replace("$", "").replace(/,/gi, ""));
};
exports.$2num = $2num;
