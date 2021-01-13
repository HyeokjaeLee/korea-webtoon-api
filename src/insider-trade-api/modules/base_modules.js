"use strict";
exports.__esModule = true;
exports.string_date_to_date_form = exports.$2num = void 0;
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
