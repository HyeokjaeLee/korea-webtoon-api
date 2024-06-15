import { AppDataSource } from '@/database/datasource';
import { DataInfo, NormalizedWebtoon, Provider } from '@/database/entity';
import type { Response, Request } from 'express';

interface CreateUpdateMethodProps {
  provider: Provider;
  webtoonCrawler: () => Promise<NormalizedWebtoon[]>;
}

const SIX_HOURS = 21_600_000;

export const createUpdateMethod =
  ({ provider, webtoonCrawler }: CreateUpdateMethodProps) =>
  async (_: Request, res: Response) => {
    const dataInfoRepository = AppDataSource.getRepository(DataInfo);

    const dataInfo = await dataInfoRepository.findOneBy({
      provider,
    });

    const updateStartAt =
      dataInfo?.updateStartAt && new Date(dataInfo.updateStartAt);

    const isOld = updateStartAt
      ? new Date().getTime() - updateStartAt.getTime() > SIX_HOURS
      : true;

    //! 오래된 정보가 아니면서 업데이트 시작날짜가 없는 경우는 에러
    if (updateStartAt && !isOld) {
      if (!dataInfo) {
        return res.status(500);
      }

      return res.json({
        ...dataInfo,
        updateRunningTime: dataInfo.updateEndAt
          ? (dataInfo.updateEndAt.getTime() - updateStartAt.getTime()) / 60_000
          : (new Date().getTime() - updateStartAt.getTime()) / 60_000,
      });
    }

    const updatingDataInfo = {
      provider,
      updateStartAt: new Date(),
      updateEndAt: null,
    };

    await dataInfoRepository.save(updatingDataInfo);

    (async () => {
      console.log(`[${provider}] 업데이트 시작`);
      console.time('update');

      const webtoonList = await webtoonCrawler();

      const webtoonRepository = AppDataSource.getRepository(NormalizedWebtoon);

      await webtoonRepository.save(webtoonList);

      await dataInfoRepository.save({
        ...updatingDataInfo,
        updateEndAt: new Date(),
      });

      console.log(`[${provider}] 업데이트 완료`);
      console.timeEnd('update');
    })();

    return res.json({
      ...updatingDataInfo,
      updateRunningTime:
        (new Date().getTime() - updatingDataInfo.updateStartAt.getTime()) /
        60_000,
    });
  };
