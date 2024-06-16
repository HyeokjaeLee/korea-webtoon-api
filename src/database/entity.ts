import { Entity, Column, PrimaryColumn } from 'typeorm';

export type UpdateDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type Provider = 'KAKAO' | 'NAVER' | 'KAKAO_PAGE' | 'RIDI';

@Entity()
export class NormalizedWebtoon {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  provider: Provider;

  @Column('simple-array')
  updateDays: UpdateDay[];

  @Column()
  url: string;

  @Column('simple-array')
  thumbnail: string[];

  @Column({ default: false })
  isEnd: boolean;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: false })
  isUpdated: boolean;

  @Column()
  ageGrade: number;

  @Column({ nullable: true, type: 'int' })
  freeWaitHour: number | null;

  @Column('simple-array')
  authors: string[];
}

@Entity()
export class DataInfo {
  @PrimaryColumn()
  provider: Provider;

  @Column({ type: 'datetime' })
  updateStartAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  updateEndAt: Date | null;

  @Column({ default: true })
  isHealthy: boolean;
}

@Entity()
export class NaverWebtoon extends NormalizedWebtoon {}

@Entity()
export class KakaoWebtoon extends NormalizedWebtoon {}

@Entity()
export class KakaoPageWebtoon extends NormalizedWebtoon {}
