"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
const load_$ = async (url) => {
    const html = await axios_1.default.get(url);
    return (0, cheerio_1.load)(html.data);
};
const naver_webtoon_url = 'https://m.comic.naver.com';
async function get_webtoonData(type, query, weeknum) {
    const $ = await load_$(`${naver_webtoon_url}/webtoon/${type}.nhn?${query}`);
    const baseSelector = $('#ct > div.section_list_toon > ul > li > a');
    return baseSelector
        .map((index, element) => {
        const isAdult = $(element).find('div.thumbnail > span > span').attr('class') ===
            'badge adult'
            ? true
            : false;
        let isNew = false;
        let isRest = false;
        let isUp = false;
        if (type === 'weekday') {
            const detailSelector = $(element).find('div.info > span.detail > span');
            const detailInfo = detailSelector
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
            url: naver_webtoon_url + $(element).attr('href'),
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
async function get_weekWebtoon() {
    const weekArr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return await Promise.all(weekArr.map(async (week, weeknum) => await get_webtoonData('weekday', `week=${week}`, weeknum)));
}
async function get_finishedWebtoon() {
    let finishedWebtoon = [];
    const $ = await load_$(naver_webtoon_url + '/webtoon/finish.nhn?page=1');
    const pageCount = Number($('#ct > div.section_list_toon > div.paging_type2 > em > span').text());
    for (let page = 1; page < pageCount; page++) {
        finishedWebtoon.push(...(await get_webtoonData('finish', `page=${page}`, 7)));
    }
    return finishedWebtoon;
}
async function naver_crawler() {
    console.log('naver crawler start');
    const weekWebtoon = await get_weekWebtoon();
    const finishedWebtoon = await get_finishedWebtoon();
    console.log('naver crawler end');
    return { weekWebtoon, finishedWebtoon };
}
exports.default = naver_crawler;
//# sourceMappingURL=naver-crawler.js.map