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
const lodash_1 = require("lodash");
var week;
(function (week) {
    week[week["mon"] = 0] = "mon";
    week[week["tue"] = 1] = "tue";
    week[week["wed"] = 2] = "wed";
    week[week["thu"] = 3] = "thu";
    week[week["fri"] = 4] = "fri";
    week[week["sat"] = 5] = "sat";
    week[week["sun"] = 6] = "sun";
})(week || (week = {}));
function combine_weekWebtoon(weekWebtoon) {
    const combinedWeekWebtoon = [];
    weekWebtoon.forEach((webtoon) => {
        combinedWeekWebtoon.push(...webtoon);
    });
    return combinedWeekWebtoon;
}
class WebtoonController {
    constructor(platform) {
        this.platform = platform;
        this.combined_weekWebtoon = combine_weekWebtoon(this.platform.weekWebtoon);
        this.allWebtoon = this.combined_weekWebtoon.concat(this.platform.finishedWebtoon);
    }
    weekday(day) {
        if (!day)
            return this.combined_weekWebtoon;
        else if (0 <= week[day] && week[day] <= 6)
            return this.platform.weekWebtoon[week[day]];
        else
            return {
                statusCode: 400,
                message: 'Invalid day value',
                error: 'Not Found',
            };
    }
    finished() {
        return this.platform.finishedWebtoon;
    }
    all() {
        return this.allWebtoon;
    }
    test() {
        return this.platform;
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
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebtoonController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebtoonController.prototype, "test", null);
let SearchController = class SearchController {
    constructor(appService) {
        this.appService = appService;
        const platform = this.appService.getAllWebtoon();
        const combined_weekWebtoon = combine_weekWebtoon(platform.weekWebtoon);
        this.allWebtoon = combined_weekWebtoon.concat(platform.finishedWebtoon);
    }
    search(search) {
        if (!search)
            return {
                statusCode: 500,
                message: 'Required request variable does not exist or request variable name is invalid',
                error: 'Error',
            };
        search = search.toLowerCase().replace(/\s/g, '');
        const filteredWebtoon = this.allWebtoon.filter((webtoon) => {
            const str4search = (webtoon.title.toLowerCase() + webtoon.author.toLowerCase()).replace(/\s/g, '');
            return str4search.includes(search);
        });
        if (filteredWebtoon.length === 0)
            return {
                statusCode: 404,
                message: 'No webtoon found',
                error: 'Not Found',
            };
        return (0, lodash_1.uniqBy)(filteredWebtoon, (e) => e.title + e.author).map((webtoon) => {
            delete webtoon.week;
            return webtoon;
        });
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
let NaverController = class NaverController extends WebtoonController {
    constructor(appService) {
        super(appService.webtoon.naver);
        this.appService = appService;
    }
};
NaverController = __decorate([
    (0, common_1.Controller)('naver'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], NaverController);
exports.NaverController = NaverController;
let KakaoController = class KakaoController extends WebtoonController {
    constructor(appService) {
        super(appService.webtoon.kakao);
        this.appService = appService;
    }
};
KakaoController = __decorate([
    (0, common_1.Controller)('kakao'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoController);
exports.KakaoController = KakaoController;
let KakaoPageController = class KakaoPageController extends WebtoonController {
    constructor(appService) {
        super(appService.webtoon.kakaoPage);
        this.appService = appService;
    }
};
KakaoPageController = __decorate([
    (0, common_1.Controller)('kakao-page'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoPageController);
exports.KakaoPageController = KakaoPageController;
let AllPlatformController = class AllPlatformController extends WebtoonController {
    constructor(appService) {
        super(appService.getAllWebtoon());
        this.appService = appService;
    }
};
AllPlatformController = __decorate([
    (0, common_1.Controller)('all'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AllPlatformController);
exports.AllPlatformController = AllPlatformController;
//# sourceMappingURL=app.controller.js.map