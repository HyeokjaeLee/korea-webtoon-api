"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var covid19_api_url = function (service_key, from, to, middle_url) {
    return "http://openapi.data.go.kr/openapi/service/rest/Covid19/" + middle_url + "?serviceKey=" + service_key + "&pageNo=1&numOfRows=1&startCreateDt=" + from + "&endCreateDt=" + to;
};
var FormatConversion_1 = require("../../modules/FormatConversion");
var getAPI_1 = require("../../modules/getAPI");
var RegionList_1 = require("./RegionList");
var service_key = "LqdHrACABsYGuZOSxYS0G0hMAhheDZCNIPVR1zWxT5SxXvh3XmI9hUUjuzCgmq13GYhdyYgebB94yUVCB59bAg%3D%3D";
var today = Number(FormatConversion_1.convertDateFormat(new Date(), ""));
var url = covid19_api_url(service_key, 20200409, today, "getCovid19SidoInfStateJson");
var process_covid19_region_data = function (source_api_data) {
    var region_arr = RegionList_1.regionListData.map(function (data) { return data.eng; });
    var region_count = region_arr.length;
    var categorized_by_region = function () {
        var result = Array.from(Array(region_count), function () { return new Array(); });
        source_api_data.map(function (data) {
            var region_num = region_arr.indexOf(data.gubunEn._text);
            result[region_num].push({
                date: new Date(data.createDt._text),
                infected: Number(data.isolIngCnt._text),
                new_local_infection: Number(data.localOccCnt._text),
                new_overseas_infection: Number(data.overFlowCnt._text),
                new_infected: Number(data.incDec._text),
                death: Number(data.deathCnt._text),
                recovered: Number(data.isolClearCnt._text),
                confirmed: Number(data.defCnt._text),
            });
        });
        return result;
    };
    var result = [];
    for (var region_num = 0; region_num < region_count; region_num++) {
        result.push({ region: region_arr[region_num], data: [] });
        var data = categorized_by_region()[region_num].reverse();
        var data_count = data.length;
        for (var i = 1; i < data_count; i++) {
            var date = data[i].date; //날짜
            var infected_cnt = data[i].infected; //전체 확진자 수
            var new_infected_cnt = data[i].new_infected; //새로운 확진자_getAI
            var new_local_infection_cnt = data[i].new_local_infection; //새로운 지역감염으로 인한 확진자
            var new_overseas_infection_cnt = data[i].new_overseas_infection; //새로운 해외감염으로 인한 확진자
            var existing_infected_cnt = infected_cnt - new_infected_cnt; //기존 확진자
            var confirmed_cnt = data[i].confirmed; //전체 확진자 수
            var recovered_cnt = data[i].recovered; //회복_getAI
            var existing_recovered_cnt = data[i - 1].recovered;
            var new_recovered_cnt = recovered_cnt - existing_recovered_cnt;
            var death_cnt = data[i].death; //사망자_getAI
            var existing_death_cnt = data[i - 1].death;
            var new_death_cnt = death_cnt - existing_death_cnt;
            if (i == data_count - 1 ||
                (i < data_count - 1 &&
                    confirmed_cnt <= data[i + 1].confirmed &&
                    data[i].recovered <= data[i] < data[i + 1].recovered &&
                    data[i].death <= data[i + 1].death)) {
                result[region_num].data.push({
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
    }
    return result;
};
var get_covid19_data = function () { return __awaiter(void 0, void 0, void 0, function () {
    var source_api_data, covid19_region_data, processed_api_data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAPI_1.getXmlAPI2JSON(url)];
            case 1:
                source_api_data = _a.sent();
                return [4 /*yield*/, source_api_data.response.body.items.item];
            case 2:
                covid19_region_data = _a.sent();
                processed_api_data = process_covid19_region_data(covid19_region_data);
                return [2 /*return*/, processed_api_data];
        }
    });
}); };
exports.default = get_covid19_data;
