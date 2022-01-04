const fetch = require('node-fetch');
const fs = require('fs');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readline = require('readline-sync');
const _ = require('lodash');
let channelId, guildId;

const sendMessage = (message, token) =>
  new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'content-type': 'application/json',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        Referer: 'https://discord.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({ content: message, nonce: '', tts: false }),
      method: 'POST',
    })
      .then((r) => r.json())
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

const scrapeMessage = (token, channelId, before = null) =>
  new Promise((resolve, reject) => {
    let link = before == null ? `https://discord.com/api/v9/channels/${channelId}/messages?limit=50` : `https://discord.com/api/v9/channels/${channelId}/messages?before=${before}&limit=50`;
    fetch(link, {
      //https://discord.com/api/v9/channels/922931006976188467/messages?before=927954916729831524&limit=50
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'content-type': 'application/json',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        Referer: 'https://discord.com/channels/@me',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      method: 'GET',
    })
      .then((r) => r.json())
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

const replyMessage = (messageId, message, token) =>
  new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'content-type': 'application/json',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        Referer: 'https://discord.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({ content: message, nonce: '', tts: false, message_reference: { guild_id: guildId, channel_id: channelId, message_id: messageId } }), //https://discord.com/channels/927302277541290085/927302278032011306
      method: 'POST',
    })
      .then((r) => r.json())
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

const typing = (token) =>
  new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/channels/${channelId}/typing`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'content-type': 'application/json',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        Referer: 'https://discord.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      method: 'POST',
    })
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

(async () => {
  const ch = readline.question('Channel link : ').replace('https://discord.com/channels/', '').split('/');
  const mode = ['Single player', 'Duo', 'Continuous'];
  const type = readline.keyInSelect(mode, 'Which mode? : ');
  console.log('Ok, ' + mode[type] + ' goes to your room.');
  guildId = ch[0];
  channelId = ch[1];

  let tokens = fs
    .readFileSync('./tokens.txt', 'utf-8')
    .split('\n')
    .filter((a) => a);
  let tokensLength = tokens.length;
  let chats = fs.readFileSync('./chats.txt', 'utf-8').split('\r\n====##====\r\n');
  let i = 0,
    msgId;
  for (let [r, a] of chats.entries()) {
    try {
      if (tokensLength < 1) {
        console.log('Token not found!');
        break;
      }
      let idx = r + 1;
      await typing(tokens[i]);
      await delay(2121);
      await typing(tokens[i]);

      if (type == '0') {
        let msg = await sendMessage(a, tokens[i]);
        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = await sendMessage(a, tokens[i]);
          console.log(`${msg.author.username} : ${msg.content}`);
        }
      }

      // continous chat
      else if (type == '2') {
        let msg = r < 1 ? await sendMessage(a, tokens[i]) : await replyMessage(msgId, a, tokens[i]); // opening chat?
        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = r < 1 ? await sendMessage(a, tokens[i]) : await replyMessage(msgId, a, tokens[i]);
          console.log(`${msg.author.username} : ${msg.content}`);
        }
      } else if (type == '1') {
        // by 1
        let msg = r < 1 || idx % 2 !== 0 ? await sendMessage(a, tokens[i]) : await replyMessage(msgId, a, tokens[i]); // opening chat?
        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = r < 1 || idx % 2 !== 0 ? await sendMessage(a, tokens[i]) : await replyMessage(msgId, a, tokens[i]);
          console.log(`${msg.author.username} : ${msg.content}`);
        }
      } else {
        console.log('Canceled...');
        break;
      }

      msgId = msg.id;
    } catch (error) {
      console.log(error.message);
    }

    if (i == tokensLength - 1) {
      i = 0;
    } else {
      i++;
    }
    await delay(12188);
  }
})();
