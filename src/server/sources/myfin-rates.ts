import { fetchHtml } from '@/server/utils.ts';
import { TLot } from '@/types.ts';

const url = 'https://admin.myfin.by/outer/informer/minsk';
const src = {
  name: 'Лучшие курсы myfin.by',
  needsUrl: false,
  run,
};

async function run() {
  const { $ } = await fetchHtml(url);
  const lots: Omit<TLot, 'id'>[] = [];
  const $v = $('tr.bordered td');
  lots.push({ key: 'USD', data: { rate: $v.eq(7).text() } });
  lots.push({ key: 'EUR', data: { rate: $v.eq(10).text() } });
  return lots;
}

export default src;
