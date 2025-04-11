import { fetchHtml } from '@/server/utils.ts';
import { TLot } from '@/types.ts';

const url = 'https://outvin.com';
const src = {
  name: 'outvin',
  needsUrl: false,
  run,
};

async function run() {
  const { $ } = await fetchHtml(url);
  const lots: Omit<TLot, 'id'>[] = [];
  $('.h5 a.badge.badge-success').each((i, el) => {
    const key = $(el).text();
    lots.push({ key, data: { brand: key } });
  });
  return lots;
}

export default src;
