import { apiUrl } from '@/globals.ts';
import db from '@/server/storage/storage.ts';
import storage from '@/server/storage/storage.ts';
import { getSource } from './sources.ts';
console.log(apiUrl);

const loopRun = () => {
  const time = Math.floor(Date.now() / 1000);
  const targets = storage
    .list('targets')
    .data.filter((t) => !!t.active && (!t.last_run || t.last_run + t.interval < time));
  console.log('loop', Date.now());

  const lots = db.map('lots');

  targets.forEach(async (target) => {
    const src = getSource(target.source);
    if (src) {
      const res = await src.run(target.url);
      console.log(res);
    } else {
      console.error('Source not found', target.id, target.source);
    }    
  });
};

export { loopRun };
