"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$2num = void 0;
var $2num = function (string_data) {
    return Number(string_data.replace("$", "").replace(/,/gi, ""));
};
exports.$2num = $2num;
