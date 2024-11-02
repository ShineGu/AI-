// pages/zither/zither.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInput: '',
    audioUrl1: '',
    imageUrl1: '',
    title1: '',
    audioUrl2: '',
    imageUrl2: '',
    title2: '',
    answer: '',
    prompt: '',
    style: '',
    task_id: '', // 用于存储任务ID
    callbackUrl: 'https://webhook.site/dfca089e-4e92-42fe-ba4c-8ca875ce0edf',
  },

  onInput: function(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  generateAudio: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'audioGeneral', // 调用生成音频请求的云函数
      data: { prompt: this.data.userInput, style: this.data.style, callbackUrl: this.data.callbackUrl}, // 传递prompt和style
      success: res => {
        if (res.result.error) {
          wx.showToast({ title: res.result.error, icon: 'none' });
        } else {
          const { task_id } = res.result;
          that.setData({ task_id }); // 存储任务ID
          console.log(task_id);
          // that.checkAudioGenerationStatus(); // 立即检查音频生成状态
          // setTimeout(() => {
          //   that.checkAudioGenerationStatus();
          // }, 50000);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  checkAudioGenerationStatus: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'onZitherfinal', // 调用检查音频生成状态的云函数
      data: { task_id: this.data.task_id }, // 传递任务ID
      success: res => {
        if (res.result.error) {
          wx.showToast({ title: res.result.error, icon: 'none' });
        } else {
          const { audioUrl1, audioUrl2, title1, title2, imageUrl1, imageUrl2 } = res.result;
          that.setData({
            audioUrl1,
            audioUrl2,
            title1,
            title2,
            imageUrl1,
            imageUrl2,
          });
          wx.showToast({
            title: '音频生成成功',
            icon: 'success'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '检查音频生成状态失败',
          icon: 'none'
        });
      }
    });
  },

  appendMessage: function(message) {
    this.setData({
      answer: message.content,
      prompt: message.content.split('\n')[0],
      style: message.content.split('\n')[1],
    });
    console.log(this.data.style);
  },
});