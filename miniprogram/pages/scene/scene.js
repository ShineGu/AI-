// pages/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    videoUrl: '',
    taskId: ''
  },

  bindKeyInput: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  handleSend: function() {
    const { inputVal } = this.data;
    if (!inputVal.trim()) {
      wx.showToast({
        title: '请输入视频描述',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'onScene',
      data: { inputVal },
      success: (res) => {
        if (res.result.error) {
          wx.showToast({ title: res.result.error, icon: 'none' });
        } else {
          this.setData({
            videoUrl: res.result.videoUrl
          });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        wx.showToast({ title: '云函数调用失败', icon: 'none' });
      }
    });
  },
});