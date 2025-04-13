import db from '@/server/storage/storage.ts';
import storage from '@/server/storage/storage.ts';
import { getSource } from './sources.ts';
import { TChanges, THistory, TLot, TLotNew, TTarget } from '@/types.ts';

function loopRun() {
  const time = Math.floor(Date.now() / 1000);
  const targets = storage.list('targets').filter((t) => !!t.active && (!t.last_run || t.last_run + t.interval <= time));
  console.log(new Date().toLocaleString(), 'loop');

  const allLots = db.list('lots');

  targets.forEach(async (target) => {
    const src = getSource(target.source);
    const lots = allLots.filter((l) => l.target === target.id);
    if (src) {
      try {
        const res = await src.run(target.url);
        res.forEach((r) => {
          r.target = target.id;
        });
        if (lots.length == 0) {
          notify(target, '1st run, adding', res.length);
          res.forEach((r) => {
            db.create('lots', r);
          });
        } else {
          const changes = findChanges(lots, res);
          changes.added.forEach((c,i) => {
            notify(target, 'added', c);
            db.create('lots', c);
          });
          changes.removed.forEach((c) => {
            notify(target, 'removed', c);
            db.delete('lots', c.id);
          });
          changes.updated.forEach((c) => {
            notify(target, 'updated', c);
            db.update('lots', c.id, { data: c.new });
          });
          const now = Math.floor(Date.now() / 1000);
          db.update('targets', target.id, { last_run: now });
          if (changes.added.length == 0 && changes.removed.length == 0 && changes.updated.length == 0)
            console.log(target, 'nothing changed');
          else {
            const history = {
              dt: now,
              target: target.id,
              changes,
            };
            db.create('history', history);
          }
        }
      } catch (err) {
        console.error('looo... oops', err);
      }
    } else {
      console.error('Source not found', target.id, target.source);
    }
  });
}

function findChanges(oldData: TLot[], newData: TLotNew[]) {
  const changes: TChanges = { added: [], removed: [], updated: [] };

  const oldMap = new Map(oldData.map((item) => [item.key, item]));
  const newMap = new Map(newData.map((item) => [item.key, item]));

  newData.forEach((item) => {
    if (!oldMap.has(item.key)) changes.added.push(item);
  });

  oldData.forEach((item) => {
    if (!newMap.has(item.key)) changes.removed.push(item);
  });

  oldData.forEach((oldItem) => {
    const newItem = newMap.get(oldItem.key);
    if (newItem) {
      const oldDataStr = JSON.stringify(oldItem.data);
      const newDataStr = JSON.stringify(newItem.data);

      if (oldDataStr !== newDataStr) {
        changes.updated.push({
          id: oldItem.id,
          key: oldItem.key,
          old: oldItem.data,
          new: newItem.data,
        });
      }
    }
  });
  return changes;
}

function notify(target: TTarget, text: string, data?: any) {
  console.log(new Date().toLocaleString(), target.id, target.source, target.url, text, data);
}

export { loopRun };
