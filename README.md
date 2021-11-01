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

## URL

`https://korea-webtoon-api.herokuapp.com/{platform}/{type}`

## Method

`Get`

## URL Params

| Name       | Required | Type   | Description                  |
| ---------- | -------- | ------ | ---------------------------- |
| `platform` | True     | string | 요청할 웹툰의 플랫폼 입니다. |
| `type`     | False    | string | 요청할 웹툰의 타입입니다.    |
| `day`      | False    | string | 요청할 웹툰의 요일입니다.    |

### platform

요청 가능한 `platform`은 다음과 같습니다.

- `all` 모든 플랫폼의 웹툰
- `naver` 네이버웹툰
- `kakao` 카카오웹툰
- `kakao-page` 카카오페이지

### type

미입력시 모든 타입의 웹툰 정보를 요청합니다.

요청 가능한 `type`은 다음과 같습니다.

- `week` 연재중인 웹툰 정보
- `finished` 완결된 웹툰의 정보

### day

`type`이 `week`인 경우에만 가능합니다.

미입력시 모든 요일의 웹툰 정보를 요청합니다.

요청 가능한 `day`는 다음과 같습니다.

- `mon` 월요일 웹툰 정보
- `tue` 화요일 웹툰 정보
- `wed` 수요일 웹툰 정보
- `thu` 목요일 웹툰 정보
- `fri` 금요일 웹툰 정보
- `sat` 토요일 웹툰 정보
- `sun` 일요일 웹툰 정보
