"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise-native");
var commonData_1 = require("../../modules/commonData");
var cheerio_1 = require("cheerio");
//네이버 웹툰
var get_naver_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
    var naver_webtoon_info, naver_comic_url, Sortation, naver_url_package, get_page_count, get_naver_finished_webtoon, get_naver_weekday_webtoon, get_a_naver_webtoon;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                naver_webtoon_info = [];
                naver_comic_url = "https://m.comic.naver.com";
                (function (Sortation) {
                    Sortation[Sortation["weekday"] = 0] = "weekday";
                    Sortation[Sortation["finished"] = 1] = "finished";
                })(Sortation || (Sortation = {}));
                naver_url_package = function (sortation, num) {
                    var target_url;
                    switch (sortation) {
                        case Sortation.weekday:
                            target_url =
                                naver_comic_url + "/webtoon/weekday.nhn?week=" + commonData_1.weekday[num];
                            break;
                        case Sortation.finished:
                            target_url = naver_comic_url + "/webtoon/finish.nhn?page=" + num;
                            break;
                    }
                    return target_url;
                };
                get_page_count = function () {
                    return new Promise(function (resolve, reject) {
                        request(naver_url_package(Sortation.finished, 1), function (err, response, body) {
                            var $ = cheerio_1.load(body);
                            resolve($(".paging_type2").find(".current_pg").find(".total").text());
                        });
                    });
                };
                get_naver_finished_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var a_naver_webtoon_info, page_count, _a, i;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = Number;
                                return [4 /*yield*/, get_page_count()];
                            case 1:
                                page_count = _a.apply(void 0, [_b.sent()]);
                                i = 1;
                                _b.label = 2;
                            case 2:
                                if (!(i <= page_count)) return [3 /*break*/, 5];
                                return [4 /*yield*/, request(naver_url_package(Sortation.finished, i), function (err, response, body) {
                                        var $ = cheerio_1.load(body);
                                        var page_webtoon_count = $(".list_toon.list_finish")
                                            .find(".item")
                                            .find(".info").length;
                                        for (var webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
                                            a_naver_webtoon_info = get_a_naver_webtoon($, ".list_finish", webtoon_num);
                                            naver_webtoon_info.push(a_naver_webtoon_info);
                                        }
                                    })];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 2];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
                get_naver_weekday_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var a_naver_webtoon_info, _loop_1, week_num;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _loop_1 = function (week_num) {
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, request(naver_url_package(Sortation.weekday, week_num), function (err, response, body) {
                                                    var $ = cheerio_1.load(body);
                                                    var page_webtoon_count = $(".list_toon").find(".item").find(".info")
                                                        .length;
                                                    for (var webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
                                                        a_naver_webtoon_info = get_a_naver_webtoon($, "", webtoon_num, week_num);
                                                        naver_webtoon_info.push(a_naver_webtoon_info);
                                                    }
                                                })];
                                            case 1:
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                week_num = 0;
                                _a.label = 1;
                            case 1:
                                if (!(week_num < 7)) return [3 /*break*/, 4];
                                return [5 /*yield**/, _loop_1(week_num)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                week_num++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                get_a_naver_webtoon = function ($, index, webtoon_num, week_num) {
                    var state_value;
                    var weekday_value;
                    if (index == "") {
                        var state_variable_calc = $(".list_toon")
                            .find(".info")
                            .eq(webtoon_num)
                            .find(".detail")
                            .find(".blind")
                            .eq(0)
                            .text();
                        switch (state_variable_calc) {
                            case "휴재":
                                state_value = "휴재";
                                break;
                            case "up":
                                state_value = "UP";
                                break;
                            default:
                                state_value = "";
                                break;
                        }
                        if (week_num != undefined) {
                            weekday_value = week_num;
                        }
                        else {
                            weekday_value = 7;
                        }
                    }
                    else {
                        state_value = "완결";
                        weekday_value = 7;
                    }
                    return {
                        title: $(".list_toon" + index)
                            .find(".info")
                            .eq(webtoon_num)
                            .find(".title")
                            .text(),
                        artist: $(".list_toon" + index)
                            .find(".info")
                            .eq(webtoon_num)
                            .find(".author")
                            .text(),
                        url: naver_comic_url +
                            $(".list_toon" + index)
                                .find("a")
                                .eq(webtoon_num)
                                .attr("href"),
                        img: $(".list_toon" + index)
                            .find(".thumbnail")
                            .eq(webtoon_num)
                            .find("img")
                            .attr("src"),
                        service: "Naver",
                        state: state_value,
                        weekday: weekday_value,
                    };
                };
                return [4 /*yield*/, get_naver_weekday_webtoon()];
            case 1:
                _a.sent();
                return [4 /*yield*/, get_naver_finished_webtoon()];
            case 2:
                _a.sent();
                return [2 /*return*/, naver_webtoon_info];
        }
    });
}); };
exports.default = get_naver_webtoon;
