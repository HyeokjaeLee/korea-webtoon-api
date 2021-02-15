import { convertDateFormat } from "../../modules/FormatConversion";
import { getXmlAPI2JSON } from "../../modules/getAPI";
import { regionListData } from "./RegionList";
import { covid19API, covid19OriginalInfo } from "./types";

const service_key: string =
  "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D";
const covid19_api_url = (
  service_key: string,
  from: number,
  to: number,
  middle_url: string,
): string =>
  `http://openapi.data.go.kr/openapi/service/rest/Covid19/${middle_url}?serviceKey=${service_key}&pageNo=1&numOfRows=1&startCreateDt=${from}&endCreateDt=${to}`;
const today = Number(convertDateFormat(new Date(), ""));
const url = covid19_api_url(
  service_key,
  20200409,
  today,
  "getCovid19SidoInfStateJson",
);

const region_arr: string[] = regionListData.map((data) => data.eng);
const region_count: number = region_arr.length;

const categorizing_by_region = (
  source_api_data: any[],
): covid19OriginalInfo[][] => {
  const result: covid19OriginalInfo[][] = Array.from(
    Array(region_count),
    () => new Array(),
  );
  source_api_data.map((data: any) => {
    const region_num = region_arr.indexOf(data.gubunEn._text);
    result[region_num].push({
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
};

const createDetail_Info = (
  categorized_by_region_Data: covid19OriginalInfo[][],
): covid19API[] => {
  const result: covid19API[] = [];
  for (let region_num = 0; region_num < region_count; region_num++) {
    result.push({ region: region_arr[region_num], data: [] });
    const data: covid19OriginalInfo[] = categorized_by_region_Data[
      region_num
    ].reverse();
    const data_count: number = data.length;
    for (let i = 1; i < data_count; i++) {
      const date: Date = data[i].date; //날짜
      const infected_cnt: number = data[i].infected; //전체 확진자 수
      const new_infected_cnt: number = data[i].new_infected; //새로운 확진자_getAI
      const new_local_infection_cnt: number = data[i].new_local_infection; //새로운 지역감염으로 인한 확진자
      const new_overseas_infection_cnt: number = data[i].new_overseas_infection; //새로운 해외감염으로 인한 확진자
      const existing_infected_cnt: number = infected_cnt - new_infected_cnt; //기존 확진자
      const confirmed_cnt: number = data[i].confirmed; //전체 확진자 수
      const recovered_cnt: number = data[i].recovered; //회복_getAI
      const existing_recovered_cnt = data[i - 1].recovered;
      const new_recovered_cnt = recovered_cnt - existing_recovered_cnt;
      const death_cnt: number = data[i].death; //사망자_getAI
      const existing_death_cnt = data[i - 1].death;
      const new_death_cnt = death_cnt - existing_death_cnt;
      if (
        i == data_count - 1 ||
        (i < data_count - 1 &&
          confirmed_cnt <= data[i + 1].confirmed &&
          data[i].recovered <= data[i + 1].recovered &&
          data[i].death <= data[i + 1].death)
      ) {
        result[region_num].data.push({
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
  }
  return result;
};

export const get_covid19_data = async () => {
  const source_api_data: any = await getXmlAPI2JSON(url);
  const covid19_region_data: any[] = source_api_data.response.body.items.item;
  const categorized_by_region_Data = categorizing_by_region(
    covid19_region_data,
  );
  const detail_info = createDetail_Info(categorized_by_region_Data);
  return detail_info;
};
