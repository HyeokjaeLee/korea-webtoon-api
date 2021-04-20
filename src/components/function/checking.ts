export const checkUpdates = (api_name: string, data: any): void => {
  console.log(`\n-----------${new Date()}-----------\n`);
  if (data != undefined) {
    console.log(`${api_name} data has been updated successfully.`);
  } else {
    console.log(`${api_name} data update failed.`);
  }
};

export const isExists = (data: any) => {
  if (typeof data == undefined || data == null || data == "") return false;
  else return true;
};

export const query2Date = (query: any) => {
  //Query 데이터의 값이 형식에 맞으면 데이터 폼으로 반환 아니면 undefined 반환
  const type = typeof query;
  if (type == "string") {
    const date = Number(query);
    if (date > 19000000 && date < 30000000) {
      return date;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
