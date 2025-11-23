import { c } from '@/helpers.ts';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function request(method: string, data: any) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const postData = JSON.stringify(data);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      c.error('HTTP error!', response.status, response, responseText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    if (json.ok === true) {
      c.log('Telegram request was successful!');
      // if (process.env.NODE_ENV !== "prod") console.info(json);
    } else {      
      c.error('Telegram request failed. Check the response:', json);
    }
    return json;
  } catch (error) {
    console.error('Telegram request error:', error);
  }
}

function sendMessage(text: string) {
  return request('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });
}

export function notify(text: string) {
  return sendMessage(text);
}
