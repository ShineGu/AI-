const cloud = require('wx-server-sdk');
const axios = require('axios'); // 确保已经安装了axios

cloud.init();

exports.main = async (event, context) => {
  const accessToken = '4754bceeb7e1ef81453da3841529b40a'; // 替换为你的Gitee Access Token
  const owner = 'gu-taiyang'; // 替换为你的Gitee用户名或组织名
  const repo = 'pipe-dream'; // 替换为你的仓库名
  const path = 'test.txt'; // 替换为你的文件路径

  // 构建Gitee API URL
  const url = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 发送GET请求获取文件内容
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${accessToken}`,
        // Accept: 'application/vnd.github.v3.raw' // 获取原始文件内容
      }
    });

    // 获取Base64编码的文件内容
    const content = response.data.content;

    // 解码Base64内容
    const buffer = Buffer.from(content, 'base64');
    const fileContent = buffer.toString('utf-8');
    return fileContent;
  } catch (error) {
    console.error('获取文件内容失败:', error);
    return null;
  }
};