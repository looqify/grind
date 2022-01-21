let { getInvite, typing, sendMessage, replyMessage, scrapeMessage, channelId, guildId, delay, readline, _, fs } = require('./dc.js');

(async () => {
  const token = readline.question('Token : ');
  channelId = readline.question('ChannelId : ');
  const limit = readline.questionInt('Limit (kelipatan 50) : ');
  const total = limit / 50;
  let before = null,
    msg,
    msgLen,
    reg = /<@/,
    chats = '';

  for (let i = 1; i <= total; i++) {
    msg = await scrapeMessage(token, channelId, before);
    msgLen = msg.length;
    // console.log();
    try {
      for (let message of msg) {
        if (message.referenced_message) {
          let chat1 = message.referenced_message.content;
          let chat2 = message.content;
          console.log('a : ', chat1);
          console.log('b : ', chat2);
          if (reg.test(chat1) || reg.test(chat2)) {
            console.log('This chat not added cz contain tag');
          } else {
            console.log('200 Ok!');
            chats += chat1 + '\n====##====\n' + chat2 + '\n====##====\n';
          }
        }
        before = msg[msgLen - 1].id;
      }
    } catch (error) {
      console.log(error.message, msg);
    }
  }

  fs.writeFileSync('./chats.txt', chats, { flag: 'w' });
})();
