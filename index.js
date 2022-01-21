let { typing, sendMessage, replyMessage, scrapeMessage, delay, readline, _, fs } = require('./dc');

(async () => {
  let tokens = readline
    .question('Tokens => Token1|Token2 : ')
    .split('|')
    .filter((a) => a);
  let tokensLength = tokens.length;
  const ch = readline.question('Channel link : ').replace('https://discord.com/channels/', '').split('/');
  const mode = ['Single player', 'Duo', 'Continous'];
  const type = readline.keyInSelect(mode, 'Which mode? : ');
  console.log('Ok, ' + mode[type] + ' goes to your room.');
  let = guildId = ch[0];
  let = channelId = ch[1];
  let chats = fs.readFileSync('./chats.txt', 'utf-8').split('\n====##====\n');
  let i = 0,
    msgId;
  for (let [r, a] of chats.entries()) {
    if (tokensLength < 1) {
      console.log('Token not found!');
    }
    try {
      let idx = r + 1;
      await typing(tokens[i], channelId);
      await delay(2121);
      await typing(tokens[i], channelId);
      let msg;
      if (type == '0') {
        msg = await sendMessage(a, tokens[i], channelId);
        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = await sendMessage(a, tokens[i], channelId);
          console.log(`${msg.author.username} : ${msg.content}`);
        }
      }
      // continous chat
      else if (type == '2') {
        msg = r < 1 ? await sendMessage(a, tokens[i], channelId) : await replyMessage(msgId, a, tokens[i], channelId, guildId); // opening chat?
        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = r < 1 ? await sendMessage(a, tokens[i], channelId) : await replyMessage(msgId, a, tokens[i], channelId, guildId);
          console.log(`${msg.author.username} : ${msg.content}`);
        }
      } else if (type == '1') {
        // by 1
        msg = r < 1 || idx % 2 !== 0 ? await sendMessage(a, tokens[i], channelId) : await replyMessage(msgId, a, tokens[i], channelId, guildId); // opening chat?

        if (msg.id) {
          console.log(`${msg.author.username} : ${msg.content}`);
        } else {
          console.log(`${msg.message}, retry after ${msg.retry_after}s`);
          await delay(msg.retry_after * 1000);
          msg = r < 1 || idx % 2 !== 0 ? await sendMessage(a, tokens[i], channelId) : await replyMessage(msgId, a, tokens[i], channelId, guildId);
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
    await delay(13091);
  }
})();
