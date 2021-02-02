interface A_webtoon_info {
  title: string;
  artist: string;
  url: string;
  img: string;
  service: string;
  state: string;
  weekday: number;
}

const weekday: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export type { A_webtoon_info };
export { weekday };
