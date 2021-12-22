![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Korea%20Webtoon%20API&fontSize=40&fontAlign=50&fontAlignY=50)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

## About

여러 가지 플랫폼의 웹툰에 대한 정보를 제공합니다.

현재 정보가 제공되는 웹툰 플랫폼은 다음과 같습니다.

- 네이버웹툰
- 카카오웹툰
- 카카오페이지

### ⚠️ Notice

해당 API는 Toy Projects를 위한 API입니다.

**Heroku 서버가 Sleep 상태일 경우 첫 요청시 1분 가량 소요됩니다.**

외부 정보를 불러오기 전까지 **로컬 파일의 데이터**를 제공합니다.

## API Request

### 📌 URL

| Method |                                                       Request URL                                                       | Format |
| :----: | :---------------------------------------------------------------------------------------------------------------------: | :----: |
|  Get   | [`https://korea-webtoon-api.herokuapp.com/{platform}/{type}`](https://korea-webtoon-api.herokuapp.com/all/week?day=fri) |  JSON  |

### 📩 URL Params

|    Name    | Required |  Type  | Description                                                                                                                                                                                           |
| :--------: | :------: | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform` |    Y     | string | 요청할 웹툰의 플랫폼 입니다.<br/>요청 가능한 `platform`은 다음과 같습니다.<ul><li>`all` 모든 플랫폼</li><li>`naver` 네이버웹툰</li><li>`kakao` 카카오웹툰</li><li>`kakao-page` 카카오페이지</li></ul> |
|   `type`   |    N     | string | 요청할 웹툰의 타입입니다.<br/>미입력시 모든 타입의 웹툰 정보를 요청합니다.<br/>요청 가능한 `type`은 다음과 같습니다.<ul><li>`week` 연재중</li><li>`finished` 완결</li></ul>                           |

### 🔖 Request variable

|   Name   | Required |  Type  | Description                                                                                                                                                                                                                                                                                                                                     |
| :------: | :------: | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  `day`   |    N     | string | 요청할 웹툰의 요일입니다.<br/>`type`이 `week`인 경우에만 가능합니다.<br/>미입력시 모든 요일의 웹툰 정보를 요청합니다.</br>요청 가능한 `day`는 다음과 같습니다.<ul><li>`mon` 월 week=0</li><li>`tue` 화 week=1</li><li>`wed` 수 week=2</li><li>`thu` 목 week=3</li><li>`fri` 금 week=4</li><li>`sat` 토 week=5</li><li>`sun` 일 week=6</li></ul> |
| `search` |    Y     | string | 검색할 키워드입니다.<br/> Root endpoint에서만 가능합니다.<br/> 웹툰의 작가, 제목 검색을 지원합니다.                                                                                                                                                                                                                                             |

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

const naverMon = get_webtoonData('naver/week?day=mon');
const juhominWebtoon = get_webtoonData('?search=주호민');
```

## API Response

### 🔑 Key

|    name    |  type   | Description                          |
| :--------: | :-----: | ------------------------------------ |
|   title    | string  | 제목                                 |
|   author   | string  | 작가                                 |
|    img     | string  | Thumbnail img URL                    |
|    url     | string  | 웹툰 페이지 URL                      |
|  service   | string  | 서비스 플랫폼                        |
|    week    | integer | 요일 번호 0 ~ 6 (월 ~ 일)<br/>완결 7 |
| additional | object  | 추가적인 정보                        |
|    new     | boolean | 신규                                 |
|    rest    | boolean | 휴재                                 |
|     up     | boolean | 새로운 회차가 업로드                 |
|   adult    | boolean | 19세 이상                            |

### 🔍 Response sample

```JSON
{
    "title": "참교육",
    "author": "채용택,한가람",
    "url": "https://m.comic.naver.com/webtoon/list?titleId=758037&week=mon",
    "img": "https://image-comic.pstatic.net/webtoon/758037/thumbnail/thumbnail_IMAG19_67290a02-fe7f-448d-aed9-6ec88e558088.jpg",
    "service": "naver",
    "week": 0,
    "additional": {
      "new": false,
      "adult": false,
      "rest": true,
      "up": false
    }
}
```

### 🐛 Error

| statusCode |                                   message                                    |   error   |
| :--------: | :--------------------------------------------------------------------------: | :-------: |
|    400     |                              Invalid day value                               | Not Found |
|    404     |                              Cannot GET {path}                               | Not Found |
|    404     |                               No webtoon found                               | Not Found |
|    500     | Required request variable does not exist or request variable name is invalid |   Error   |

## Demo Projects

### 💻 [WEBTOON HUB](https://github.com/HyeokjaeLee/webtoon-hub)
