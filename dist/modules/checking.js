"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmpty = exports.checkUpdates = void 0;
var checkUpdates = function (api_name, data) {
    console.log("\n------------------------" + new Date() + "------------------------\n");
    if (data != undefined) {
        console.log(api_name + " data has been updated successfully.");
    }
    else {
        console.log(api_name + " data update failed.");
    }
};
exports.checkUpdates = checkUpdates;
var checkEmpty = function (data) {
    if (typeof data == undefined || data == null || data == "")
        return false;
    else
        return true;
};
exports.checkEmpty = checkEmpty;
