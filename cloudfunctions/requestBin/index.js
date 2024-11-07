// 引入axios
const axios = require('axios');

exports.main = async (event, context) => {
  const url = 'https://api.pipedream.com/v1/workflows';
  const templateId = 'tch_1Afydv';
  const apiKey = '2023835296290dc904133d3fa2c921ad'; // 替换为您的Pipedream API Key

  try {
    const response = await axios.post(url, {
      template_id: templateId
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error instantiating workflow:', error);
    return null;
  }
};