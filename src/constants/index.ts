export * from './routes';

export const DOMAIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://korea-webtoon-api-cc7dda2f0d77.herokuapp.com';
