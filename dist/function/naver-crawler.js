"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
async function naver_crawler() {
    console.log('naver crawler start');
    const weekWebtoon = await get_weekWebtoon();
    const finishedWebtoon = await get_finishedWebtoon();
    console.log('naver crawler end');
    return weekWebtoon.concat(finishedWebtoon);
}
exports.default = naver_crawler;
const NAVER_WEBTOON_URL = 'https://m.comic.naver.com';
async function get_finishedWebtoon() {
    const result = [];
    const $ = await load_$(NAVER_WEBTOON_URL + '/webtoon/finish.nhn?page=1');
    const PAGE_COUNT_SELECTOR = '#ct > div.section_list_toon > div.paging_type2 > em > span';
    const pageCount = Number($(PAGE_COUNT_SELECTOR).text());
    for (let page = 1; page < pageCount; page++)
        result.push(...(await get_webtoonData('finish', `page=${page}`, 7)));
    return result;
}
async function load_$(url) {
    const html = await axios_1.default.get(url);
    return (0, cheerio_1.load)(html.data);
}
async function get_weekWebtoon() {
    const result = [];
    const weekArr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    await Promise.all(weekArr.map(async (week, weekNum) => {
        result.push(...(await get_webtoonData('weekday', `week=${week}`, weekNum)));
    }));
    return result;
}
async function get_webtoonData(type, query, weeknum) {
    const $ = await load_$(`${NAVER_WEBTOON_URL}/webtoon/${type}.nhn?${query}`);
    const BASE_SELECTOR = '#ct > div.section_list_toon > ul > li > a';
    const base$ = $(BASE_SELECTOR);
    return base$
        .map((index, element) => {
        let isNew = false, isRest = false, isUp = false;
        const isAdult = $(element).find('div.thumbnail > span > span').attr('class') ===
            'badge adult'
            ? true
            : false;
        if (type === 'weekday') {
            const detail$ = $(element).find('div.info > span.detail > span');
            const detailInfo = detail$
                .map((index, element) => $(element).attr('class').replace('bullet ', ''))
                .get();
            isNew = detailInfo.includes('new');
            isRest = detailInfo.includes('break');
            isUp = detailInfo.includes('up');
        }
        const author = $(element)
            .find('.author')
            .text()
            .replace(/, |\ \/ /g, ',');
        return {
            title: $(element).find('.title').text(),
            author: author,
            url: NAVER_WEBTOON_URL + $(element).attr('href'),
            img: $(element).find('div.thumbnail > img').attr('src'),
            service: 'naver',
            week: weeknum,
            additional: {
                new: isNew,
                adult: isAdult,
                rest: isRest,
                up: isUp,
            },
        };
    })
        .get();
}
//# sourceMappingURL=naver-crawler.js.map