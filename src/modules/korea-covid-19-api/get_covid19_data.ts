import { covid19_api_url } from "./base_modules";
import { get_api_xml2json, getFormatDate } from "../common_modules";
const service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D";
const today = Number(getFormatDate(new Date(), ""));
const url = covid19_api_url(service_key, 20200409, today, "getCovid19SidoInfStateJson");
const process_covid19_region_data = (source_api_data: any[]) => {
  const region_arr = [
    "Lazaretto",
    "Jeju",
    "Gyeongsangnam-do",
    "Gyeongsangbuk-do",
    "Jeollanam-do",
    "Jeollabuk-do",
    "Chungcheongnam-do",
    "Chungcheongbuk-do",
    "Gangwon-do",
    "Gyeonggi-do",
    "Sejong",
    "Ulsan",
    "Daejeon",
    "Gwangju",
    "Incheon",
    "Daegu",
    "Busan",
    "Seoul",
    "Total",
  ];
  const region_arr_length: number = region_arr.length;
  const data_arr: any[][] = Array.from(Array(region_arr_length), () => new Array());
  const api_length: number = source_api_data.length;
  const Original_data = source_api_data.map((data: any) => ({
    date: new Date(data.createDt._text), //날짜
    region: data.gubun._text, //지역 kor
    regionEn: data.gubunEn._text, //지역 eng
    infected: Number(data.isolIngCnt._text), //치료 안된 감염자
    new_local_infection: Number(data.localOccCnt._text), //새로운 지역감염으로 인한 확진자
    new_overseas_infection: Number(data.overFlowCnt._text), //새로운 해외감염으로 인한 확진자
    new_infected: Number(data.incDec._text), //새로운 확진자_getAI
    death: Number(data.deathCnt._text), //사망자_getAI
    recovered: Number(data.isolClearCnt._text), //회복_getAI
    confirmed: Number(data.defCnt._text), //전체 확진자
  }));

  for (let i = 1; i < api_length; i++) {
    const date: Date = new Date(source_api_data[i].createDt._text); //날짜
    const region: string = source_api_data[i].gubunEn._text; //지역 또는 구분값
    const infected_cnt: number = Number(source_api_data[i].isolIngCnt._text); //전체 확진자 수
    const new_infected_cnt: number = Number(source_api_data[i].incDec._text); //새로운 확진자_getAI
    const new_local_infection_cnt: number = Number(source_api_data[i].localOccCnt._text); //새로운 지역감염으로 인한 확진자
    const new_overseas_infection_cnt: number = Number(source_api_data[i].overFlowCnt._text); //새로운 해외감염으로 인한 확진자
    const existing_infected_cnt: number = infected_cnt - new_infected_cnt; //기존 확진자
    const confirmed_cnt: number = Number(source_api_data[i].defCnt._text); //전체 확진자 수
    const region_num = region_arr.indexOf(region);
    const recovered_cnt: number = Number(source_api_data[i].isolClearCnt._text); //회복_getAI
    const existing_recovered_cnt = Number(source_api_data[i - 1].isolClearCnt._text);
    const new_recovered_cnt = recovered_cnt - existing_recovered_cnt;
    const death_cnt: number = Number(source_api_data[i].deathCnt._text); //사망자_getAI
    const existing_death_cnt = Number(source_api_data[i - 1].deathCnt._text);
    const new_death_cnt = death_cnt - existing_death_cnt;
    if (
      i < Original_data.length - 1 &&
      Original_data[i].infected < Original_data[i + 1].infected &&
      Original_data[i].recovered < Original_data[i + 1].recovered &&
      Original_data[i].death < Original_data[i + 1].death
    ) {
      data_arr[region_num].push({
        date: date,
        confirmed: {
          infected: {
            new_infected: { local_infection: new_local_infection_cnt, overseas_infection: new_overseas_infection_cnt, total: new_infected_cnt },
            existing_infected: existing_infected_cnt,
            total: infected_cnt,
          },
          recovered: recovered_cnt,
          death: death_cnt,
          total: confirmed_cnt,
        },
      });
  }

  source_api_data.map((data: any) => {
    const date: Date = new Date(data.createDt._text); //날짜
    const region: string = data.gubunEn._text; //지역 또는 구분값
    const infected_cnt: number = Number(data.isolIngCnt._text); //전체 확진자 수
    const new_local_infection_cnt: number = Number(data.localOccCnt._text); //새로운 지역감염으로 인한 확진자
    const new_overseas_infection_cnt: number = Number(data.overFlowCnt._text); //새로운 해외감염으로 인한 확진자
    const new_infected_cnt: number = Number(data.incDec._text); //새로운 확진자_getAI
    const existing_infected_cnt: number = infected_cnt - new_infected_cnt; //기존 확진자
    const death_cnt: number = Number(data.deathCnt._text); //사망자_getAI
    const recovered_cnt: number = Number(data.isolClearCnt._text); //회복_getAI
    const confirmed_cnt: number = Number(data.defCnt._text); //전체 확진자 수
    const region_num = region_arr.indexOf(region);
    data_arr[region_num].push({
      date: date,
      confirmed: {
        infected: {
          new_infected: { local_infection: new_local_infection_cnt, overseas_infection: new_overseas_infection_cnt, total: new_infected_cnt },
          existing_infected: existing_infected_cnt,
          total: infected_cnt,
        },
        recovered: recovered_cnt,
        death: death_cnt,
        total: confirmed_cnt,
      },
    });
  });
  for (let i = 0; i < region_arr_length; i++) {
    data_arr[i].push(region_arr[i]);
    data_arr[i].reverse();
  }
  return data_arr;
};

const get_covid19_data = async () => {
  const source_api_data: any = await get_api_xml2json(url);
  const covid19_region_data: any[] = await source_api_data.response.body.items.item;
  const processed_api_data = process_covid19_region_data(covid19_region_data);
  return processed_api_data;
};

export default get_covid19_data;
