"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var brain = require("./brain.js");
var base_modules_1 = require("./base_modules");
var data_api = base_modules_1.get_json_data("https://toy-projects-api.herokuapp.com/covid19/korea/total");
var path = require("path");
var output_filePath = path.join(__dirname, "./output.json");
var fs = require("fs");
var save2csv = function (output_filePath, content) {
    fs.writeFile(output_filePath, content, function (err) {
        if (err) {
            return console.log(err);
        }
        else {
            console.log("csv파일을 성공적으로 저장했습니다.");
        }
    });
};
console.log(data_api);
var new_infected = [];
data_api.map(function (data) {
    new_infected.push(data.confirmed.infected.new_infected.total);
});
console.log(new_infected);
var create_ai_data = function () {
    var Z = [new_infected.slice(0, 50)];
    console.log(Z);
    var test_X = new_infected.slice(0, 5);
    console.log("test_X=", test_X);
    var net = new brain.recurrent.LSTMTimeStep();
    var load_data = fs.readFileSync(output_filePath);
    var load_data_json = JSON.parse(load_data);
    net.train(Z, {
        log: true,
        logPeriod: 1000,
        iterations: 2000000,
        errorThresh: 0.1,
    });
    var json = net.toJSON();
    console.log(json);
    var string_json = JSON.stringify(json);
    console.log(string_json);
    save2csv(output_filePath, string_json);
    //net.fromJSON(load_data_json);
    var output = net.run(test_X);
    console.log(output);
};
create_ai_data();
