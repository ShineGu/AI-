// 云函数 callKimiApi
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { description } = event;
  const API_KEY = 'sk-6qCX5qyJMyjIjR9rI3yCRvlDscFgHVusO5Svsop2zuy52TnX';

  try {
    const res = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.moonshot.cn',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            "role": "user",
            "content": `${description}，请根据描述作一首七言绝句，一共四句，每句七个字。要求：格式为第一行：“标题：《》”，后面每一行七个字，中间不要有空行`
          }
        ]
      }));

      req.end();
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error('Error:', err);
    return { error: '请求失败', message: err.message };
  }
};