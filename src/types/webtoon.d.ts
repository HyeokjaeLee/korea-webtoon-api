/**플랫폼 표준 웹툰 정보
 * @title 제목
 * @author 작가명
 * @img 대표이미지
 * @url 웹툰 url
 * @weekday 요일번호 (0:월, 1:화, 2:수, 3:목, 4:금, 5:토, 6:일, 7:완결)
 * @additional 추가정보
 */
interface Webtoon {
  title: string;
  author: string;
  url: string;
  img: string;
  service: string;
  week: number;
  additional: Additional;
}

/**웹툰 추가 정보
 * @new 신규
 * @rest 휴재
 * @up 업데이트
 * @adult 성인작품
 */
interface Additional {
  new: boolean;
  rest: boolean;
  up: boolean;
  adult: boolean;
}

interface PlatformObject {
  weekWebtoon: Webtoon[][];
  finishedWebtoon: Webtoon[];
}

interface Webtoontmp {
  title: string;
  author: string;
  url: string;
  img: string;
  service: string;
  week: Array;
  additional: Additional;
}
