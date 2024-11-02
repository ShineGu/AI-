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
  },

  onInput: function(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  generateAudio: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'onZither',
      data: { query: this.data.userInput },
      success: res => {
        const { answer, prompt, style } = res.result;
        that.setData({
          answer,
          prompt,
          style,
        });
        wx.cloud.callFunction({
          name: 'onZitherfinal',
          data: { prompt, style },
          success: res => {
            that.setData({
              audioUrl1: res.result.audioUrl1,
              imageUrl1: res.result.imageUrl1,
              title1: res.result.title1,
              audioUrl2: res.result.audioUrl2,
              imageUrl2: res.result.imageUrl2,
              title2: res.result.title2,
            });
          },
          fail: err => {
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  // callKimiAPI: function(query) {
  //   // 已移动到云函数，无需前端实现
  // },

  appendMessage: function(message) {
    this.setData({
      answer: message.content,
      prompt: message.content.split('\n')[0],
      style: message.content.split('\n')[1],
    });
    console.log(this.data.style);
  },
});