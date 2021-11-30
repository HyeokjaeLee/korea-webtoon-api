"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
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
let AppService = class AppService {
    combine_weekWebtoon(weekWebtoon) {
        const combinedWeekWebtoon = [];
        weekWebtoon.forEach((webtoon) => {
            combinedWeekWebtoon.push(...webtoon);
        });
        return combinedWeekWebtoon;
    }
    weekday(weekWebtoon, day) {
        if (!day)
            return this.combine_weekWebtoon(weekWebtoon);
        if (0 <= week[day] && week[day] <= 6)
            return weekWebtoon[week[day]];
        else
            return {
                statusCode: 400,
                message: 'Invalid day value',
                error: 'Not Found',
            };
    }
    all(platformObject) {
        const combinedWeekWebtoon = this.combine_weekWebtoon(platformObject.weekWebtoon);
        return platformObject.finishedWebtoon.concat(combinedWeekWebtoon);
    }
    search(platformObject, search) {
        const searchResult = [];
        const allWebtoon = this.all(platformObject);
        if (!search)
            return {
                statusCode: 500,
                message: 'Required request variable does not exist or request variable name is invalid',
                error: 'Error',
            };
        const filteredWebtoon = allWebtoon.filter((webtoon) => {
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
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map