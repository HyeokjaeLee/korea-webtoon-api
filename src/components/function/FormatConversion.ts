export const ms2hour = (hour: number) => hour * 3600000;
export const ms2minute = (minute: number) => minute * 60000;
export const ms2second = (second: number) => second * 1000;
export const setTimer_loop = (sec_num: number, fn: any) => {
  fn();
  setInterval(() => {
    fn();
  }, sec_num);
};

export const convertDateFormat = (input_date: Date, form: string) => {
  const date = new Date(input_date);
  const num2str = (num: number) => {
    let result;
    if (num < 10) {
      result = "0" + num;
    } else {
      result = String(num);
    }
    return result;
  };
  let year: number = date.getFullYear(); //yyyy
  let month: string = num2str(1 + date.getMonth()); //M
  let day: string = num2str(date.getDate());

  return year + form + month + form + day;
};

export const string2date = (string_date: string) => {
  const strArr: string[] = string_date.split("-");
  const numArr: number[] = [];
  for (let i = 0; i < 3; i++) {
    numArr[i] = Number(strArr[i]);
  }
  const date: Date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
  return date;
};
