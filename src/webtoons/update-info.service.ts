import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateInfo, UpdateInfoDocument } from './schemas/update-info.schema';
import { Webtoon, WebtoonDocument } from './schemas/webtoon.schema';
import kakao_crawler from 'functions/kakao-crawler';
import naver_crawler from 'functions/naver-crawler';
import kakaoPage_crawler from 'functions/kakaoPage-crawler';
import { uniq } from 'lodash';

@Injectable()
export class UpdateInfoService {
  constructor(
    @InjectModel(UpdateInfo.name)
    private readonly updatedInfoModel: Model<UpdateInfoDocument>,
    @InjectModel(Webtoon.name)
    private readonly webtoonModel: Model<WebtoonDocument>,
  ) {}

  private async getWebtoonsCollection(): Promise<Webtoon[]> {
    return await this.webtoonModel.find().exec();
  }

  async updateWebtoonsCollection() {
    const work_on_webtoon = {
      IDs: [],
      data: await this.getWebtoonsCollection(),
    };

    work_on_webtoon.data.forEach((webtoon) => {
      webtoon.week = [];
      work_on_webtoon.IDs.push(webtoon._id);
    });

    const WebtoonsArr = await Promise.all([
      naver_crawler(),
      kakao_crawler(),
      kakaoPage_crawler(),
    ]);

    let cralwer_IDs: string[] = [];
    WebtoonsArr.forEach((webtoons) => {
      webtoons.forEach((webtoon) => {
        const { title, author, service } = webtoon;
        const _id = `${title}__${author}__${service}`.replace(/(\s*)/g, '');
        cralwer_IDs.push(_id);
        const webtoonIndex = work_on_webtoon.IDs.indexOf(_id);
        const isExist = webtoonIndex !== -1;
        if (isExist) {
          const existingWebtoon = work_on_webtoon.data[webtoonIndex];
          existingWebtoon.additional = webtoon.additional;
          existingWebtoon.week.push(webtoon.week);
        } else {
          const newWebtoon: Webtoon = { ...webtoon, week: [webtoon.week], _id };
          work_on_webtoon.IDs.push(_id);
          work_on_webtoon.data.push(newWebtoon);
        }
      });
    });
    cralwer_IDs = uniq(cralwer_IDs);

    {
      const webtoon_change = await (async () => {
        const previous_webtoon_data = await this.getWebtoonsCollection();
        const new_data: Webtoon[] = [];
        const changed_data: Webtoon[] = [];
        const removed_IDs: string[] = work_on_webtoon.IDs.filter(
          (id) => !cralwer_IDs.includes(id),
        );
        work_on_webtoon.data.forEach((webtoon, index) => {
          webtoon.week.sort();
          const is_new = !previous_webtoon_data[index];
          is_new && new_data.push(webtoon);
          if (!is_new) {
            const is_changed =
              JSON.stringify(webtoon) !==
              JSON.stringify(previous_webtoon_data[index]);
            is_changed && changed_data.push(webtoon);
          }
        });
        return { new_data, changed_data, removed_IDs };
      })();

      //DB 수정
      {
        webtoon_change.new_data.forEach(
          async (_webtoon) => await this.webtoonModel.create(_webtoon),
        );
        webtoon_change.changed_data.forEach(
          async (_webtoon) =>
            await this.webtoonModel.findByIdAndUpdate(_webtoon._id, _webtoon),
        );
        webtoon_change.removed_IDs.forEach(
          async (id) => await this.webtoonModel.findByIdAndDelete(id),
        );
      }
      const update_info: UpdateInfo = {
        new: webtoon_change.new_data.length,
        changed: webtoon_change.changed_data.length,
        removed: webtoon_change.removed_IDs.length,
        total: cralwer_IDs.length,
        date: new Date(),
      };
      await this.updatedInfoModel.create(update_info);
    }
  }

  async findAll(): Promise<UpdateInfo[]> {
    return this.updatedInfoModel.find().exec();
  }
}
