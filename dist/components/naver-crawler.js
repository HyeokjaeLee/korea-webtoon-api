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
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const cheerio_1 = require("cheerio");
const naver_webtoon_url = "https://m.comic.naver.com";
const weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const fs_1 = __importDefault(require("fs"));
const naver_crawler = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Naver-Webtoon crawler has started(${new Date()})`);
    const weeklyWebtoonData = yield get_weekly_webtoon();
    const finishedWebtoonData = yield get_finished_webtoon();
    console.log("Naver-Webtoon 정보 크롤링 완료");
    fs_1.default.writeFileSync("../data/naver-weekly-webtoon.json", JSON.stringify(weeklyWebtoonData));
    fs_1.default.writeFileSync("../data/naver-finished-webtoon.json", JSON.stringify(finishedWebtoonData));
    console.log("Naver-Webtoon 정보 저장 완료");
    return { weeklyWebtoonData, finishedWebtoonData };
});
exports.naver_crawler = naver_crawler;
(0, exports.naver_crawler)();
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
                const adult = $(element).find("div.thumbnail > span > span").attr("class") === "badge adult"
                    ? true
                    : false;
                a_page_webtoon_info.push({
                    title: $(element).find(".title").text(),
                    artist: $(element).find(".author").text(),
                    url: naver_webtoon_url + $(element).attr("href"),
                    img: $(element).find("div.thumbnail > img").attr("src"),
                    service: "naver",
                    weekday: week_num,
                    adult: adult,
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
        const weeklyWebtoonArr = weekday.map((_weekday, _week_num) => get_webtoon_of_one_page("weekday", `week=${_weekday}`, _week_num));
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