"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var brain = require("../../../brainjs/brain.js");
var net = new brain.recurrent.LSTMTimeStep();
var get_ai_data = /** @class */ (function () {
    function get_ai_data(data, model, input_data_count, output_data_count) {
        var _this = this;
        this.new = [];
        this.existing = [];
        this.total = [];
        this.date = [];
        this.get_data = function (number_arr) {
            var data = number_arr.slice(number_arr.length - _this.input_date_count, number_arr.length);
            var output_data = [];
            data[data.length - 1] = net.run(data);
            data[data.length - 1] = net.run(data);
            for (var i = 0; i < _this.output_data_count; i++) {
                var a_new_data = net.run(data);
                data.push(a_new_data);
                data = data.slice(1, _this.input_date_count + 1);
                output_data.push(a_new_data);
            }
            return output_data;
        };
        this.input_date_count = input_data_count;
        this.output_data_count = output_data_count;
        net.fromJSON(model);
        data.slice(1).map(function (_data) {
            _this.new.push(_data.confirmed.infected.new.total);
            _this.existing.push(_data.confirmed.infected.existing);
            _this.total.push(_data.confirmed.infected.existing);
            _this.date.push(_data.date);
        });
        this.max = Math.max.apply(null, this.new);
        this.min = Math.min.apply(null, this.new);
    }
    get_ai_data.prototype.make_ai_data = function () {
        var _this = this;
        var ai_data = this.get_data(this.new);
        var existing = this.total[this.new.length - 1];
        var date = this.date[this.date.length - 1];
        var result = ai_data.map(function (data) {
            var new_cnt = Math.round((_this.max - _this.min) * data + _this.min);
            var total_cnt = existing + new_cnt;
            date.setDate(date.getDate() + 1);
            var output = {
                date: new Date(date),
                new: new_cnt,
                existing: existing,
                total: total_cnt,
            };
            existing = total_cnt;
            return output;
        });
        result.unshift("Total/AI");
        return result;
    };
    get_ai_data.prototype.make_test_ai_data = function () {
        var _this = this;
        var test_data = this.new.slice(0, this.new.length - this.output_data_count);
        var check_data = this.new.slice(this.new.length - this.output_data_count, this.new.length);
        console.log(check_data);
        var ai_data = this.get_data(test_data);
        var existing = this.total[this.new.length - 1];
        var date = this.date[this.date.length - 1];
        var result = ai_data.map(function (data) {
            var new_cnt = Math.round((_this.max - _this.min) * data + _this.min);
            var total_cnt = existing + new_cnt;
            date.setDate(date.getDate() + 1);
            var output = {
                date: new Date(date),
                new: new_cnt,
                existing: existing,
                total: total_cnt,
            };
            existing = total_cnt;
            return output;
        });
        result.unshift("Total/AITEST");
        return result;
    };
    get_ai_data.net = new brain.recurrent.LSTMTimeStep();
    return get_ai_data;
}());
exports.default = get_ai_data;
