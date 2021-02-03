const covid19_api_url = (service_key: string, from: number, to: number, middle_url: string) =>
  `http://openapi.data.go.kr/openapi/service/rest/Covid19/${middle_url}?serviceKey=${service_key}&pageNo=1&numOfRows=1&startCreateDt=${from}&endCreateDt=${to}`;

export { covid19_api_url };
