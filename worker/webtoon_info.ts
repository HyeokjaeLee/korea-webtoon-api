//import parentPort from 'worker_threads';
import * as request from "request-promise-native";
var { load } = require("cheerio") ;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  interface A_webtoon_info{
    title:string;
    artist:string;
    url:string;
    img:string;
    service:string;
    state:string;
    weekday:number;
  }


//----------------------------------------------------------------------------------------------------------------------
  const get_json_data = (url:string)=>{
    var xmlhttp = new XMLHttpRequest();
    var json_data
    xmlhttp.onreadystatechange = ()=> {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
          json_data = JSON.parse(xmlhttp.responseText);
        } catch (err) {
          console.log(err.message + " in " + xmlhttp.responseText);
          return;
        }
      }
    };
    xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
    xmlhttp.send();
    return(json_data);
  }

const get_daum_webtoon = ()=>{
let daum_webtoon_info:object[]=[];
let weekday_value:number;
let state_value:string;
let a_daum_webtoon_info:object;
const daum_json_url:string = "http://webtoon.daum.net/data/pc/webtoon";
const url_package:string[]=[
  "/list_serialized/sun",
  "/list_serialized/mon",
  "/list_serialized/tue",
  "/list_serialized/wed",
  "/list_serialized/thu",
  "/list_serialized/fri",
  "/list_serialized/sat",
  "/list_finished/free",
  "/list_finished/pay",]

  for(var i=0; i<9; i++){
    let data:any = get_json_data(daum_json_url+url_package[i]);
    let get_a_daum_webtoon_info = (k:number,i:number):A_webtoon_info => {
      var state_variable = data.data[k].restYn;
      if (i>6){weekday_value=7;}
      else {weekday_value=i;}
      if (new Date().getDay() == weekday_value && state_variable == "N") {
        state_value = "UP";
      } else if (state_variable == "Y") {
        state_value = "휴재";
      } else {
        state_value = "";
      }

      return ({
        title : data.data[k].title,
        artist : data.data[k].cartoon.artists[0].penName,
        url : "http://webtoon.daum.net/m/webtoon/view/" + data.data[k].nickname,
        img : data.data[k].thumbnailImage2.url,
        service : "Daum", //다음
        state : state_value,
        weekday:weekday_value
      })
    }
    for(var k=0; k<data.data.length; k++){
      a_daum_webtoon_info=get_a_daum_webtoon_info(k,i);
      daum_webtoon_info.push(a_daum_webtoon_info);
      }
  }
  return (daum_webtoon_info)
}


function get_page_count() {
  return new Promise(function (resolve, reject) {
    request(naver_webtoon_url, (err:any, response:any, body:any) => {
      let $:any = load(body);
      resolve($(".paging_type2").find(".current_pg").find(".total").text());
    });
  })
}


let naver_webtoon_info:object[]=[];
var naver_comic_url = "https://m.comic.naver.com";
var naver_webtoon_url = naver_comic_url + "/webtoon/finish.nhn?page=";

const get_naver_finished_webtoon = async () => {
  const page_count = Number(await get_page_count());
  for(let i=1;i<=page_count;i++){
    let a_naver_webtoon_info:object;
    await request(naver_webtoon_url, (err:any,response:any,body:any)=>{
      let $:any = load(body);
      let page_webtoon_count = $(".list_toon.list_finish")
      .find(".item")
      .find(".info").length;
      for(let webtoon_num=0;webtoon_num<page_webtoon_count;webtoon_num++){
        a_naver_webtoon_info=get_a_naver_webtoon($,".list_finish",webtoon_num)
        naver_webtoon_info.push(a_naver_webtoon_info)
      }
    })
  }
  console.log(naver_webtoon_info);
}

get_naver_finished_webtoon();

let get_a_naver_webtoon = ($:any,index:string,webtoon_num:number):A_webtoon_info=>{
  let get_title = $(".list_toon"+index)
  .find(".info")
  .eq(webtoon_num)
  .find(".title")
  .text();
  let get_artist = $(".list_toon"+index)
  .find(".info")
  .eq(webtoon_num)
  .find(".author")
  .text();
  let get_url = naver_comic_url +
  $(".list_toon"+index).find("a").eq(webtoon_num).attr("href");
  let get_img = $(".list_toon"+index)
  .find(".thumbnail")
  .eq(webtoon_num)
  .find("img")
  .attr("src");
  let state_value:string;
  let weekday_value:number;
  if(index=""){
    state_value="";
    weekday_value=1;
  }
  else{
    state_value="완결"
    weekday_value=7;
  }

  return ({
    title:get_title,
    artist:get_artist,
    url:get_url,
    img:get_img,
    service:"Naver",
    state:state_value,
    weekday:weekday_value
  })
}