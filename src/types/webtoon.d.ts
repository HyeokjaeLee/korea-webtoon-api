namespace WebtoonObject {
  /**플랫폼 표준 웹툰 정보
   * @title 제목
   * @author 작가명
   * @img 대표이미지
   * @url 웹툰 url
   */
  interface Basic {
    title: string;
    author: string;
    url: string;
    img: string;
    service: string;
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

  interface CrawlerOutput extends Basic {
    week: number;
    additional: Additional;
  }

  interface Dto extends Basic {
    _id: string;
    week: number[];
    additional: Additional;
  }
}
