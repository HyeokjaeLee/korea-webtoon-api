"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lodash_1 = require("lodash");
function classify_webtoon(webtoonDataArr, weeknum) {
    const kakao_webtoon_url = 'https://webtoon.kakao.com/content/';
    return webtoonDataArr.map((webtoonData) => {
        const { content, additional } = webtoonData;
        const authors = (0, lodash_1.uniqBy)(content.authors, 'name');
        const onlyAuthorIllustrator = authors.filter((author) => author.type === 'AUTHOR' || author.type === 'ILLUSTRATOR');
        const authorsName = onlyAuthorIllustrator.map((author) => author.name);
        return {
            title: content.title,
            author: authorsName.join(','),
            url: `${kakao_webtoon_url + content.seoId}/${content.id}`,
            img: `${content.featuredCharacterImageA}.png`,
            service: 'kakao',
            week: weeknum,
            additional: {
                new: additional.new,
                rest: additional.rest,
                up: additional.up,
                adult: additional.adult,
            },
        };
    });
}
const apiURL = 'https://gateway-kw.kakao.com/section/v1/';
async function get_weekWebtoon(original) {
    const { data } = await axios_1.default.get(`${apiURL}pages/${original}-weekdays`);
    return data.data.sections.map((sections, weeknum) => classify_webtoon(sections.cardGroups[0].cards, weeknum));
}
async function get_finishedWebtoon(placement) {
    const { data } = await axios_1.default.get(`${apiURL}sections?placement=${placement}_completed`);
    return classify_webtoon(data.data[0].cardGroups[0].cards, 7);
}
async function kakao_crawler() {
    console.log('kakao crawler start');
    const result = [];
    const generalWeekWebtoon = await get_weekWebtoon('general');
    const novelWeekWebtoon = await get_weekWebtoon('novel');
    const generalFinishedWebtoon = await get_finishedWebtoon('channel');
    const novelFinishedWebtoon = await get_finishedWebtoon('novel');
    generalWeekWebtoon.forEach((weekWebtoon) => {
        result.push(...weekWebtoon);
    });
    novelWeekWebtoon.forEach((weekWebtoon) => {
        result.push(...weekWebtoon);
    });
    result.push(...generalFinishedWebtoon);
    result.push(...novelFinishedWebtoon);
    console.log('kakao crawler end');
    return result;
}
exports.default = kakao_crawler;
//# sourceMappingURL=kakao-crawler.js.map