export interface Webtoon {
  title: string | undefined;
  artist: string | undefined;
  url: string | undefined;
  img: string | undefined;
  service: string | undefined;
  weekday: number | undefined;
  additional: Additional;
}

export interface Additional {
  new: boolean;
  rest: boolean;
  up: boolean;
  adult: boolean;
}
