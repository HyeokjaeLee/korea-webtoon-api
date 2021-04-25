"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query2Date = exports.isExists = exports.checkUpdates = void 0;
var checkUpdates = function (api_name, data) {
    console.log("\n-----------" + new Date() + "-----------\n");
    if (data != undefined) {
        console.log(api_name + " data has been updated successfully.");
    }
    else {
        console.log(api_name + " data update failed.");
    }
};
exports.checkUpdates = checkUpdates;
var isExists = function (data) {
    if (typeof data == undefined || data == null || data == "")
        return false;
    else
        return true;
};
exports.isExists = isExists;
var query2Date = function (query) {
    //Query 데이터의 값이 형식에 맞으면 데이터 폼으로 반환 아니면 undefined 반환
    var type = typeof query;
    if (type == "string") {
        var date = Number(query);
        if (date > 19000000 && date < 30000000) {
            return date;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
};
exports.query2Date = query2Date;
