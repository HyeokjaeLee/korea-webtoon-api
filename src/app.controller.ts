import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import naver_crawler from 'function/naver-crawler';
import kakao_crawler from 'function/kakao-crawler';
import kakaoPage_crawler from 'function/kakaoPage-crawler';
import * as fs from 'fs';

let webtoonData = add_combinedData(get_localData());

const ONE_HOUR = 1000 * 60 * 60;
update();
setInterval(() => {
  update();
}, ONE_HOUR);

@Controller()
export class SearchController {
  constructor(private readonly appService: AppService) {}
  @Get()
  search(@Query('search') search: string) {
    return this.appService.search(webtoonData.all, search);
  }
}

class WebtoonController {
  constructor(private readonly appService: AppService, platform: string) {
    this.platform = platform;
  }
  platform: string;
  @Get('week')
  weekday(@Query('day') day: string) {
    return this.appService.weekday(webtoonData[this.platform].weekWebtoon, day);
  }

  @Get('finished')
  finished() {
    return webtoonData[this.platform].finishedWebtoon;
  }

  @Get('all')
  all() {
    return this.appService.all(webtoonData[this.platform]);
  }
}

@Controller('naver')
export class NaverController extends WebtoonController {
  constructor(private readonly _appService: AppService) {
    super(_appService, 'naver');
  }
}

@Controller('kakao')
export class KakaoController extends WebtoonController {
  constructor(private readonly _appService: AppService) {
    super(_appService, 'kakao');
  }
}

@Controller('kakao-page')
export class KakaoPageController extends WebtoonController {
  constructor(private readonly _appService: AppService) {
    super(_appService, 'kakaoPage');
  }
}

@Controller('all')
export class AllPlatformController extends WebtoonController {
  constructor(private readonly _appService: AppService) {
    super(_appService, 'all');
  }
}

function get_localData() {
  const readJSON = (platform: string): PlatformObject =>
    JSON.parse(fs.readFileSync(`data/${platform}.json`, 'utf8'));
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
    naver: await naver_crawler(),
    kakao: await kakao_crawler(),
    kakaoPage: await kakaoPage_crawler(),
  };
}

function add_combinedData(platformObj: {
  naver: PlatformObject;
  kakao: PlatformObject;
  kakaoPage: PlatformObject;
  all?: PlatformObject;
}) {
  const platformList = Object.keys(platformObj);
  let weekWebtoonArr: Webtoon[][] = [[], [], [], [], [], [], []];
  platformList.forEach((platform) => {
    platformObj[platform].weekWebtoon.forEach(
      (_weekWebtoon: Webtoon[], weekNum: number) => {
        weekWebtoonArr[weekNum].push(..._weekWebtoon);
      },
    );
  });
  let finishedWebtoon: Webtoon[] = [];
  platformList.forEach((platform) => {
    finishedWebtoon.push(...platformObj[platform].finishedWebtoon);
  });
  const all: PlatformObject = {
    weekWebtoon: weekWebtoonArr,
    finishedWebtoon,
  };
  platformObj.all = all;
  return platformObj as {
    naver: PlatformObject;
    kakao: PlatformObject;
    kakaoPage: PlatformObject;
    all: PlatformObject;
  };
}
