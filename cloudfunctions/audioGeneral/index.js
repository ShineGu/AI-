// 云函数 generateAudioRequest
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { prompt, style, callbackUrl } = event;
  const token = '5f36670de6ca41eba14d09e80df92d8d';
  // // 获取云函数的公网触发URL作为回调URL
  // const callbackUrl = `https://${context.ENV}.service.tcloudbase.com/audioCallback`; // 假设audioCallback是您的回调处理云函数名
  // const url = 'https://api.acedata.cloud/suno/audios';

  try {
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.acedata.cloud',
        path: '/suno/audios',
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
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
            if (res.statusCode === 200) {
              resolve(parsedData);
            } else {
              reject('生成请求失败');
            }
          } catch (err) {
            reject(err.message);
          }
        });
      });

      req.on('error', (e) => {
        reject(e.message);
      });

      req.write(JSON.stringify({
        action: 'generate',
        prompt: prompt,
        model: 'chirp-v2-xxl-alpha',
        instrumental: true,
        style: style,
        callback_url: callbackUrl // 发送callbackUrl到API
      }));

      req.end();
    });

    return {
      task_id: response.task_id, // 假设API返回task_id
      message: '请求已接收，等待异步回调'
    };
  } catch (err) {
    return {
      error: err,
      message: '请求失败'
    };
  }
};