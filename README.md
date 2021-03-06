<h1 align="center">Toy project API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.8.4-blue.svg?cacheSeconds=2592000" />
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

## To-Do

- Korean-Webtoon-API

  - [x] move completely from javascript to typescript(ver 1.1.0)<br>
        javascript 코드를 typescript로 완전히 옮김<br>
  - [ ] add more info about webtoon<br>
        더 많은 웹툰 정보 추가<br>
- Insider-Trade-API

  - [x] add insider-trade-api(ver 1.2.0)<br>
        insider trade api 추가<br>
  - [x] add stock-info(ver 1.3.0)<br>
        stock정보 추가<br>

- Korea-COVID19-API

  - [x] Convert xml data to json format and complete appropriate data form(ver 1.6.5)<br>
        xml 데이터를 json 형식으로 변환하고 적절한 데이터 양식 작성<br>
  - [x] Create filtering code(ver 1.6.10)<br>
        필터링 코드 생성<br>
  - [ ] Add AI Data(modification)<br>
        AI 예측정보 추가<br>
  - [x] Modify the filtering code(ver 1.8.4)<br>
        코로나 정보필터 수정<br>
        (전날 보다 확진자가 줄어드는 경우는 필터링 했으나 전날보다는 늘고 그다음날 보다는 적은 경우가 필터링 안됨 대쉬보드 참조)<br>
  - [ ] Change to hosting module class type<br>
        호스팅 모듈 클래스형으로 변경<br>
  - [ ] Add Monthly Information<br>
        월간 정보 추가<br>
