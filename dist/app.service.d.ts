export declare class AppService {
    webtoon: {
        naver: PlatformObject;
        kakao: PlatformObject;
        kakaoPage: PlatformObject;
    };
    private platformList;
    constructor();
    private update_data;
    getAllWebtoon(): {
        weekWebtoon: any[];
        finishedWebtoon: any[];
    };
}
