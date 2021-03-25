"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise-native");
var cheerio_1 = require("cheerio");
var FormatConversion_1 = require("../../modules/FormatConversion");
var $;
var $2num = function (string_data) { return Number(string_data.replace("$", "").replace(/,/gi, "")); };
var get_buy_data = function (url) {
    return new Promise(function (resolve) {
        request(url, function (err, response, body) {
            $ = cheerio_1.load(body);
            var data = [];
            var column_count = $(".tinytable").find("tbody").find("tr").length;
            for (var i = 0; i < column_count; i++) {
                data.push(get_a_data(i));
            }
            resolve(data);
        });
    });
};
var get_a_data_part = function (column_num, row_num) {
    return $(".tinytable").find("tbody").find("tr").eq(column_num).find("td").eq(row_num).text();
};
var get_a_data = function (column_num) { return ({
    ticker: get_a_data_part(column_num, 3).replace(/ /gi, ""),
    trade_date: FormatConversion_1.string2date(get_a_data_part(column_num, 2)),
    company_name: get_a_data_part(column_num, 4),
    insider_name: get_a_data_part(column_num, 5),
    price: $2num(get_a_data_part(column_num, 8)),
    qty: $2num(get_a_data_part(column_num, 9)),
    owned: $2num(get_a_data_part(column_num, 10)),
    value: $2num(get_a_data_part(column_num, 12)),
}); };
exports.default = get_buy_data;
