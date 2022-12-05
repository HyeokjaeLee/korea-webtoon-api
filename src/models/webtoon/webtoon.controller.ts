import { Controller, Get, Query } from '@nestjs/common';
import { WebtoonService } from './webtoon.service';
import type { LastUpdateInfo } from '../../types';
import { consoleWithTime } from 'utils';
import { standardizeChars } from '../../utils';

@Controller()
export class WebtoonController {
  constructor(private readonly webtoonService: WebtoonService) {
    this.webtoonService.getWebtoonsByDatabase().then((webtoonsOfDatabase) => {
      for (const { service } of webtoonsOfDatabase) {
        this.lastUpdateInfo.totalWebtoonCount++;
        switch (service) {
          case 'naver':
            this.lastUpdateInfo.naverWebtoonCount++;
            break;
          case 'kakao':
            this.lastUpdateInfo.kakaoWebtoonCount++;
            break;
          case 'kakaoPage':
            this.lastUpdateInfo.kakaoPageWebtoonCount++;
            break;
        }
      }
    });
    const ONE_HOUR = 1000 * 60 * 60;
    const updateWebtoons = async () => {
      try {
        this.lastUpdateInfo = await this.webtoonService.updateWebtoons();
      } catch {
        consoleWithTime('DB 업데이트 실패');
      }
    };

    updateWebtoons();
    setInterval(updateWebtoons, ONE_HOUR);
  }
  private lastUpdateInfo: LastUpdateInfo = {
    lastUpdate: null,
    totalWebtoonCount: 0,
    naverWebtoonCount: 0,
    kakaoWebtoonCount: 0,
    kakaoPageWebtoonCount: 0,
    updatedWebtoonCount: 0,
    createdWebtoonCount: 0,
  };

  @Get()
  async getWebtoons(
    @Query(`page`) page = 0,
    @Query(`perPage`) perPage = 10,
    @Query(`service`) service: string,
    @Query(`updateDay`) updateDay: string,
  ) {
    const { lastUpdateInfo } = this;
    const totalWebtoonCountOfService: number =
      {
        naver: lastUpdateInfo.naverWebtoonCount,
        kakao: lastUpdateInfo.kakaoWebtoonCount,
        kakaoPage: lastUpdateInfo.kakaoPageWebtoonCount,
      }[service] ?? lastUpdateInfo.totalWebtoonCount;

    const webtoons = await this.webtoonService.getLimitedWebtoonsByDatabase(
      page,
      perPage,
      service,
      updateDay,
    );

    return {
      ...lastUpdateInfo,
      webtoons,
    };
  }

  @Get('search')
  async search(@Query(`keyword`) keyword: string) {
    const standardizedKeyword = standardizeChars(keyword);
    if (standardizedKeyword.length < 2) {
      return { ...this.lastUpdateInfo, webtoons: [] };
    }

    const webtoons = await this.webtoonService.getWebtoonsByKeyword(
      standardizedKeyword,
    );

    return {
      ...this.lastUpdateInfo,
      webtoons,
    };
  }
}
