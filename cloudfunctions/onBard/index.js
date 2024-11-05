// 云函数 getBaiduAIResult
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { token, task_id } = event; // 从事件对象中获取token和task_id

  try {
    const resultRes = await new Promise((resolve, reject) => {
      const data = JSON.stringify({
        task_id: task_id // 将task_id作为POST请求的数据体
      });

      const options = {
        hostname: 'aip.baidubce.com',
        path: `/rest/2.0/image-classify/v1/image-understanding/get-result?access_token=${token}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 使用application/x-www-form-urlencoded格式
          'Content-Length': Buffer.byteLength(data) // 设置Content-Length头
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
      req.write(data); // 写入请求体
      req.end();
    });

    return resultRes.result.description || '';
  } catch (err) {
    console.error('Error:', err);
    return { error: '请求失败', message: err.message };
  }
};