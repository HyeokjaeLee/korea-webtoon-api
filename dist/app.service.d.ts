export declare class AppService {
    private combine_weekWebtoon;
    weekday(weekWebtoon: Webtoon[][], day: string | undefined): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
    all(platformObject: PlatformObject): Webtoon[];
    search(platformObject: PlatformObject, search: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
}
