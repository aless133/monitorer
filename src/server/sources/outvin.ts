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
  const lots: Record<string, TLot> = {};
  $('.h5 a.badge.badge-success').each((i, el) => {
    const id = $(el).text();
    lots[id] = { id, data: { brand: id } };
  });
  return lots;
}

export default src;
