![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Korea%20Webtoon%20API&fontSize=40&fontAlign=50&fontAlignY=50)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

# About

여러 가지 플랫폼의 웹툰에 대한 정보를 제공합니다.

현재 정보가 제공되는 웹툰 플랫폼은 다음과 같습니다.

- 네이버웹툰
- 카카오웹툰
- 카카오페이지

# API Request

| Method |                                     Request URL                                      | Format |
| :----: | :----------------------------------------------------------------------------------: | :----: |
|  GET   | [`https://korea-webtoon-api.herokuapp.com`](https://korea-webtoon-api.herokuapp.com) |  JSON  |

## /

웹툰 정보를 제공합니다.

### 🔖 Parameter

|    Name     |     Required     |  Type  | Description                                                                                                                                                                                                                                                            |
| :---------: | :--------------: | :----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `page`    | N<br/>default=0  | number | `perPage`로 나눈 전체 페이지중 요청할 페이지 입니다.                                                                                                                                                                                                                   |
|  `perPage`  | N<br/>default=10 | number | 한번에 요청할 웹툰의 수 입니다.                                                                                                                                                                                                                                        |
|  `service`  |        N         | string | 요청 가능한 `service`는 다음과 같습니다.<ul><li>`naver` 네이버 웹툰</li><li>`kakao` 카카오 웹툰</li><li>`kakaoPage` 카카오페이지</li></ul>                                                                                                                             |
| `updateDay` |        N         | string | 웹툰의 업데이트 요일입니다.<br/> 요청 가능한 `updateDay`는 다음과 같습니다.<ul><li>`mon` 월</li><li>`tue` 화</li><li>`wed` 수</li><li>`thu` 목</li><li>`fri` 금</li><li>`sat` 토</li><li>`sun` 일</li><li>`finished` 완결</li><li>`naverDaily` 네이버 Daily+</li></ul> |

## /search

웹툰 제목 또는 작가 검색을 제공합니다.

### 🔖 Parameter

|   Name    | Required |  Type  | Description                                                                                                                                         |
| :-------: | :------: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keyword` |    Y     | string | 검색할 키워드입니다.<br/>띄어쓰기, 대소문자 구분 없이 작가 혹은 제목으로 검색 가능합니다.<br/>특수 문자를 제외한 길이가 2보다 큰 문자열을 받습니다. |
