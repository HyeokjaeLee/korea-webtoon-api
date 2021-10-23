import type { Webtoon, Additional } from '../types/webtoon';
const kakao_webtoon_url = 'https://webtoon.kakao.com/content/';
import * as fs from 'fs';
import axios from 'axios';
import * as _ from 'lodash';

type Original = 'novel' | 'webtoon';

interface KakaoWebtoon {
  content: {
    title: string;
    id: number;
    seoId: string;
    authors: { name: string; type: 'AUTHOR' | 'ILLUSTRATOR'; order: number }[];
  };
  additional: Additional;
}

const kakaoWebtoonAPI = (original: Original, completed: boolean) => {
  const URL = 'https://gateway-kw.kakao.com/section/v1/';
  const _original = (_original: 'channel' | 'general') =>
    original === 'novel' ? 'novel' : _original;
  const completed_url = `sections?placement=${_original('channel')}_completed`;
  const weekdays_url = `pages/${_original('general')}-weekdays`;
  return completed ? URL + completed_url : URL + weekdays_url;
};

const img_url = (id: number) =>
  `https://kr-a.kakaopagecdn.com/P/C/${id}/sharing/2x/eacb00ec-9034-42cb-a533-7c7690741113.jpg`;

const classify_webtoonData = (dataArr: KakaoWebtoon[], weeknum: number) =>
  dataArr.map((data) => {
    const { content, additional } = data;
    const authors = _.uniqBy(content.authors, 'name');
    const onlyAuthorIllustrator = authors.filter(
      (author) => author.type === 'AUTHOR' || author.type === 'ILLUSTRATOR',
    );
    const authorsName = onlyAuthorIllustrator.map((author) => author.name);
    return {
      title: data.content.title,
      artist: authorsName.join(', '),
      url: `${kakao_webtoon_url + data.content.seoId}/${data.content.id}`,
      img: img_url(content.id),
      service: 'kakao',
      weekday: weeknum,
      additional: {
        new: additional.new,
        rest: additional.rest,
        up: additional.up,
        adult: additional.adult,
      },
    };
  });

const get_weekdayWebtoon = async (original: Original): Promise<Webtoon[][]> => {
  const { data }: any = await axios.get(kakaoWebtoonAPI(original, false));
  return data.data.sections.map((sections, weeknum: number) =>
    classify_webtoonData(sections.cardGroups[0].cards, weeknum),
  );
};

async function get_completedWebtoon(original: Original): Promise<Webtoon[]> {
  const { data }: any = await axios.get(kakaoWebtoonAPI(original, true));
  return classify_webtoonData(data.data[0].cardGroups[0].cards, 7);
}

get_completedWebtoon('novel');
