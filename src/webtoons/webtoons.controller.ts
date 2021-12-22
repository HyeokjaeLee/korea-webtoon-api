import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { Webtoon } from './schemas/webtoon.schema';
import kakao_crawler from 'functions/kakao-crawler';
import naver_crawler from 'functions/naver-crawler';
import kakaoPage_crawler from 'functions/kakaoPage-crawler';

@Controller('cats')
export class WebtoonsController {
  constructor(private readonly webtoonsService: WebtoonsService) {
    this.updater();
    const ONE_HOUR = 1000 * 60 * 60;
    setInterval(() => {
      this.updater();
    }, ONE_HOUR);
  }

  @Post()
  async create(@Body() createWebtoonDto: WebtoonObject.Dto) {
    await this.webtoonsService.create(createWebtoonDto);
  }

  @Get()
  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsService.findAll();
  }

  async updater() {
    const ID_list_DB = [];
    const ID_list_cralwer = [];
    const webtoonsDB_original = await this.webtoonsService.findAll();
    const webtoonsDB_changed = await this.webtoonsService.findAll();
    webtoonsDB_changed.forEach((webtoon) => {
      webtoon.week = [];
      ID_list_DB.push(webtoon._id);
    });

    const WebtoonsArr = await Promise.all([
      naver_crawler(),
      kakao_crawler(),
      kakaoPage_crawler(),
    ]);

    WebtoonsArr.forEach((webtoons) => {
      webtoons.forEach((webtoon) => {
        const { title, author, service } = webtoon;
        const _id = `${title}__${author}__${service}`;
        ID_list_cralwer.push(_id);
        const webtoonIndex = ID_list_DB.indexOf(_id);
        const isExist = webtoonIndex !== -1;
        if (isExist) {
          const existingWebtoon = webtoonsDB_changed[webtoonIndex];
          existingWebtoon.additional = webtoon.additional;
          existingWebtoon.week.push(webtoon.week);
        } else {
          const newWebtoon: Webtoon = { ...webtoon, week: [webtoon.week], _id };
          ID_list_DB.push(_id);
          webtoonsDB_changed.push(newWebtoon);
        }
      });
    });
    const newWebtoons: Webtoon[] = [];
    const changedWebtoons: Webtoon[] = [];
    webtoonsDB_changed.forEach((webtoon, index) => {
      webtoon.week.sort();
      const isNew = !webtoonsDB_original[index];
      isNew && newWebtoons.push(webtoon);
      if (!isNew) {
        const isChanged =
          JSON.stringify(webtoon) !==
          JSON.stringify(webtoonsDB_original[index]);
        isChanged && changedWebtoons.push(webtoon);
      }
    });
    newWebtoons.forEach(
      async (webtoon) => await this.webtoonsService.create(webtoon),
    );
    changedWebtoons.forEach(
      async (webtoon) =>
        await this.webtoonsService.update(webtoon._id, webtoon),
    );
    const removedIDs = ID_list_DB.filter((id) => !ID_list_cralwer.includes(id));
    removedIDs.forEach(async (id) => await this.webtoonsService.delete(id));
    console.log(
      `updated:${changedWebtoons.length}, new:${newWebtoons.length}, removed:${
        removedIDs.length
      } (${new Date()})`,
    );
  }
}
