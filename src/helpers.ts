import { contextStore } from '@/server/context.ts';

export function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function nl2br(str: string) {
  return str.replace(/\r\n|\n\r|\r|\n/g, '<br>');
}
export function br2nl(str: string) {
  return str.replace(/<br\s*\/?>/gi, '\n');
}

export function strip_tags(input: string, allowed?: string): string {
  // Create regex based on allowed tags
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const allowedTags = allowed ? new RegExp(`^<\/?(${allowed.replace(/[<>]/g, '').split('|').join('|')})>$`, 'i') : null;

  return input.replace(tags, (match, tag) => {
    return allowedTags?.test(match) ? match : '';
  });
}


export function time(d?: Date) {
  return Math.floor((d?.getTime() ?? Date.now()) / 1000);
}

export const c = {
  log(...args: any[]) {
    const ctx = contextStore();
    if (ctx) console.log(`${new Date().toLocaleString()}`, ctx.executionId, ...args);
    else console.log(`${new Date().toLocaleString()}`, ...args);
  },
  error(...args: any[]) {
    const ctx = contextStore();
    if (ctx) console.error(`${new Date().toLocaleString()}`, ctx.executionId, ...args);
    else console.error(`${new Date().toLocaleString()}`, ...args);
  },
};
