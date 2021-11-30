import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';

enum week {
  'mon' = 0,
  'tue' = 1,
  'wed' = 2,
  'thu' = 3,
  'fri' = 4,
  'sat' = 5,
  'sun' = 6,
}

@Injectable()
export class AppService {
  private combine_weekWebtoon(weekWebtoon: Webtoon[][]) {
    const combinedWeekWebtoon: Webtoon[] = [];
    weekWebtoon.forEach((webtoon) => {
      combinedWeekWebtoon.push(...webtoon);
    });
    return combinedWeekWebtoon;
  }

  weekday(weekWebtoon: Webtoon[][], day: string | undefined) {
    if (!day) return this.combine_weekWebtoon(weekWebtoon);
    if (0 <= week[day] && week[day] <= 6) return weekWebtoon[week[day]];
    else
      return {
        statusCode: 400,
        message: 'Invalid day value',
        error: 'Not Found',
      };
  }

  all(platformObject: PlatformObject) {
    const combinedWeekWebtoon = this.combine_weekWebtoon(
      platformObject.weekWebtoon,
    );
    return platformObject.finishedWebtoon.concat(combinedWeekWebtoon);
  }

  search(platformObject: PlatformObject, search: string) {
    const searchResult: Webtoon[] = [];
    const allWebtoon = this.all(platformObject);
    if (!search)
      return {
        statusCode: 500,
        message:
          'Required request variable does not exist or request variable name is invalid',
        error: 'Error',
      };
    const filteredWebtoon = allWebtoon.filter((webtoon) => {
      const str4search = (
        webtoon.title.toLowerCase() + webtoon.author.toLowerCase()
      ).replace(/\s/g, '');
      return str4search.includes(search);
    });
    if (filteredWebtoon.length === 0)
      return {
        statusCode: 404,
        message: 'No webtoon found',
        error: 'Not Found',
      };

    return uniqBy(filteredWebtoon, (e) => e.title + e.author).map((webtoon) => {
      delete webtoon.week;
      return webtoon;
    });
  }
}
