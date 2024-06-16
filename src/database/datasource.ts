import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  NaverWebtoon,
  KakaoWebtoon,
  KakaoPageWebtoon,
  DataInfo,
  NormalizedWebtoon,
} from './entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [
    NaverWebtoon,
    KakaoWebtoon,
    KakaoPageWebtoon,
    NormalizedWebtoon,
    DataInfo,
  ],
  //! 초기화시 'NormalizedWebtoon'을 뷰로 생성하기 때문에 synchronize: true로 설정하면 안됨
  synchronize: false,
  logging: false,
});
