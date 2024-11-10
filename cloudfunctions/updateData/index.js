// 云函数 updateGiteeFile/index.js
const axios = require('axios');

exports.main = async (event, context) => {
  const { owner, repo, path, ref = 'master', giteeToken, updates } = event;

  const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 获取文件当前内容
    let response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${giteeToken}`,
      },
    });

    const fileContent = Buffer.from(response.data.content, 'base64').toString();
    const data = JSON.parse(fileContent);

    // 应用更新
    Object.keys(updates).forEach(key => {
      if (data.hasOwnProperty(key)) {
        data[key] = updates[key];
      }
    });

    const newContent = Buffer.from(JSON.stringify(data)).toString('base64');

    const updateData = {
      message: 'Update variables',
      content: newContent,
      sha: response.data.sha,
    };

    response = await axios.put(apiUrl, updateData, {
      headers: {
        Authorization: `token ${giteeToken}`,
      },
    });

    return { status: 'success', data: response.data };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};