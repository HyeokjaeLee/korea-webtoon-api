"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.covid19_api_url = void 0;
var covid19_api_url = function (service_key, from, to, middle_url) {
    return "http://openapi.data.go.kr/openapi/service/rest/Covid19/" + middle_url + "?serviceKey=" + service_key + "&pageNo=1&numOfRows=1&startCreateDt=" + from + "&endCreateDt=" + to;
};
exports.covid19_api_url = covid19_api_url;
