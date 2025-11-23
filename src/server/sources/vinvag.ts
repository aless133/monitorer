import type { TLot } from '@/types.ts';
import { fetchJson } from '@/server/utils.ts';
import md5 from 'blueimp-md5';

const url = 'https://vagvin.ru/static/brands.json';
const src = {
  name: 'vagvin',
  needsUrl: false,
  run,
};

async function run() {
  const { data } = await fetchJson(url);
  const lots: Omit<TLot, 'id'>[] = [];
  // console.log(data.subchecks);
  // console.log(Array.isArray(data.subchecks.data));
  data.subchecks.data.forEach((el: { availableBrands: any; languages: any; commands: any }) => {
    lots.push({
      key: md5(JSON.stringify(el)),
      data: {
        availableBrands: el.availableBrands,
        languages: el.languages,
        commands: el.commands,
      },
    });
  });
  return lots;
}

export default src;
