![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Korea%20Webtoon%20API&fontSize=30&fontAlign=50&fontAlignY=50)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

> ⚠️ 해당 API는 Toy Projects를 위한 API로 Heroku 서버가 Sleep 상태일 경우 첫 요청시 1분 가량 소요됩니다.

## 📝 About

여러 가지 한국 플랫폼의 웹툰에 대한 정보를 제공합니다.

Json 형식으로 제공됩니다.

현재 정보가 제공되는 웹툰 플랫폼은 다음과 같습니다.

- 네이버웹툰
- 카카오웹툰
- 카카오페이지

## API Basic information

| Method | Request URL                                                 | Format |
| ------ | ----------------------------------------------------------- | ------ |
| Get    | `https://korea-webtoon-api.herokuapp.com/{platform}/{type}` | JSON   |

## URL Params

| Name       | Required | Type   | Description                                                                     |
| ---------- | -------- | ------ | ------------------------------------------------------------------------------- |
| `platform` | Y        | string | 요청할 웹툰의 플랫폼 입니다.<br/>요청 가능한 `platform`은 다음과 같습니다.<ul><li>`all` 모든 플랫폼</li><li>`naver` 네이버웹툰</li><li>`kakao` 카카오웹툰</li><li>`kakao-page` 카카오페이지</li></ul> |
| `type`     | N        | string | 요청할 웹툰의 타입입니다.<br/>미입력시 모든 타입의 웹툰 정보를 요청합니다.<br/>요청 가능한 `type`은 다음과 같습니다.<ul><li>`week` 연재중</li><li>`finished` 완결</li></ul>|


# Request variable
| Name       | Required | Type   | Description                                                                     |
| ---------- | -------- | ------ | ------------------------------------------------------------------------------- |
| `day`      | N        | string | 요청할 웹툰의 요일입니다.<br/>`type`이 `week`인 경우에만 가능합니다.<br/>미입력시 모든 요일의 웹툰 정보를 요청합니다.</br>요청 가능한 `day`는 다음과 같습니다.<ul><li>`mon` 월 week=0</li><li>`tue` 화 week=1</li><li>`wed` 수 week=2</li><li>`thu` 목 week=3</li><li>`fri` 금 week=4</li><li>`sat` 토 week=5</li><li>`sun` 일 week=6</li></ul>|



