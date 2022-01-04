const fetch = require('node-fetch');
const readline = require('readline-sync');

const login = (email, password) =>
  new Promise((resolve, reject) => {
    fetch('https://discord.com//api/v9/auth/login', {
      headers: {
        Host: 'discord.com',
        Authorization: 'undefined',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-debug-options': 'bugReporterEnabled',
        'x-discord-locale': 'en-US',
        Referer: 'https://discord.com/login',
      },
      body: JSON.stringify({ login: email, password: password, undelete: false, captcha_key: null, login_source: null, gift_code_sku_id: null }),
      method: 'POST',
    })
      .then((r) => r.json())
      .then((res) => resolve(res))
      .then((e) => reject(e));
  });

async () => {
  try {
    console.log('GET TOKEN\n');
    const user = readline.question('email : ');
    const pass = readline.question('pass : ');
    const login = await login(user, pass);
    console.log(login);
  } catch (error) {
    console.log(error.message);
  }
};
