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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.naver_crawler = void 0;
const base_data_1 = require("../data/base-data");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const cheerio_1 = require("cheerio");
const naver_webtoon_url = "https://m.comic.naver.com";
const naver_crawler = () => __awaiter(void 0, void 0, void 0, function* () { return (yield get_finished_webtoon()).concat(yield get_weekly_webtoon()); });
exports.naver_crawler = naver_crawler;
function get_page_count() {
    return new Promise(function (resolve, reject) {
        (0, request_promise_native_1.default)(naver_webtoon_url + "/webtoon/finish.nhn?page=1", (err, response, body) => {
            let $ = (0, cheerio_1.load)(body);
            resolve(Number($("#ct > div.section_list_toon > div.paging_type2 > em > span").text()));
        });
    });
}
function get_webtoon_of_one_page(type, query_type, week_num) {
    return __awaiter(this, void 0, void 0, function* () {
        const a_page_webtoon_info = [];
        yield (0, request_promise_native_1.default)(`${naver_webtoon_url}/webtoon/${type}.nhn?${query_type}`, (err, response, body) => {
            const $ = (0, cheerio_1.load)(body);
            const list_selector = $("#ct > div.section_list_toon > ul > li > a");
            list_selector.map((index, element) => {
                const state_type = $(element).find("div.info > span.detail > span > span").eq(0).text();
                const state = state_type == "휴재"
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
        });
        return a_page_webtoon_info;
    });
}
function get_finished_webtoon() {
    return __awaiter(this, void 0, void 0, function* () {
        const page_count = yield get_page_count();
        let webtoon_arr = [];
        for (let page_index = 1; page_index < page_count; page_index++) {
            webtoon_arr = webtoon_arr.concat(yield get_webtoon_of_one_page("finish", `page=${page_index}`, 7));
        }
        return webtoon_arr;
    });
}
function get_weekly_webtoon() {
    return __awaiter(this, void 0, void 0, function* () {
        const weeklyWebtoonArr = base_data_1.weekday.map((_weekday, _week_num) => get_webtoon_of_one_page("weekday", `week=${_weekday}`, _week_num));
        yield Promise.all(weeklyWebtoonArr);
        const result = [
            ...(yield weeklyWebtoonArr[0]),
            ...(yield weeklyWebtoonArr[1]),
            ...(yield weeklyWebtoonArr[2]),
            ...(yield weeklyWebtoonArr[3]),
            ...(yield weeklyWebtoonArr[4]),
            ...(yield weeklyWebtoonArr[5]),
            ...(yield weeklyWebtoonArr[6]),
        ];
        return result;
    });
}
//# sourceMappingURL=naver-crawler.js.map