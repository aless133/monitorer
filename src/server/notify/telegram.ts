import https from 'node:https';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

function request(method:string, data: any) {
  const postData = JSON.stringify(data);
  const options = {
    hostname: 'api.telegram.org', 
    path: '/bot' + token + '/' + method,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
      	const json = JSON.parse(data);
      	if (json.ok === true) {
      		console.info("Telegram request was successful!");
      		if (process.env.NODE_ENV != "prod") console.info(json);
      	} else {
      		console.error("Telegram request failed. Check the response:", json);
      	}
      } catch (error) {
      	console.error("Telegram error parsing JSON:", error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Telegram request error:', error.message);
  });

  req.write(postData);
  req.end();
}

function sendMessage(text: string) {
  console.log(token,chatId);
  return request('sendMessage', {
    chat_id: chatId,
    text: text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&'),
    parse_mode: 'MarkdownV2',
  });
}

export function notify(text: string) {
  return sendMessage(text);
}
