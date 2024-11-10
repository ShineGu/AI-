// 云函数 getGiteeFile/index.js
const axios = require('axios');

exports.main = async (event, context) => {
  const { owner, repo, path, ref = 'master', giteeToken } = event;

  const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${giteeToken}`,
      },
    });

    const fileContent = Buffer.from(response.data.content, 'base64').toString();
    const data = JSON.parse(fileContent);

    return { status: 'success', data: data };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};