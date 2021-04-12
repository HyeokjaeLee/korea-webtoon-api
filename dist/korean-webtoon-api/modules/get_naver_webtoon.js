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
exports.get_naver_webtoon = void 0;
var commonData_1 = require("../../modules/commonData");
//네이버 웹툰
var request = require("request-promise-native");
var cheerio_1 = require("cheerio");
var naver_webtoon_url = "https://m.comic.naver.com";
var get_a_page_webtoon = function (type, query_type, week_num) { return __awaiter(void 0, void 0, void 0, function () {
    var a_page_webtoon_info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                a_page_webtoon_info = [];
                return [4 /*yield*/, request(naver_webtoon_url + "/webtoon/" + type + ".nhn?" + query_type, function (err, response, body) {
                        var $ = cheerio_1.load(body);
                        var list_selector = $("#ct > div.section_list_toon > ul > li > a");
                        list_selector.map(function (index, element) {
                            var state_type = $(element)
                                .find("div.info > span.detail > span > span")
                                .eq(0)
                                .text();
                            var state = state_type == "휴재"
                                ? "휴재"
                                : state_type == "up"
                                    ? "UP"
                                    : type == "finish"
                                        ? "완결"
                                        : "";
                            a_page_webtoon_info.push({
                                title: $(element).find(".title").text(),
                                artist: $(element).find(".author").text(),
                                url: naver_webtoon_url + $(element).attr("href"),
                                img: $(element).find("div.thumbnail > img").attr("src"),
                                service: "naver",
                                state: state,
                                weekday: week_num,
                            });
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, a_page_webtoon_info];
        }
    });
}); };
var get_page_count = function () {
    return new Promise(function (resolve, reject) {
        request(naver_webtoon_url + "/webtoon/finish.nhn?page=1", function (err, response, body) {
            var $ = cheerio_1.load(body);
            resolve(Number($("#ct > div.section_list_toon > div.paging_type2 > em > span").text()));
        });
    });
};
var get_finish_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
    var page_count, webtoon_arr, page_index, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, get_page_count()];
            case 1:
                page_count = _c.sent();
                webtoon_arr = [];
                page_index = 1;
                _c.label = 2;
            case 2:
                if (!(page_index < page_count)) return [3 /*break*/, 5];
                _b = (_a = webtoon_arr).concat;
                return [4 /*yield*/, get_a_page_webtoon("finish", "page=" + page_index, 7)];
            case 3:
                webtoon_arr = _b.apply(_a, [_c.sent()]);
                _c.label = 4;
            case 4:
                page_index++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, webtoon_arr];
        }
    });
}); };
var get_weekly_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
    var webtoon_arr, week_num, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                webtoon_arr = [];
                week_num = 0;
                _c.label = 1;
            case 1:
                if (!(week_num < 7)) return [3 /*break*/, 4];
                _b = (_a = webtoon_arr).concat;
                return [4 /*yield*/, get_a_page_webtoon("weekday", "week=" + commonData_1.weekday[week_num], week_num)];
            case 2:
                webtoon_arr = _b.apply(_a, [_c.sent()]);
                _c.label = 3;
            case 3:
                week_num++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, webtoon_arr];
        }
    });
}); };
var get_naver_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, get_finish_webtoon()];
        case 1:
            _b = (_a = (_c.sent())).concat;
            return [4 /*yield*/, get_weekly_webtoon()];
        case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
exports.get_naver_webtoon = get_naver_webtoon;
