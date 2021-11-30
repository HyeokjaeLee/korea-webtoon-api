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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllPlatformController = exports.KakaoPageController = exports.KakaoController = exports.NaverController = exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const naver_crawler_1 = require("./function/naver-crawler");
const kakao_crawler_1 = require("./function/kakao-crawler");
const kakaoPage_crawler_1 = require("./function/kakaoPage-crawler");
const fs = require("fs");
const lodash_1 = require("lodash");
let webtoonData = add_combinedData(get_localData());
const ONE_HOUR = 1000 * 60 * 60;
update();
setInterval(() => {
    update();
}, ONE_HOUR);
let SearchController = class SearchController {
    constructor(appService) {
        this.appService = appService;
    }
    search(search) {
        return this.appService.search(webtoonData.all, search);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "search", null);
SearchController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], SearchController);
exports.SearchController = SearchController;
class WebtoonController {
    constructor(appService, platform) {
        this.appService = appService;
        this.platform = platform;
    }
    weekday(day) {
        return this.appService.weekday(webtoonData[this.platform].weekWebtoon, day);
    }
    finished() {
        return webtoonData[this.platform].finishedWebtoon;
    }
    all() {
        return this.appService.all(webtoonData[this.platform]);
    }
}
__decorate([
    (0, common_1.Get)('week'),
    __param(0, (0, common_1.Query)('day')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebtoonController.prototype, "weekday", null);
__decorate([
    (0, common_1.Get)('finished'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebtoonController.prototype, "finished", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebtoonController.prototype, "all", null);
let NaverController = class NaverController extends WebtoonController {
    constructor(_appService) {
        super(_appService, 'naver');
        this._appService = _appService;
    }
};
NaverController = __decorate([
    (0, common_1.Controller)('naver'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], NaverController);
exports.NaverController = NaverController;
let KakaoController = class KakaoController extends WebtoonController {
    constructor(_appService) {
        super(_appService, 'kakao');
        this._appService = _appService;
    }
};
KakaoController = __decorate([
    (0, common_1.Controller)('kakao'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoController);
exports.KakaoController = KakaoController;
let KakaoPageController = class KakaoPageController extends WebtoonController {
    constructor(_appService) {
        super(_appService, 'kakaoPage');
        this._appService = _appService;
    }
};
KakaoPageController = __decorate([
    (0, common_1.Controller)('kakao-page'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoPageController);
exports.KakaoPageController = KakaoPageController;
let AllPlatformController = class AllPlatformController extends WebtoonController {
    constructor(_appService) {
        super(_appService, 'all');
        this._appService = _appService;
    }
};
AllPlatformController = __decorate([
    (0, common_1.Controller)('all'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AllPlatformController);
exports.AllPlatformController = AllPlatformController;
function get_localData() {
    const readJSON = (platform) => JSON.parse(fs.readFileSync(`data/${platform}.json`, 'utf8'));
    return {
        naver: readJSON('naver'),
        kakao: readJSON('kakao'),
        kakaoPage: readJSON('kakaoPage'),
    };
}
async function update() {
    const externalData = await get_externalData();
    const platformList = Object.keys(externalData);
    platformList.forEach((key) => {
        fs.writeFileSync(`data/${key}.json`, JSON.stringify(externalData[key]));
        console.log(`${key}.json save`);
    });
    webtoonData = add_combinedData(externalData);
    console.log(`update end (${new Date()})`);
}
async function get_externalData() {
    return {
        naver: await (0, naver_crawler_1.default)(),
        kakao: await (0, kakao_crawler_1.default)(),
        kakaoPage: await (0, kakaoPage_crawler_1.default)(),
    };
}
function add_combinedData(platformObj) {
    const platformList = Object.keys(platformObj);
    let weekWebtoonArr = [[], [], [], [], [], [], []];
    platformList.forEach((platform) => {
        platformObj[platform].weekWebtoon.forEach((_weekWebtoon, weekNum) => {
            weekWebtoonArr[weekNum].push(..._weekWebtoon);
        });
    });
    weekWebtoonArr = weekWebtoonArr.map((weekWebtoon) => (0, lodash_1.sortBy)(weekWebtoon, 'title'));
    let finishedWebtoon = [];
    platformList.forEach((platform) => {
        finishedWebtoon.push(...platformObj[platform].finishedWebtoon);
    });
    finishedWebtoon = (0, lodash_1.sortBy)(finishedWebtoon, 'title');
    const all = {
        weekWebtoon: weekWebtoonArr,
        finishedWebtoon,
    };
    platformObj.all = all;
    return platformObj;
}
//# sourceMappingURL=app.controller.js.map