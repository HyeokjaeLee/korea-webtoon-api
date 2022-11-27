import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webtoon, WebtoonDocument } from './schemas/webtoon.schema';
import {
  getKakaoPageWebtoons,
  getKakaoWebtoons,
  getNaverWebtoons,
} from '../../crawler';

import { isEqual } from 'lodash';

import type { LastUpdateInfo } from '../../types';

@Injectable()
export class WebtoonService {
  constructor(
    @InjectModel(Webtoon.name)
    private readonly webtoonModel: Model<WebtoonDocument>,
  ) {}

  private async getWebtoonsByCrawler() {
    const [naverWebtoons, kakaoWebtoons, kakaoPageWebtoons] = await Promise.all(
      [getNaverWebtoons(), getKakaoWebtoons(), getKakaoPageWebtoons()],
    );
    return [...naverWebtoons, ...kakaoWebtoons, ...kakaoPageWebtoons];
  }

  async getWebtoonsByDatabase() {
    return await this.webtoonModel.find().exec();
  }

  async getLimitedWebtoonsByDatabase(
    page: number,
    perPage: number,
    service: string,
    updateDay: string,
  ) {
    const findParams = {};

    if (service) {
      findParams['service'] = service;
    }

    if (updateDay) {
      findParams['updateDays'] = updateDay;
    }

    const webtoons = await this.webtoonModel
      .find(findParams)
      .skip(page * perPage)
      .limit(perPage)
      .exec();

    return webtoons.sort((a, b) => {
      const aFancount = a.fanCount ?? 0;
      const bFancount = b.fanCount ?? 0;
      return bFancount - aFancount;
    });
  }

  async getWebtoonsByKeyword(keyword: string) {
    return await this.webtoonModel
      .find()
      .where('searchKeyword')
      .regex(keyword)
      .exec();
  }

  async updateWebtoons(): Promise<LastUpdateInfo> {
    const webtoonsOnDatabase = await this.getWebtoonsByDatabase();
    const crawledWebtoons = await this.getWebtoonsByCrawler();

    let totalWebtoonCount = 0,
      naverWebtoonCount = 0,
      kakaoWebtoonCount = 0,
      kakaoPageWebtoonCount = 0;

    const addWebtoonCount = (service: string) => {
      switch (service) {
        case 'naver':
          naverWebtoonCount++;
          break;
        case 'kakao':
          kakaoWebtoonCount++;
          break;
        case 'kakaoPage':
          kakaoPageWebtoonCount++;
          break;
      }
      totalWebtoonCount++;
    };

    for (const { service } of webtoonsOnDatabase) {
      addWebtoonCount(service);
    }

    let updatedWebtoonCount = 0;
    let createdWebtoonCount = 0;

    for (const crawledWebtoon of crawledWebtoons) {
      const webtoonOnDatabase = webtoonsOnDatabase.find(
        ({ webtoonId }) => webtoonId === crawledWebtoon.webtoonId,
      );
      if (webtoonOnDatabase) {
        for (const key in crawledWebtoon) {
          if (!isEqual(crawledWebtoon[key], webtoonOnDatabase[key])) {
            await this.webtoonModel.updateOne(
              {
                webtoonId: crawledWebtoon.webtoonId,
              },
              crawledWebtoon,
            );
            updatedWebtoonCount++;
            break;
          }
        }
      } else {
        await this.webtoonModel.create(crawledWebtoon);
        addWebtoonCount(crawledWebtoon.service);
        createdWebtoonCount++;
      }
    }

    return {
      totalWebtoonCount,
      naverWebtoonCount,
      kakaoWebtoonCount,
      kakaoPageWebtoonCount,
      updatedWebtoonCount,
      createdWebtoonCount,
      lastUpdate: new Date().toISOString(),
    };
  }
}
