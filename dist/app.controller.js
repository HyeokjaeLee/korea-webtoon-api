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
exports.RootController = exports.KakaoPageController = exports.KakaoController = exports.NaverController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
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
class WebtoonController {
    combine_weekWebtoon() {
        const combinedWeekWebtoon = [];
        for (let i = 0; i < 7; i++) {
            combinedWeekWebtoon.push(...this.platform.weekWebtoon[i]);
        }
        return combinedWeekWebtoon;
    }
    weekday(day) {
        console.log(week[day]);
        if (!day)
            return this.combine_weekWebtoon();
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
        return this.combine_weekWebtoon().concat(this.finished());
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
let NaverController = class NaverController extends WebtoonController {
    constructor(appService) {
        super();
        this.appService = appService;
        this.platform = this.appService.webtoon.naver;
    }
};
NaverController = __decorate([
    (0, common_1.Controller)('naver'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], NaverController);
exports.NaverController = NaverController;
let KakaoController = class KakaoController extends WebtoonController {
    constructor(appService) {
        super();
        this.appService = appService;
        this.platform = this.appService.webtoon.kakao;
    }
};
KakaoController = __decorate([
    (0, common_1.Controller)('kakao'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoController);
exports.KakaoController = KakaoController;
let KakaoPageController = class KakaoPageController extends WebtoonController {
    constructor(appService) {
        super();
        this.appService = appService;
        this.platform = this.appService.webtoon.kakaoPage;
    }
};
KakaoPageController = __decorate([
    (0, common_1.Controller)('kakao-page'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], KakaoPageController);
exports.KakaoPageController = KakaoPageController;
let RootController = class RootController extends WebtoonController {
    constructor(appService) {
        super();
        this.appService = appService;
        this.platform = this.appService.getAllWebtoon();
    }
};
RootController = __decorate([
    (0, common_1.Controller)('all'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], RootController);
exports.RootController = RootController;
//# sourceMappingURL=app.controller.js.map