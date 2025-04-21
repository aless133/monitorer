import { THistory, TTarget } from "@/types.ts";
import { notify as telegramNotify } from '@/server/notify/telegram.ts';
import { br2nl, c, strip_tags } from '@/helpers.ts';

export function notify(text: string, data?: any) {
  if (data) {
    c.log(strip_tags(text), data);
    telegramNotify(br2nl(text+"<br>"+JSON.stringify(data)));
  } else {
    c.log(strip_tags(text));
    telegramNotify(br2nl(text));
  }
}
