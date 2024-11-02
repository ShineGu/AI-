// 云函数 getBaiduAIResult
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { token, task_id } = event;

  try {
    const resultRes = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'aip.baidubce.com',
        path: `/rest/2.0/image-classify/v1/image-understanding/get-result?access_token=${token}&task_id=${task_id}`,
        method: 'GET'
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
      req.end();
    });

    return resultRes.data.result.ret_msg;
  } catch (err) {
    console.error('Error:', err);
    return { error: '请求失败', message: err.message };
  }
}