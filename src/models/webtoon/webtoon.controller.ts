import { Controller, Get, Query } from '@nestjs/common';
import { WebtoonService } from './webtoon.service';
import type { LastUpdateInfo } from '../../types';
import { consoleWithTime } from 'utils';

@Controller()
export class WebtoonController {
  constructor(private readonly webtoonService: WebtoonService) {
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
    totalWebtoonCount: null,
    naverWebtoonCount: null,
    kakaoWebtoonCount: null,
    kakaoPageWebtoonCount: null,
    updatedWebtoonCount: 0,
    createdWebtoonCount: 0,
  };

  @Get()
  async getWebtoons(
    @Query(`page`) page = 0,
    @Query(`perPage`) perPage = 10,
    @Query(`service`) service = 'all',
  ) {
    const totalWebtoonCountOfService =
      {
        naver: this.lastUpdateInfo.naverWebtoonCount,
        kakao: this.lastUpdateInfo.kakaoWebtoonCount,
        kakaoPage: this.lastUpdateInfo.kakaoPageWebtoonCount,
        all: this.lastUpdateInfo.totalWebtoonCount,
      }[service] ?? 0;

    const webtoons = await this.webtoonService.getLimitedWebtoonsByDatabase(
      page,
      perPage,
      service,
    );

    const webtoonCount = webtoons.length;

    const isLastPage = webtoonCount
      ? page * perPage + webtoonCount >= totalWebtoonCountOfService
      : null;

    return {
      ...this.lastUpdateInfo,
      isLastPage,
      webtoons,
    };
  }

  @Get('search')
  async search(@Query(`keyword`) keyword: string) {
    if (keyword.length < 2) return { ...this.lastUpdateInfo, webtoons: [] };
    const webtoons = await this.webtoonService.getWebtoonsByKeyword(keyword);
    return {
      ...this.lastUpdateInfo,
      webtoons,
    };
  }
}
