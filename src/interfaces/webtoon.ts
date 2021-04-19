export interface A_webtoon_info {
  title: string;
  artist: string;
  url: string;
  img: string | undefined;
  service: string;
  state: string;
  weekday: number;
}
export interface WebtoonContainer {
  index: string;
  webtoon: A_webtoon_info[];
}
