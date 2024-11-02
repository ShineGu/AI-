// 云函数 generateVideo
const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  const { inputVal } = event;

  if (!inputVal.trim()) {
    return { error: '请输入视频描述' };
  }

  try {
    const response = await httpRequest({
      method: 'POST',
      url: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
      headers: {
        'Authorization': 'Bearer 5b151d54367b4d5ad22270260b388644.9mb3hnZhONsLHYlL',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        model: 'cogvideox',
        prompt: inputVal
      }),
    });

    if (response.statusCode === 200 && response.data) {
      const { id, request_id } = JSON.parse(response.data);
      const videoUrl = await checkVideoGenerationStatus(id, request_id);
      return { videoUrl };
    } else {
      return { error: '视频生成请求失败' };
    }
  } catch (err) {
    console.error('请求失败:', err);
    return { error: '请求失败' };
  }
};

async function checkVideoGenerationStatus(taskId, requestId) {
  let status = 'PENDING';
  while (status === 'PENDING') {
    const response = await httpRequest({
      method: 'GET',
      url: `https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`,
      headers: {
        'Authorization': 'Bearer 5b151d54367b4d5ad22270260b388644.9mb3hnZhONsLHYlL',
        'Content-Type': 'application/json'
      },
    });

    if (response.statusCode === 200 && response.data) {
      status = JSON.parse(response.data).task_status;
      if (status === 'SUCCESS') {
        return JSON.parse(response.data).video_result[0].url;
      } else if (status === 'FAIL') {
        throw new Error('视频生成失败');
      }
    } else {
      throw new Error('检查视频生成状态请求失败');
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒再次检查
  }
}

// 通用的 HTTP 请求函数
async function httpRequest({ method, url, headers, data }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(url).hostname,
      path: new URL(url).pathname + new URL(url).search,
      method,
      headers,
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}