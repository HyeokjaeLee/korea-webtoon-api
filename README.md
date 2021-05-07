![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Toy%20project%20API&fontSize=30&fontAlign=73&fontAlignY=50)

![VERSION](https://img.shields.io/badge/version-1.9.0-blue.svg?cacheSeconds=2592000)

> API created for my Toy projects <br>

![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![JAVASCRIPT](https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=Javascript&logoColor=black) ![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![EXPRESS](https://img.shields.io/badge/Express-4C4C4C?style=flat-square&logo=Express&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

## Author

👤 **leehyeokjae**

- Github: [@HyeokjaeLee](https://github.com/HyeokjaeLee)

## Used Information

- Korean-Webtoon-API
  - [NaverWebtoon](https://comic.naver.com)
  - [DaumWebtoon](http://webtoon.daum.net)
- Insider-Trade-API
  - [OpenInsider](http://openinsider.com)
  - yahoo finance api
- Korea-covid19-API
  - [Korea Public Data Portal (XML)](https://www.data.go.kr/data/15043378/openapi.do)<br>

## ✨ List

### [Korean-Webtoon-API](https://toy-projects-api.herokuapp.com/webtoon)

#### URL

SeviceNameForm : daum<br>
WeekNum : 0~7 (7 = Finished Webtoon)

```
https://toy-projects-api.herokuapp.com/webtoon/info?weeknum={WeekNum}&service={ServiceName}
```

#### form

```json
{
  "title": "0.0MHz",
  "artist": "장작",
  "url": "http://m.webtoon.daum.net/m/webtoon/view/mhz",
  "img": "http://t1.daumcdn.net/webtoon/op/5496570b740722974c771c3aac3d5a9fb333c0c8",
  "service": "daum",
  "state": "완결",
  "weekday": 7
}
```

### [Insider-Trade-API](https://toy-projects-api.herokuapp.com/insidertrade)

You can check the ticker in the list information<br>

#### URL

DateForm : 20210325

```
https://toy-projects-api.herokuapp.com/insidertrade/list
https://toy-projects-api.herokuapp.com/insidertrade/{Ticker}?from={FromDate}&to={ToDate}
```

#### Form

##### List Info

```json
[
  {
    "ticker": "SAII",
    "trade_date": "2021-03-24T15:00:00.000Z",
    "company_name": "Software Acquisition Group Inc. II",
    "insider_name": "Mithaq Capital Spc",
    "price": 10.01,
    "qty": 21489,
    "owned": 11170962,
    "value": 215105
  },
  {
    "ticker": "TPL",
    "trade_date": "2021-03-24T15:00:00.000Z",
    "company_name": "Texas Pacific Land Corp",
    "insider_name": "Stahl Murray",
    "price": 1532.01,
    "qty": 31,
    "owned": 374729,
    "value": 47492
  }
]
```

##### Stock Info

```json
{
  "ticker": "SAII",
  "data": [
    {
      "date": "2020-10-07T04:30:00.000Z",
      "open": 9.649999618530273,
      "high": 9.649999618530273,
      "low": 9.649999618530273,
      "close": 9.649999618530273,
      "volume": 400000,
      "adjclose": 9.649999618530273
    },
    {
      "date": "2020-10-09T04:30:00.000Z",
      "open": 9.699999809265137,
      "high": 9.699999809265137,
      "low": 9.670000076293945,
      "close": 9.699999809265137,
      "volume": 30300,
      "adjclose": 9.699999809265137
    }
  ]
}
```

### [Korea-Covid19-API](https://toy-projects-api.herokuapp.com/covid19)

#### RegionList

- Lazaretto
- Jeju
- Gyeongsangnam-do
- Gyeongsangbuk-do
- Jeollanam-do
- Jeollabuk-do
- Chungcheongnam-do
- Chungcheongbuk-do
- Gangwon-do
- Gyeonggi-do
- Sejong
- Gwangju
- Busan
- Ulsan
- Incheon
- Daejeon
- Daegu
- Seoul
- **Total**

#### URL

DateForm : 20210325<br>

```
https://https://toy-projects-api.herokuapp.com/covid19/{Region}?from={FromDate}&to={ToDate}
```

#### form

```json
{
  "region": "Seoul",
  "data": [
    {
      "date": "2020-04-10T01:52:03.030Z",
      "confirmed": {
        "infected": {
          "new": {
            "local": 5,
            "overseas": 7,
            "total": 12
          },
          "existing": 402,
          "total": 414
        },
        "recovered": {
          "new": 0,
          "existing": 174,
          "total": 174
        },
        "death": {
          "new": 0,
          "existing": 2,
          "total": 2
        },
        "total": 590
      }
    }
  ]
}
```

## To-Do

- [ ] Add token authentication function
- [x] Add QueryString Filter (ver 1.8.14)
- [ ] Create GUI API navigation
- [ ] Create MainPage
- [ ] Improved parallel processing method

- Korean-Webtoon-API

  - [x] Create API (ver 1.1.0)<br>
  - [x] Add Daum Webtoon Info<br>
  - [x] Add Naver Webtoon Info<br>
  - [ ] Connect DB<br>

- Insider-Trade-API

  - [x] Create API (ver 1.2.0)<br>
  - [x] Add Insider Trade List (ver 1.3.0)<br>
  - [x] Add Insider Trade Stock information<br>

- Korea-COVID19-API
  - [ ] Create API (ver 1.6.4)<br>
  - [x] Convert xml data to json format and complete appropriate data form (ver 1.6.5)<br>
  - [x] Add Junk Value Filter (ver 1.6.10)<br>
  - [ ] Add AI Data (modification)<br>
  - [x] Fix Junk Value Filter Bug (ver 1.8.4)<br>
  - [ ] Add Monthly Information<br>
