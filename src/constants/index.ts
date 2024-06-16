export * from './routes';

export const DOMAIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://korea-webtoon-api.herokuapp.com';
