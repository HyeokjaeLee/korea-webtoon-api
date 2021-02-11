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
  const region_count: number = region_arr.length;
  const result_data: any[][] = Array.from(Array(region_count), () => new Array());
  const categorized_by_region: any[][] = Array.from(Array(region_count), () => new Array());
  source_api_data.map((data: any) => {
    const region_num = region_arr.indexOf(data.gubunEn._text);
    categorized_by_region[region_num].push({
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
  for (let region_num = 0; region_num < region_count; region_num++) {
    const data = categorized_by_region[region_num].reverse();
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
          data[i].recovered <= data[i] < data[i + 1].recovered &&
          data[i].death <= data[i + 1].death)
      ) {
        result_data[region_num].push({
          date: date,
          confirmed: {
            infected: {
              new: { local: new_local_infection_cnt, overseas: new_overseas_infection_cnt, total: new_infected_cnt },
              existing: existing_infected_cnt,
              total: infected_cnt,
            },
            recovered: { new: new_recovered_cnt, existing: existing_recovered_cnt, total: recovered_cnt },
            death: { new: new_death_cnt, existing: existing_death_cnt, total: death_cnt },
            total: confirmed_cnt,
          },
        });
      }
    }
    result_data[region_num].unshift(region_arr[region_num]);
  }

  return result_data;
};

const get_covid19_data = async () => {
  const source_api_data: any = await get_api_xml2json(url);
  const covid19_region_data: any[] = await source_api_data.response.body.items.item;
  const processed_api_data = process_covid19_region_data(covid19_region_data);
  return processed_api_data;
};

export default get_covid19_data;
