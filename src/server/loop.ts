import getDB from '@/server/storage/storage.ts';
import { getSource } from '@/server/sources/sources.ts';
import { TChanges, THistory, TLot, TLotNew, TTarget } from '@/types.ts';
import { notify as telegramNotify } from '@/server/notify/telegram.ts';
const db = getDB();

async function loopRun() {
  const time = Math.floor(Date.now() / 1000);
  console.log(new Date().toLocaleString(), 'loop');
  const targets = await db.list('targets', { active: true, next_run: { operator: '<=', value: time } });
  if (!targets.length) {
    console.log('tagets empty');
    return;
  }

  const allLots = await db.list('lots', { target: { operator: 'in', value: targets.map((t) => t.id) } });

  targets.forEach(async (target) => {
    const src = getSource(target.source);
    const lots = allLots.filter((l) => l.target === target.id);
    if (src) {
      try {
        const now = Math.floor(Date.now() / 1000);
        const targetUpdate: Partial<TTarget> = { last_run: now, next_run: now + target.interval };
        const res = await src.run(target.url);
        console.log('res',res);
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
          changes.added.forEach((c, i) => {
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
          if (changes.added.length == 0 && changes.removed.length == 0 && changes.updated.length == 0)
            console.log(target.source, 'nothing changed');
          else {
            targetUpdate.last_update = now;
            const history = {
              dt: now,
              target: target.id,
              changes,
            };
            db.create('history', history);
          }
        }
        console.log('targetUpdate',targetUpdate);
        db.update('targets', target.id, targetUpdate);
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
  const n = { text, target, data };
  telegramNotify(JSON.stringify(n));
}

export { loopRun };
