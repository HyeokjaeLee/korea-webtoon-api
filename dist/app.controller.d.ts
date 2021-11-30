import { AppService } from './app.service';
export declare class SearchController {
    private readonly appService;
    constructor(appService: AppService);
    search(search: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
}
declare class WebtoonController {
    private readonly appService;
    constructor(appService: AppService, platform: string);
    platform: string;
    weekday(day: string): Webtoon[] | {
        statusCode: number;
        message: string;
        error: string;
    };
    finished(): any;
    all(): Webtoon[];
}
export declare class NaverController extends WebtoonController {
    private readonly _appService;
    constructor(_appService: AppService);
}
export declare class KakaoController extends WebtoonController {
    private readonly _appService;
    constructor(_appService: AppService);
}
export declare class KakaoPageController extends WebtoonController {
    private readonly _appService;
    constructor(_appService: AppService);
}
export declare class AllPlatformController extends WebtoonController {
    private readonly _appService;
    constructor(_appService: AppService);
}
export {};
