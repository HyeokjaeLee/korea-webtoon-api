![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Korea%20Webtoon%20API&fontSize=40&fontAlign=50&fontAlignY=50)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

## About

여러 가지 플랫폼의 웹툰에 대한 정보를 제공합니다.

현재 정보가 제공되는 웹툰 플랫폼은 다음과 같습니다.

- 네이버웹툰
- 카카오웹툰
- 카카오페이지

### ⚠️ Notice

해당 API는 Toy Projects를 위한 API입니다.

**Heroku 서버가 Sleep 상태일 경우 첫 요청시 1분 가량 소요됩니다.**

## API Request

### 📌 URL

| Method | Request URL | Format |
| :----: | :-----: | :----: |
|  GET   | [`https://korea-webtoon-api.herokuapp.com`](https://korea-webtoon-api.herokuapp.com) |  JSON  |

### 📩 Path Parameter

#### `/`

Webtoon 정보 업데이트 기록을 제공합니다.

#### `/search`

키워드 검색을 제공합니다.

#### `/{platform}/{type}`

조건에 맞는 웹툰 정보들을 제공합니다.

| Name | Required | Type | Description |
| :----: | :------: | :----: | ---------- |
| `platform` | Y | string | 요청할 웹툰의 플랫폼 입니다.<br/>요청 가능한 은 다음과 같습니다.<ul><li>`search` 검색</li><li>`all` 모든 플랫폼</li><li>`naver` 네이버웹툰</li><li>`kakao` 카카오웹툰</li><li>`kakao-page` 카카오페이지</li></ul> |
|                                                                                  `type`                                                                                   |    N     | string | 요청할 웹툰의 타입입니다.<br/>미입력시 모든 타입의 웹툰 정보를 요청합니다.<br/>요청 가능한 `type`은 다음과 같습니다.<ul><li>`week` 연재중</li><li>`finished` 완결</li></ul> |

### 🔖 Request variable

#### `/search`
|   Name   | Required |  Type  | Description |
| :------: | :------: | :----: | ----------- |
| `keyword` |    Y     | string | 검색할 키워드입니다.<br/>띄어쓰기, 대소문자 구분 없이 작가 혹은 제목으로 검색 가능합니다.  |

#### `/{platform}/week`
|   Name   | Required |  Type  | Description |
| :------: | :------: | :----: | ----------- |
|  `day`   |    N     | integer | 요청할 웹툰의 요일입니다.<br/>미입력시 모든 요일의 웹툰 정보를 요청합니다.</br>요청 가능한 `day`는 다음과 같습니다.<ul><li>`0` 월</li><li>`1` 화</li><li>`2` 수</li><li>`3` 목</li><li>`4` 금</li><li>`5` 토</li><li>`6` 일</li></ul> |


### 🔍 Request sample (Javascript)

```javascript
async function get_webtoonData(params) {
  const res = await fetch(`https://korea-webtoon-api.herokuapp.com/${params}`, {
      method: 'GET',
    }),
    json = await res.json();
  console.log(json);
  return json;
}

const naverMon = get_webtoonData('naver/week?day=1');
const juhominWebtoon = get_webtoonData('search?keyword=주호민');
```

## API Response

### 🔑 Key

#### `/`

|    name    |  type   | Description |
| :--------: | :-----: | ----------- |
| _id | string | 업데이트 정보 고유 ID |
| date | string | 업데이트 시간 |
| total | integer | 전체 웹툰 수 |
| removed | integer | 삭제된 웹툰 수 |
| changed | integer | 정보가 바뀐 웹툰 수 |
| new | integer | 새로 추가된 웹툰 수 |

#### `/search` & `/{platform}/{type}`

|    name    |  type   | Description |
| :--------: | :-----: | ----------- |
|   _id    | string  | 웹툰 고유 ID |
|   title    | string  | 제목 |
|   author   | string  | 작가 |
|    img     | string  | Thumbnail img URL |
|    url     | string  | 웹툰 페이지 URL |
|  service   | string  | 서비스 플랫폼 |
|    week    | array | 0~7의 수를 가지는 요일 정보 배열<br/>`0~6` 월~일<br/>`7` 완결 |
| additional | object  | 추가적인 정보 |
|    new     | boolean | 신규 |
|    rest    | boolean | 휴재 |
|     up     | boolean | 새로운 회차가 업로드 |
|   adult    | boolean | 19세 이상 |

### 🔍 Response sample

#### `/`

```JSON
{
  "_id": "61c8709a879993109015b85f",
  "date": "2021-12-26T13:39:38.229Z",
  "total": 4689,
  "removed": 0,
  "changed": 0,
  "new": 4689
},
```

#### `/search` & `/{platform}/{type}`

```JSON
{
  "_id":"참교육__채용택,한가람__naver",
  "title": "참교육",
  "author": "채용택,한가람",
  "url": "https://m.comic.naver.com/webtoon/list?titleId=758037&week=mon",
  "img": "https://image-comic.pstatic.net/webtoon/758037/thumbnail/thumbnail_IMAG19_67290a02-fe7f-448d-aed9-6ec88e558088.jpg",
  "service": "naver",
  "week": [0],
  "additional": {
    "new": false,
    "adult": false,
    "rest": true,
    "up": false
  }
}
```

### 🐛 Error

| statusCode | message | error |
| :--------: | :-----: | :---: |
| 400 | Invalid day value | Not Found |
| 404 | Cannot GET {path} | Not Found |
| 404 | There is no webtoon that matches. | Not Found |
| 500 | Required request variable does not exist or request variable name is invalid | Error |

## Demo Projects

### 💻 [WEBTOON HUB](https://github.com/HyeokjaeLee/webtoon-hub)
