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
exports.kakao_crawler = void 0;
const cheerio_1 = require("cheerio");
const puppeteer_1 = __importDefault(require("puppeteer"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const fs_1 = __importDefault(require("fs"));
const kakako_webtoon_url = "https://webtoon.kakao.com";
const originalNovel = "/original-novel";
const originalWebtoon = "/original-webtoon";
const finished = "?tab=complete";
const crawler_delay = 3500;
const kakao_crawler = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Kakao-Webtoon crawler has started(${new Date()})`);
    const browser = yield puppeteer_1.default.launch();
    const progress = {
        now: 0,
        total: 0,
    };
    const progress_log = () => {
        progress.now++;
        console.log(`Kakao-Webtoon 크롤링 진행도(${((progress.total - progress.now + 1) * crawler_delay) / 1000}초 예상): ${progress.now} / ${progress.total}`);
    };
    // 실행 코드
    {
        const weeklyWebtoonURLs = yield get_weeklyURL(originalWebtoon);
        const weeklyNovelURLs = yield get_weeklyURL(originalNovel);
        const finishedWebtoonURLs = yield get_finishedURL(originalWebtoon + finished);
        const finishedNovelURLs = yield get_finishedURL(originalNovel + finished);
        const weeklyURLs = [
            ...weeklyWebtoonURLs.commonDataList,
            ...(yield get_uncommonURL(originalWebtoon, weeklyWebtoonURLs.uncommonDataList)),
            ...weeklyNovelURLs.commonDataList,
            ...(yield get_uncommonURL(originalNovel, weeklyNovelURLs.uncommonDataList)),
        ];
        browser.close();
        const finishedURLs = [...finishedWebtoonURLs, ...finishedNovelURLs];
        progress.total = weeklyURLs.length + finishedURLs.length;
        console.log("Kakao-Webtoon URL 크롤링 완료");
        const weeklyWebtoonData = yield Promise.all(weeklyURLs.map((weeklyURL, index) => __awaiter(void 0, void 0, void 0, function* () { return yield get_a_webtoonData(weeklyURL.url, weeklyURL.weekday, index); })));
        const finishedWebtoonData = yield Promise.all(finishedURLs.map((finishedURL, index) => __awaiter(void 0, void 0, void 0, function* () { return yield get_a_webtoonData(kakako_webtoon_url + finishedURL, 7, index); })));
        console.log("Kakao-Webtoon 정보 크롤링 완료");
        fs_1.default.writeFileSync("../data/kakao-weekly-webtoon.json", JSON.stringify(weeklyWebtoonData));
        fs_1.default.writeFileSync("../data/kakao-finished-webtoon.json", JSON.stringify(finishedWebtoonData));
        console.log("Kakao-Webtoon 정보 저장 완료");
        return {
            weeklyWebtoonData,
            finishedWebtoonData,
        };
    }
    //함수 선언 부분
    function get_a_webtoonData(url, weekday, index) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => {
                progress_log();
                (0, request_promise_native_1.default)(encodeURI(url), (err, response, body) => {
                    var _a, _b;
                    const $ = (0, cheerio_1.load)(body);
                    let artist = $("#root > main > div > div.page.color_bg_black__2MXm7.activePage > div > div.Content_homeWrapper__2CMgX.common_positionRelative__2kMrZ > div.Content_metaWrapper__3srNJ > div.Content_contentMainWrapper__3AlhK.Content_current__2yPD8 > div.spacing_pb_28__VqvVT.spacing_pt_96__184F4 > div.common_positionRelative__2kMrZ.spacing_mx_a__2yxXH.spacing_my_0__1f7t6.MaxWidth_maxWidth__2Qvbl > div.Meta_meta__1HmBY.spacing_mx_20__17RDr.spacing_pt_16__zSxeh > div > p.Text_default__HZL19.textVariant_s13_regular_white__1-AxN.SingleText_singleText__3htPa.spacing_mt_minus_3__3ZjH1.opacity_opacity85__gH87s.lineHeight_lh_21__1MiQ7.Meta_author__1VKLY").text();
                    const get_metaData = (name) => $(`head > meta[name=${name}]`).attr("content");
                    let title = get_metaData("og:title");
                    let adult = false;
                    if (!title || !artist) {
                        const metaData = (_a = get_metaData("keywords")) === null || _a === void 0 ? void 0 : _a.split(", ");
                        title = metaData === null || metaData === void 0 ? void 0 : metaData[0];
                        artist = (_b = metaData === null || metaData === void 0 ? void 0 : metaData.slice(1, -1)) === null || _b === void 0 ? void 0 : _b.join(", ");
                        adult = true;
                    }
                    const webtoonData = {
                        title: title,
                        artist: artist,
                        url: encodeURI(url),
                        img: get_metaData("og:image"),
                        service: "kakao",
                        weekday: weekday,
                        adult: adult,
                    };
                    console.log(webtoonData);
                    resolve(webtoonData);
                });
            }, index * crawler_delay);
        }));
    }
    function get_finishedURL(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            yield page.goto(kakako_webtoon_url + endpoint);
            yield page.waitForSelector(".ParallaxItem_layerFront__3diPa");
            let i = 1;
            const selector = (index) => `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div.ParallaxContainer_parallaxContainer__1nXb9.ParallaxContainer_vertical__3CiC8.swiper-scroll-perf > div > div.common_widthFull__1hw6a.common_heightFull__3OHiU.common_positionRelative__2kMrZ > div.spacing_mx_minus_1__17S2G.CompleteContentTable_completeCardList__eVAA- > div:nth-child(${i})`;
            try {
                while (true) {
                    yield page.waitForSelector(selector(i), {
                        timeout: 1000,
                    });
                    yield page.click(selector(i), {
                        button: "right",
                    });
                    i++;
                }
            }
            catch (e) {
                const $ = (0, cheerio_1.load)(yield page.content());
                const urlList = $.html().match(/\/content.{1,20}\/\d+/g);
                page.close();
                return urlList;
            }
        });
    }
    function get_weeklyURL(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            yield page.goto(kakako_webtoon_url + endpoint);
            yield page.waitForSelector(".Masonry_masonry__38RyV");
            const $ = (0, cheerio_1.load)(yield page.content());
            const commonDataList = [];
            const uncommonDataList = [];
            const webtoon_container_by_index = (index) => `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div > div > div > div:nth-child(${index}) > div.Masonry_masonry__38RyV > div`;
            for (let weekIndex = 0; weekIndex <= 6; weekIndex++) {
                const webtoonContainerSelector = webtoon_container_by_index(weekIndex + 1);
                const webtoonContainer = $(webtoonContainerSelector);
                webtoonContainer.each((index, element) => {
                    const crawled_url = $(element).find("div > div > div > div > a").attr("href");
                    if (!!crawled_url) {
                        crawled_url === "#none"
                            ? uncommonDataList.push({
                                weekday: weekIndex,
                                selector: `${webtoonContainerSelector}:nth-child(${index + 1}) > div > div > div`,
                            })
                            : commonDataList.push({
                                weekday: weekIndex,
                                url: kakako_webtoon_url + crawled_url,
                            });
                    }
                });
            }
            return {
                commonDataList,
                uncommonDataList,
            };
        });
    }
    function get_uncommonURL(endpoint, uncommonDataList) {
        return __awaiter(this, void 0, void 0, function* () {
            const get_a_uncommonURL = (selector) => __awaiter(this, void 0, void 0, function* () {
                const page = yield browser.newPage();
                yield page.goto(kakako_webtoon_url + endpoint);
                yield page.waitForSelector(selector);
                try {
                    //한번에 클릭이 안되는 경우가 있음
                    while (true) {
                        yield page.click(selector);
                    }
                }
                catch (e) {
                    const url = page.url();
                    yield page.close();
                    return url;
                }
            });
            const uncommonURL = uncommonDataList.map((uncommonData, index) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        resolve({
                            weekday: uncommonData.weekday,
                            url: yield get_a_uncommonURL(uncommonData.selector),
                        });
                    }), index * crawler_delay);
                });
            }));
            return yield Promise.all(uncommonURL);
        });
    }
});
exports.kakao_crawler = kakao_crawler;
(0, exports.kakao_crawler)();
//# sourceMappingURL=kakao-crawler.js.map