import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { load } from 'cheerio';
import { Model } from 'mongoose';

interface GetWebtoonListOnPageParams {
  type: 'weekday' | 'finish';
  search: string;
}

@Injectable()
export class NaverCrawerService {
  @Cron('0 50 * * * *', { name: 'naverCrawer', timeZone: 'Asia/Seoul' })
  async handleCron() {}

  private async getPageData(queryString: string) {
    const { data }: { data: string } = await axios.get(
      `https://m.comic.naver.com/${queryString}`,
    );

    return load(data);
  }

  private async getWebtoonListOnPage({
    type,
    search,
  }: GetWebtoonListOnPageParams) {
    const $ = await this.getPageData(`webtoon/${type}.nhn?${search}`);

    const baseElement = $('#ct > div.section_list_toon > ul > li > a');

    baseElement.map((_, element) => {
      const badgeAreaText = $(element).find('span.area_badge').text();

      const isNewWebtoon = badgeAreaText.includes('신작');
      const isAdultWebtoon = badgeAreaText.includes('청유물');
    });
  }
}
