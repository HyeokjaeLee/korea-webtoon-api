<h1 align="center">Toy project API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.8.10-blue.svg?cacheSeconds=2592000" />
</p>

> 여러가지 ToyProject에 활용할 API <br>

### ✨ List

- [Korean-Webtoon-API](https://toy-projects-api.herokuapp.com/webtoon)
- [Insider-Trade-API](https://toy-projects-api.herokuapp.com/insidertrade)
- [Korea-Covid19-API](https://toy-projects-api.herokuapp.com/covid19)

## Author

👤 **leehyeokjae**

- Github: [@HyeokjaeLee](https://github.com/HyeokjaeLee)

## Used

- [Heroku](https://www.heroku.com)
- Node.js
  - express
  - xmlhttprequest
  - request-promise-native
  - cheerio
  - yahoo-stock-prices
- Korean-Webtoon-API
  - [NaverWebtoon](https://comic.naver.com)
  - [DaumWebtoon](http://webtoon.daum.net)
- Insider-Trade-API
  - [OpenInsider](http://openinsider.com)
  - yahoo finance api
- Korea-covid19-API
  - [공공데이터포털(XML)](https://www.data.go.kr/data/15043378/openapi.do)<br>

## Log
- [x] Change to hosting module class type<br>
- [ ] Add token authentication function<br>
- [ ] Add QueryString Filter<br>

|Korea-Webtoon|Insider-Trade|Korea-COVID19|
|---|---|---|
| - [x] move completely from javascript to typescript(ver 1.1.0)|- [x] add insider-trade-api(ver 1.2.0)|- [x] Convert xml data to json format and complete appropriate data form(ver 1.6.5)|
| - [ ] add more info about webtoon|- [x] add stock-info(ver 1.3.0)|- [x] Create filtering code(ver 1.6.10)|
|||- [ ] Add AI Data(modification)|
|||- [x] Modify the filtering code(ver 1.8.4)|
|||- [ ] Add Monthly Information|

