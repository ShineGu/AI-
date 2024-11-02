// 云函数 callKimiAPI
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { query } = event;
  const API_KEY = 'sk-6qCX5qyJMyjIjR9rI3yCRvlDscFgHVusO5Svsop2zuy52TnX';
  const BASE_URL = 'https://api.moonshot.cn/v1/chat/completions'; // 移除了错误的 HTML 实体

  return new Promise((resolve, reject) => {
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
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode === 200 && parsedData.choices) {
            const response = parsedData.choices[0].message.content;
            resolve({
              prompt: response.split('\n')[0],
              style: response.split('\n')[1],
            });
          } else {
            reject('API调用失败');
          }
        } catch (err) {
          reject('解析响应失败');
        }
      });
    });

    req.on('error', (e) => {
      reject('网络请求失败');
    });

    req.write(JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [
        { role: 'user', content: `我想根据以下诗句生成一段音乐，请根据诗句给出这段音乐的不多于200字符的意境和不多于120字符的风格，英文，格式为：第一行为意境，第二行为风格。${query}` }
      ]
    }));
    req.end();
  });
};