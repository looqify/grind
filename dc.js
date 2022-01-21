const fetch = require('node-fetch');
const fs = require('fs');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readline = require('readline-sync');
const _ = require('lodash');
// var channelId, guildId;

const getInvite = (token, channelId) =>
  new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/channels/${channelId}/invites`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        authorization: token,
        'content-type': 'application/json',
        'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({ validate: null, max_age: 604800, max_uses: 0, target_type: null, temporary: false }),
      method: 'POST',
    })
      .then((r) => r.json())
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

const sendMessage = (message, token, channelId) =>
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

const replyMessage = (messageId, message, token, channelId, guildId) =>
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

const typing = (token, channelId) =>
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

module.exports = { getInvite, typing, sendMessage, replyMessage, scrapeMessage, delay, readline, _, fs };
