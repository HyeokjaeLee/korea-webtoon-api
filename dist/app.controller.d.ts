import { AppService } from './app.service';
declare class WebtoonController {
    platform: PlatformObject;
    private combine_weekWebtoon;
    weekday(day: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
    search(keyword: string): Webtoon[];
    finished(): Webtoon[];
    all(): Webtoon[];
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
export declare class RootController extends WebtoonController {
    private readonly appService;
    constructor(appService: AppService);
}
export {};
