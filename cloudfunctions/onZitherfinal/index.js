// 云函数 audioCallback
const cloud = require('wx-server-sdk');

cloud.init({ env: 'common-0gtwhhyic77736c7' }); // 使用当前云环境

exports.main = async (event, context) => {
  console.log('Audio generation callback received:', event);
  
  // 处理回调数据，例如保存到数据库
  const { task_id, audio_url, image_url, title } = event;
  const db = cloud.database();
  await db.collection('audioResults').add({
    data: {
      task_id,
      audio_url,
      image_url,
      title,
      createTime: new Date()
    }
  });

  return {
    success: true,
    message: 'Callback processed successfully'
  };
};