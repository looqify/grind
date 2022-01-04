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

// (async () => {
//   const token = readline.question('Token : ');
//   channelId = readline.question('ChannelId : ');
//   const limit = readline.questionInt('Limit (kelipatan 50) : ');
//   const total = limit / 50;
//   let before = null,
//     filename = channelId + '-' + limit + '.txt';

//   for (let i = 1; i <= total; i++) {
//     let msg = await scrapeMessage(token, channelId, before);
//     let msgLen = msg.length;
//     // console.log();
//     for (let message of msg) {
//       if (message.referenced_message) {
//         let chat1 = message.referenced_message.content;
//         let chat2 = message.content;
//         console.log('a : ', chat1);
//         console.log('b : ', chat2);
//         fs.writeFileSync(filename, chat1 + '\n====##====\n' + chat2, { flag: 'a+' });
//       }
//       before = msg[msgLen - 1].id;
//     }
//   }
// })();

// const filterMessage = () => {
//   let msgs = fs.readFileSync('./chats.txt', 'utf-8').split('\r\n====##====\r\n');
//   msgs = _.chunk(msgs, 2);
//   for (let [i, msg] of msgs.entries()) {
//     let reg = /<@/;
//     let res = [];
//     msg.forEach((a) => {
//       let aa = reg.test(a);
//       res.push(aa);
//     });
//     console.log(i, res, '\n', msg, '\n');
//     if (!res.includes(true)) {
//       fs.writeFileSync('filtered.txt', msg[0] + '\n====##====\n', { flag: 'a+' });
//       fs.writeFileSync('filtered.txt', msg[1] + '\n====##====\n', { flag: 'a+' });
//     }
//   }
// };

// filterMessage();
// let msgs = ['a', 'b', 'c', 'd'];
// console.log(msgs.splice(0, 2), msgs);

// scrapeMessage('Njg4NjA3NTk1MDg2NjEwNTA0.YTs1Rw.MDazX5DOatsgHQSRVKYFQeVrenM', '922931006976188467').then(console.log);

// sendMessage('927302278032011306', 'hi').then(console.log);

// replyMessage('', '', '', 'halloooooo').then(console.log);

// login('megamefaa@gmail.com', '!!faster').then(console.log); // return token
// login('alohaa227ytbe@gmail.com', '!!faster').then(console.log); // return token

// getMessages // https://discord.com/api/v9/channels/922931006976188467/messages?before=927954916729831524&limit=50
// GET /api/v9/channels/927302278032011306/messages?limit=50 HTTP/2
// Host: discord.com
// X-Debug-Options: bugReporterEnabled
// Sec-Ch-Ua-Mobile: ?0
// Authorization: OTI3MzAxNjA2NTQ0OTA0MjQz.YdIZFQ.PGoYwGLOgUv2f_316uINcWIuLtk
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36
// X-Discord-Locale: en-US
// Sec-Ch-Ua-Platform: "Windows"
// Accept: */*
// Sec-Fetch-Site: same-origin
// Sec-Fetch-Mode: cors
// Sec-Fetch-Dest: empty
// Referer: https://discord.com/channels/@me
// Accept-Encoding: gzip, deflate
// Accept-Language: en-US,en;q=0.9
