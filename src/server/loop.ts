import getDB from '@/server/storage/storage.ts';
import { getSource } from '@/server/sources/sources.ts';
import { c, time } from '@/helpers.ts';
import { TChanges, THistory, TLot, TLotData, TLotNew, TTarget } from '@/types.ts';
import { notify } from './notify/notify.ts';
const db = getDB();

async function loopRun() {
  const now = time();
  c.log('loop');
  const targets = await db.list('targets', { active: true, next_run: { operator: '<=', value: now } });
  if (!targets.length) {
    c.log('targets empty');
    return;
  }
  const lots = await db.list('lots', { target: { operator: 'in', value: targets.map((t) => t.id) } });
  targets.forEach((t) => targetRun(t, lots, now));
}

async function targetRunSingle(id: string) {
  const target = await db.get('targets', id);
  const lots = await db.list('lots', { target: target.id });
  const now = time();
  return targetRun(target, lots, now);
}

async function targetRun(target: TTarget, lots: TLot[], now: number) {
  const src = getSource(target.source);
  const tLots = lots.filter((l) => l.target === target.id);
  if (!src) {
    c.error('Source not found', target);
    return;
  }
  try {
    const targetUpdate: Partial<TTarget> = { last_run: now, next_run: now + target.interval };
    const res = await src.run(target.url);
    res.forEach((r) => {
      r.target = target.id;
    });
    if (tLots.length == 0) {
      notify(target.source + ' 1st run, adding ' + res.length);
      res.forEach(async (r) => {
        await db.create('lots', r);
      });
    } else {
      const changes = findChanges(tLots, res);
      changes.added.forEach(async (c, i) => {
        const lot = await db.create('lots', c);
        const hist = await db.create('history', {
          dt: now,
          target: target.id,
          lot: lot.id,
          key: lot.key,
          new: lot.data,
        });
        notifyHist(target, hist);
      });
      changes.removed.forEach(async (c) => {
        const hist = await db.create('history', {
          dt: now,
          target: target.id,
          lot: c.id,
          key: c.key,
          old: c.data,
        });
        await db.delete('lots', c.id);
        notifyHist(target, hist);
      });
      changes.updated.forEach(async (c) => {
        const hist = await db.create('history', {
          dt: now,
          target: target.id,
          lot: c.id,
          key: c.key,
          old: c.old,
          new: c.new,
        });
        await db.update('lots', c.id, { data: c.new });
        notifyHist(target, hist);
      });
      if (changes.added.length == 0 && changes.removed.length == 0 && changes.updated.length == 0)
        c.log(target.source, 'nothing changed');
      else {
        targetUpdate.last_update = now;
      }
    }
    db.update('targets', target.id, targetUpdate);
  } catch (err) {
    c.error('looo... oops', err);
  }
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
    if (newItem && JSON.stringify(oldItem.data) !== JSON.stringify(newItem.data))
      changes.updated.push({
        id: oldItem.id,
        key: oldItem.key,
        old: oldItem.data,
        new: newItem.data,
      });
  });
  return changes;
}

export { loopRun, targetRunSingle, targetRun };

function notifyHist(target: TTarget, hist: THistory) {
  let c = `<b>${target.source}</b> `;
  if (!hist.old && hist.new) c += `${hist.key} added <br>` + histData(hist.new);
  else if (hist.old && !hist.new) c += `${hist.key} removed <br>` + histData(hist.old);
  else if (hist.old && hist.new) c += `${hist.key} changed <br>` + histChange(hist.old, hist.new);
  notify(c);
}

function histData(data: TLotData) {
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join('<br');
}
function histChange(o: TLotData, n: TLotData) {
  return Object.entries(o)
    .map(([k, v]) => `${k}: ${v} => ${n[k]}`)
    .join('<br');
}
