"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string2date = exports.convertDateFormat = exports.setTimer_loop = exports.ms2second = exports.ms2minute = exports.ms2hour = void 0;
var ms2hour = function (hour) { return hour * 3600000; };
exports.ms2hour = ms2hour;
var ms2minute = function (minute) { return minute * 60000; };
exports.ms2minute = ms2minute;
var ms2second = function (second) { return second * 1000; };
exports.ms2second = ms2second;
var setTimer_loop = function (sec_num, fn) {
    fn();
    setInterval(function () {
        fn();
    }, sec_num);
};
exports.setTimer_loop = setTimer_loop;
var convertDateFormat = function (input_date, form) {
    var date = new Date(input_date);
    var num2str = function (num) {
        var result;
        if (num < 10) {
            result = "0" + num;
        }
        else {
            result = String(num);
        }
        return result;
    };
    var year = date.getFullYear(); //yyyy
    var month = num2str(1 + date.getMonth()); //M
    var day = num2str(date.getDate());
    return year + form + month + form + day;
};
exports.convertDateFormat = convertDateFormat;
var string2date = function (string_date) {
    var strArr = string_date.split("-");
    var numArr = [];
    for (var i = 0; i < 3; i++) {
        numArr[i] = Number(strArr[i]);
    }
    var date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
    return date;
};
exports.string2date = string2date;
