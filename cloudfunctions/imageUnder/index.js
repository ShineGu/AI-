// 云函数 uploadImageAndGetTaskId
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { imageUrl } = event;
  const API_KEY = '4dlB99pcsw9ynfSzH1K0Cviv';
  const SecretKey = 'sLP9FUByxbsOK0Waiajb0PIWQUBXZwtD';

  try {
    const token = await getAccessToken(API_KEY, SecretKey);

    const baiduRes = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'aip.baidubce.com',
        path: `/rest/2.0/image-classify/v1/image-understanding/request?access_token=${token}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP Status: ${res.statusCode}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      
      req.on('error', reject);
      req.write(JSON.stringify({
        question: '请描述图片内容',
        url: imageUrl,
      }));
      req.end();
    });
    console.log(baiduRes);

    return { task_id: baiduRes.data.result.task_id, token };
  } catch (err) {
    console.error('Error:', err);
    return { error: '请求失败', message: err.message };
  }
};

async function getAccessToken(API_KEY, SecretKey) {
  return new Promise((resolve, reject) => {
    const data = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: API_KEY,
      client_secret: SecretKey
    });

    const options = {
      hostname: 'aip.baidubce.com',
      path: '/oauth/2.0/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const parsedData = JSON.parse(data);
        if (parsedData.access_token) {
          resolve(parsedData.access_token);
        } else {
          reject(new Error('Failed to get access token'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}