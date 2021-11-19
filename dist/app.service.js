"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const naver_crawler_1 = require("./function/naver-crawler");
const kakao_crawler_1 = require("./function/kakao-crawler");
const kakaoPage_crawler_1 = require("./function/kakaoPage-crawler");
const fs = require("fs");
const readJSON = (platform) => JSON.parse(fs.readFileSync(`data/${platform}.json`, 'utf8'));
let AppService = class AppService {
    constructor() {
        this.webtoon = {
            naver: readJSON('naver'),
            kakao: readJSON('kakao'),
            kakaoPage: readJSON('kakaoPage'),
        };
        this.platformList = Object.keys(this.webtoon);
        this.update_data();
        const ONE_HOUR = 1000 * 60 * 60;
        setInterval(() => {
            this.update_data();
        }, ONE_HOUR);
    }
    async update_data() {
        console.log(`update start (${new Date()})`);
        this.webtoon.naver = await (0, naver_crawler_1.default)();
        this.webtoon.kakao = await (0, kakao_crawler_1.default)();
        this.webtoon.kakaoPage = await (0, kakaoPage_crawler_1.default)();
        this.platformList.forEach((key) => {
            fs.writeFileSync(`data/${key}.json`, JSON.stringify(this.webtoon[key]));
            console.log(`${key}.json save`);
        });
        console.log(`update end (${new Date()})`);
    }
    getAllWebtoon() {
        const weekWebtoon = [];
        for (let i = 0; i < 7; i++) {
            const oneDayWebtoon = [];
            this.platformList.forEach((platform) => {
                oneDayWebtoon.push(...this.webtoon[platform].weekWebtoon[i]);
            });
            weekWebtoon.push(oneDayWebtoon);
        }
        const finishedWebtoon = [];
        this.platformList.forEach((platform) => {
            finishedWebtoon.push(...this.webtoon[platform].finishedWebtoon);
        });
        return {
            weekWebtoon,
            finishedWebtoon,
        };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map