// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'common-0gtwhhyic77736c7' }) // 使用当前云环境
const https = require('https');

exports.main = async (event, context) => {
  const API_KEY = 'sk-6qCX5qyJMyjIjR9rI3yCRvlDscFgHVusO5Svsop2zuy52TnX';
  const BASE_URL = 'https://api.moonshot.cn/v1/chat/completions';

  const { query } = event;

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.moonshot.cn',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode === 200 && parsedData.choices) {
            const response = parsedData.choices[0].message.content;
            resolve({ content: response });
          } else {
            resolve({ content: 'error' });
          }
        } catch (err) {
          reject({ content: 'error' });
        }
      });
    });

    req.on('error', (e) => {
      reject({ content: '请求失败' });
    });

    req.write(JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [
        { role: 'user', content: "你现在是一个专门对对联AI助手。要求：1.字数必须与上联一样。2.直接给一个结果。3.不要说多余的字和标点。4.不要重复上联。5.除了对出的下联的字，不要有其他的回答。" + query }
      ]
    }));

    req.end();
  });
};