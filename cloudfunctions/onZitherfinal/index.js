// 云函数 generateAudio
const cloud = require('wx-server-sdk');
const https = require('https');
const querystring = require('querystring');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { prompt, style } = event;
  const token = '5f36670de6ca41eba14d09e80df92d8d';
  const url = 'https://api.acedata.cloud/suno/audios';

  return new Promise((resolve, reject) => {
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
            resolve({
              audioUrl1: parsedData.data[0].audio_url,
              imageUrl1: parsedData.data[0].image_url,
              title1: parsedData.data[0].title,
              audioUrl2: parsedData.data[1].audio_url,
              imageUrl2: parsedData.data[1].image_url,
              title2: parsedData.data[1].title,
            });
          } else {
            reject('生成失败');
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
    }));

    req.end();
  });
};