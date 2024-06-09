import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { NormalizedWebtoon, DataInfo } from './entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [NormalizedWebtoon, DataInfo],
  synchronize: true,
  logging: false,
});
