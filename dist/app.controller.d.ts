import { AppService } from './app.service';
declare class WebtoonController {
    platform: PlatformObject;
    combined_weekWebtoon: Webtoon[];
    allWebtoon: Webtoon[];
    constructor(platform: PlatformObject);
    weekday(day: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
    finished(): Webtoon[];
    all(): Webtoon[];
    test(): PlatformObject;
}
export declare class SearchController {
    private readonly appService;
    allWebtoon: Webtoon[];
    constructor(appService: AppService);
    search(search: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
}
export declare class NaverController extends WebtoonController {
    private readonly appService;
    constructor(appService: AppService);
}
export declare class KakaoController extends WebtoonController {
    private readonly appService;
    constructor(appService: AppService);
}
export declare class KakaoPageController extends WebtoonController {
    private readonly appService;
    constructor(appService: AppService);
}
export declare class AllPlatformController extends WebtoonController {
    private readonly appService;
    constructor(appService: AppService);
}
export {};
