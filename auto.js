let { typing, sendMessage, replyMessage, scrapeMessage, delay, readline, _, fs } = require('./dc');
const getNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
(async () => {
  let tokens = readline
    .question('Tokens => Token1|Token2 : ')
    .split('|')
    .filter((a) => a);
  let tokensLength = tokens.length;
  const ch = readline.question('Channel link : ').replace('https://discord.com/channels/', '').split('/');
  let = guildId = ch[0];
  let = channelId = ch[1];
  let msg,
    reg = /<@/;
  while (true) {
    // scrape => 50 list
    const msgs = await scrapeMessage(tokens[0], channelId, null);
    console.log(msgs.length);
    // filter => list
    for (let message of msgs) {
      if (message.referenced_message) {
        let chat1 = message.referenced_message.content;
        let chat2 = message.content;
        if (reg.test(chat1) || reg.test(chat2)) {
          console.log('This chat not added cz contain tag');
        } else {
          await typing(tokens[0], channelId);
          await delay(2121);
          await typing(tokens[0], channelId);
          msg = await sendMessage(chat1, tokens[0], channelId);
          if (msg.id) {
            console.log(`${msg.author.username} : ${msg.content}`);
          } else {
            console.log(`${msg.message}, retry after ${msg.retry_after}s`);
            await delay(msg.retry_after * 1000);
            msg = await sendMessage(chat1, tokens[0], channelId);
            console.log(`${msg.author.username} : ${msg.content}`);
          }
          await delay(getNumberBetween(30000, 50000));
          await typing(tokens[1], channelId);
          await delay(2121);
          await typing(tokens[1], channelId);
          msg = await replyMessage(msg.id, chat2, tokens[1], channelId, guildId);
          if (msg.id) {
            console.log(`${msg.author.username} : ${msg.content}`);
          } else {
            console.log(`${msg.message}, retry after ${msg.retry_after}s`);
            await delay(msg.retry_after * 1000);
            msg = await replyMessage(msg.id, chat2, tokens[1], channelId, guildId);
            console.log(`${msg.author.username} : ${msg.content}`);
          }
          await delay(getNumberBetween(30000, 50000));
        }
      }
    }
  }
})();
