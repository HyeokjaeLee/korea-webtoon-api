const brain = require("../../../brain/brain.js");
interface ai_data {
  date: Date;
  new: number;
  existing: number;
  total: number;
}

export default class get_ai_data {
  private net: any = new brain.recurrent.LSTMTimeStep();
  public new: number[] = [];
  public existing: number[] = [];
  public total: number[] = [];
  public input_date_count: number;
  public output_data_count: number;
  public max: number | undefined;
  public min: number | undefined;
  public date: Date[] = [];

  constructor(
    data: any[][],
    model: JSON,
    input_data_count: number,
    output_data_count: number,
  ) {
    this.input_date_count = input_data_count;
    this.output_data_count = output_data_count;
    this.net.fromJSON(model);
    data.map((data: any) => {
      this.new.push(data.confirmed.infected.new.total);
      this.existing.push(data.confirmed.infected.existing);
      this.total.push(data.confirmed.infected.existing);
      this.date.push(data.date);
    });
    this.max = Math.max.apply(null, this.new);
    this.min = Math.min.apply(null, this.new);
  }

  private getLastDate = () => {};

  private getPredictiveData = (number_arr: number[]): number[] => {
    let data: number[] = number_arr.slice(
      number_arr.length - this.input_date_count,
      number_arr.length,
    );
    let output_data: number[] = [];
    data[data.length - 1] = this.net.run(data);
    data[data.length - 1] = this.net.run(data);
    for (let i = 0; i < this.output_data_count; i++) {
      const a_new_data = this.net.run(data);
      data.push(a_new_data);
      data = data.slice(1, this.input_date_count + 1);
      output_data.push(a_new_data);
    }
    return output_data;
  };

  private createAIdata = (predictiveData: any) => {
    let existing = this.total[this.new.length - 1];
    let date: Date = this.date[this.date.length - 1];
    const result: any = predictiveData.map((data: number) => {
      const new_cnt = Math.round((this.max! - this.min!) * data + this.min!);
      const total_cnt = existing + new_cnt;
      date.setDate(date.getDate() + 1);
      const output: ai_data = {
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

  make_ai_data() {
    const ai_data = this.get_data(this.new);
    let existing = this.total[this.new.length - 1];
    let date: Date = this.date[this.date.length - 1];
    const result: any = ai_data.map((data: number) => {
      const new_cnt = Math.round((this.max! - this.min!) * data + this.min!);
      const total_cnt = existing + new_cnt;
      date.setDate(date.getDate() + 1);
      const output: ai_data = {
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
  }

  make_test_ai_data() {
    const test_data = this.new.slice(
      0,
      this.new.length - this.output_data_count,
    );
    const check_data = this.new.slice(
      this.new.length - this.output_data_count,
      this.new.length,
    );
    console.log(check_data);
    const ai_data = this.get_data(test_data);
    let existing = this.total[this.new.length - 1];
    let date: Date = this.date[this.date.length - 1];
    const result: any = ai_data.map((data: number) => {
      const new_cnt = Math.round((this.max! - this.min!) * data + this.min!);
      const total_cnt = existing + new_cnt;
      date.setDate(date.getDate() + 1);
      const output: ai_data = {
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
  }
}
