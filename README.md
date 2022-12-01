![header](https://capsule-render.vercel.app/api?type=rect&color=gradient&height=100&section=header&text=Korea%20Webtoon%20API&fontSize=40&fontAlign=50&fontAlignY=50)

![NODE](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)&nbsp;&nbsp;&nbsp;![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white) ![TYPESCRIPT](https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![HEROKU](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=Heroku&logoColor=white)

# **About**

여러 가지 플랫폼의 웹툰에 대한 정보를 제공하며 정보는 한시간 간격으로 갱신됩니다.

현재 정보가 제공되는 웹툰 플랫폼은 다음과 같습니다.

- 네이버웹툰
- 카카오웹툰
- 카카오페이지

# **Request**

## **웹툰 정보 요청**

조건을 만족하는 웹툰 정보들을 제공합니다.

| Method |                                     Request URL                                      | Format |
| :----: | :----------------------------------------------------------------------------------: | :----: |
|  GET   | [`https://korea-webtoon-api.herokuapp.com`](https://korea-webtoon-api.herokuapp.com) |  JSON  |

### **Request Parameter**

|     Name      | Required |  Type  | Default | Description                                                                                                                                                                                                   |
| :-----------: | :------: | :----: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   **page**    |    N     | number |    0    | 페이지 번호                                                                                                                                                                                                   |
|  **perPage**  |    N     | number |   10    | 한 페이지 결과 수                                                                                                                                                                                             |
|  **service**  |    N     | string |    -    | 웹툰 공급자<ul><li>`naver` 네이버 웹툰</li><li>`kakao` 카카오 웹툰</li><li>`kakaoPage` 카카오페이지</li></ul>                                                                                                 |
| **updateDay** |    N     | string |    -    | 웹툰 업데이트 구분<ul><li>`mon` 월</li><li>`tue` 화</li><li>`wed` 수</li><li>`thu` 목</li><li>`fri` 금</li><li>`sat` 토</li><li>`sun` 일</li><li>`finished` 완결</li><li>`naverDaily` 네이버 Daily+</li></ul> |

### Response Sample

**https://korea-webtoon-api.herokuapp.com/?perPage=1&page=3&service=kakao&updateDay=sun**

```json
{
  "totalWebtoonCount": 5430,
  "naverWebtoonCount": 2032,
  "kakaoWebtoonCount": 1542,
  "kakaoPageWebtoonCount": 1856,
  "updatedWebtoonCount": 56,
  "createdWebtoonCount": 0,
  "lastUpdate": "2022-12-01T00:41:49.961Z",
  "isLastPage": false,
  "webtoons": [
    {
      "_id": "638250d60d980db259c72c02",
      "webtoonId": 2000000003093,
      "title": "스포일러 보는 드라마 작가",
      "author": "원아",
      "url": "https://webtoon.kakao.com/content/스포일러-보는-드라마-작가/3093",
      "img": "https://kr-a.kakaopagecdn.com/P/C/3093/c1/2x/b973723c-39bb-4d69-b614-1b07ba82e2f6.png",
      "service": "kakao",
      "updateDays": ["sun"],
      "fanCount": null,
      "searchKeyword": "스포일러보는드라마작가원아",
      "additional": {
        "new": true,
        "rest": false,
        "up": true,
        "adult": false,
        "singularityList": []
      }
    }
  ]
}
```

## **웹툰 검색**

대소문자, 특수문자를 구분하지 않는 특정 키워드를 포함한 제목, 작가를 가진 웹툰 정보를 제공합니다.

| Method |                                            Request URL                                             | Format |
| :----: | :------------------------------------------------------------------------------------------------: | :----: |
|  GET   | [`https://korea-webtoon-api.herokuapp.com/search`](https://korea-webtoon-api.herokuapp.com/search) |  JSON  |

### **Request Parameter**

|    Name     | Required |  Type  | Default | Description |
| :---------: | :------: | :----: | :-----: | ----------- |
| **keyword** |    Y     | string |    -    | 검색 키워드 |

### Response Sample

**https://korea-webtoon-api.herokuapp.com/search?keyword=갓오브하이스쿨**

```json
{
  "totalWebtoonCount": 5430,
  "naverWebtoonCount": 2032,
  "kakaoWebtoonCount": 1542,
  "kakaoPageWebtoonCount": 1856,
  "updatedWebtoonCount": 43,
  "createdWebtoonCount": 0,
  "lastUpdate": "2022-12-01T01:41:51.421Z",
  "webtoons": [
    {
      "_id": "63824f5799624044b9326032",
      "webtoonId": 1000000318995,
      "title": "갓 오브 하이스쿨",
      "author": "박용제",
      "url": "https://m.comic.naver.com/webtoon/list?titleId=318995",
      "img": "https://image-comic.pstatic.net/webtoon/318995/thumbnail/thumbnail_IMAG21_38f18e00-09f2-4a0c-b36a-3aa56dfe0b3b.jpg",
      "service": "naver",
      "updateDays": ["finished"],
      "fanCount": 100,
      "searchKeyword": "갓오브하이스쿨박용제",
      "additional": {
        "new": false,
        "adult": false,
        "rest": false,
        "up": false,
        "singularityList": []
      }
    }
  ]
}
```

# **Response Element**

|           Name            | Required |  Type   | Default | Description                                                                                                                                                                                                        |                                                                                                                     |
| :-----------------------: | :------: | :-----: | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
|   **totalWebtoonCount**   |    Y     | number  |    0    | 전체 웹툰 수                                                                                                                                                                                                       |
|   **naverWebtoonCount**   |    Y     | number  |    0    | 네이버 웹툰 수                                                                                                                                                                                                     |
|   **kakaoWebtoonCount**   |    Y     | number  |    0    | 카카오 웹툰 수                                                                                                                                                                                                     |
| **kakaoPageWebtoonCount** |    Y     | number  |    0    | 카카오 페이지 웹툰 수                                                                                                                                                                                              |
|      **isLastPage**       |    N     | boolean |  null   | 마지막 페이지 여부                                                                                                                                                                                                 |
|      **lastUpdate**       |    N     | string  |  null   | 마지막 갱신 시간                                                                                                                                                                                                   |
|  **updatedWebtoonCount**  |    Y     | number  |    0    | 마지막 갱신에서 정보가 변경된 웹툰 수                                                                                                                                                                              |
|  **createdWebtoonCount**  |    Y     | number  |    0    | 마지막 갱신에서 정보가 새롭게 생성된 웹툰 수                                                                                                                                                                       |
|         **\_id**          |    Y     | string  |    -    | 객체 ID                                                                                                                                                                                                            |
|       **webtoonId**       |    Y     | number  |    -    | 웹툰 고유 ID <ul><li>**네이버** 1000000000000~ </li><li>**카카오** 2000000000000~</li><li>**카카오 페이지** 3000000000000~</li></ul>                                                                               |
|         **title**         |    Y     | string  |    -    | 웹툰 제목                                                                                                                                                                                                          |
|        **author**         |    Y     | string  |    -    | 웹툰 작가                                                                                                                                                                                                          |
|          **url**          |    Y     | string  |    -    | 웹툰 URL                                                                                                                                                                                                           |
|          **img**          |    Y     | string  |    -    | 웹툰 썸네일 이미지                                                                                                                                                                                                 |
|        **service**        |    Y     | string  |    -    | 웹툰 공급자<ul><li>`naver` 네이버 웹툰</li><li>`kakao` 카카오 웹툰</li><li>`kakaoPage` 카카오페이지</li></ul>                                                                                                      |
|      **updateDays**       |    Y     |  array  |    -    | 웹툰 업데이트 구분 목록<ul><li>`mon` 월</li><li>`tue` 화</li><li>`wed` 수</li><li>`thu` 목</li><li>`fri` 금</li><li>`sat` 토</li><li>`sun` 일</li><li>`finished` 완결</li><li>`naverDaily` 네이버 Daily+</li></ul> |
|       **fanCount**        |    N     | number  |  null   | 웹툰의 팬 수<br/>10,000 단위 이며 10,000 이하일 경우 null                                                                                                                                                          |
|     **searchKeyword**     |    Y     | string  |    -    | 검색에 사용되는 키워드                                                                                                                                                                                             |
|          **new**          |    Y     | boolean |  false  | 신규 웹툰 여부                                                                                                                                                                                                     |
|         **adult**         |    Y     | boolean |  false  | 성인 웹툰 여부                                                                                                                                                                                                     |
|         **rest**          |    Y     | boolean |  false  | 웹툰 휴재                                                                                                                                                                                                          |
|          **up**           |    Y     | boolean |  false  | 웹툰 신규 회차 업로드                                                                                                                                                                                              |
|    **singularityList**    |    Y     |  array  |   []    | ["waitFree", "over15"]                                                                                                                                                                                             | 웹툰 기타 정보 리스트<ul><li>`over15` 15세 이상</li><li>`free` 완전 무료</li><li>`waitFree` 기다리면 무료</li></ul> |
