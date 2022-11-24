import axios from 'axios';
import { load } from 'cheerio';

export async function getHtmlData(url: string) {
  const html: { data: string } = await axios.get(url);
  return load(html.data);
}
