import { convertDateFormat } from "../function/FormatConversion";
import { getXmlAPI2JSON } from "../function/external-data";
import { regionListData } from "../data/region_list";
import * as Covid19 from "../type/type.covid19";

const service_key: string =
  "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D";
const covid19_api_url = (
  service_key: string,
  from: number,
  to: number,
  middle_url: string
): string =>
  `http://openapi.data.go.kr/openapi/service/rest/Covid19/${middle_url}?serviceKey=${service_key}&pageNo=1&numOfRows=1&startCreateDt=${from}&endCreateDt=${to}`;

const today = Number(convertDateFormat(new Date(), ""));
const url = covid19_api_url(
  service_key,
  20200409,
  today,
  "getCovid19SidoInfStateJson"
);

const regionArr: string[] = regionListData.map((data) => data.eng);
const regionCount: number = regionArr.length;

export const getCovid19Data = async () => {
  const originalCovid19API: any = await getXmlAPI2JSON(url);
  const RequiredInfo = originalCovid19API.response.body.items.item;
  const region_separated_Info = ((): Covid19.OriginalAPI[][] => {
    const result: Covid19.OriginalAPI[][] = Array.from(
      Array(regionCount),
      () => new Array()
    );
    RequiredInfo.map((data: any) => {
      const regionIndex = regionArr.indexOf(data.gubunEn._text);
      result[regionIndex].push({
        date: new Date(data.createDt._text), //날짜
        infected: Number(data.isolIngCnt._text), //치료 안된 감염자
        new_local_infection: Number(data.localOccCnt._text), //새로운 지역감염으로 인한 확진자
        new_overseas_infection: Number(data.overFlowCnt._text), //새로운 해외감염으로 인한 확진자
        new_infected: Number(data.incDec._text), //새로운 확진자_getAI
        death: Number(data.deathCnt._text), //사망자_getAI
        recovered: Number(data.isolClearCnt._text), //회복_getAI
        confirmed: Number(data.defCnt._text), //전체 확진자
      });
    });
    return result;
  })();

  const junckFilteredInfo = (() => {
    const result: Covid19.OriginalAPI[][] = Array.from(
      Array(regionCount),
      () => new Array()
    );
    for (let regionIndex = 0; regionIndex < regionCount; regionIndex++) {
      const daysCount: number = region_separated_Info[regionIndex].length;
      const aRegionInfo = region_separated_Info[regionIndex].reverse();
      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        if (
          dayIndex == daysCount - 1 ||
          dayIndex == 0 ||
          (aRegionInfo[dayIndex].confirmed >=
            aRegionInfo[dayIndex - 1].confirmed &&
            aRegionInfo[dayIndex].recovered >=
              aRegionInfo[dayIndex - 1].recovered &&
            aRegionInfo[dayIndex].death >= aRegionInfo[dayIndex - 1].death &&
            aRegionInfo[dayIndex].confirmed <=
              aRegionInfo[dayIndex + 1].confirmed &&
            aRegionInfo[dayIndex].recovered <=
              aRegionInfo[dayIndex + 1].recovered &&
            aRegionInfo[dayIndex].death <= aRegionInfo[dayIndex + 1].death)
        ) {
          result[regionIndex].push(aRegionInfo[dayIndex]);
        }
      }
    }
    return result;
  })();

  const detail_Info = ((): Covid19.Final[] => {
    const result: Covid19.Final[] = [];
    for (let regionIndex = 0; regionIndex < regionCount; regionIndex++) {
      result.push({ region: regionArr[regionIndex], data: [] });
      const aRegionInfo = junckFilteredInfo[regionIndex];
      const daysCount: number = aRegionInfo.length;
      for (let dayIndex = 1; dayIndex < daysCount; dayIndex++) {
        const date: Date = aRegionInfo[dayIndex].date; //날짜
        const infected_cnt: number = aRegionInfo[dayIndex].infected; //전체 확진자 수
        const new_infected_cnt: number = aRegionInfo[dayIndex].new_infected; //새로운 확진자_getAI
        const new_local_infection_cnt: number =
          aRegionInfo[dayIndex].new_local_infection; //새로운 지역감염으로 인한 확진자
        const new_overseas_infection_cnt: number =
          aRegionInfo[dayIndex].new_overseas_infection; //새로운 해외감염으로 인한 확진자
        const existing_infected_cnt: number = infected_cnt - new_infected_cnt; //기존 확진자
        const confirmed_cnt: number = aRegionInfo[dayIndex].confirmed; //전체 확진자 수
        const recovered_cnt: number = aRegionInfo[dayIndex].recovered; //회복_getAI
        const existing_recovered_cnt = aRegionInfo[dayIndex - 1].recovered;
        const new_recovered_cnt = recovered_cnt - existing_recovered_cnt;
        const death_cnt: number = aRegionInfo[dayIndex].death; //사망자_getAI
        const existing_death_cnt = aRegionInfo[dayIndex - 1].death;
        const new_death_cnt = death_cnt - existing_death_cnt;
        result[regionIndex].data.push({
          date: date,
          confirmed: {
            infected: {
              new: {
                local: new_local_infection_cnt,
                overseas: new_overseas_infection_cnt,
                total: new_infected_cnt,
              },
              existing: existing_infected_cnt,
              total: infected_cnt,
            },
            recovered: {
              new: new_recovered_cnt,
              existing: existing_recovered_cnt,
              total: recovered_cnt,
            },
            death: {
              new: new_death_cnt,
              existing: existing_death_cnt,
              total: death_cnt,
            },
            total: confirmed_cnt,
          },
        });
      }
    }
    return result;
  })();

  return detail_Info;
};
