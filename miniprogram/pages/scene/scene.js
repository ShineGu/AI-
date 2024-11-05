// pages/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    videoUrl: '',
    taskId: '',
    requestId: ''
  },

  bindKeyInput: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  handleSend: function() {
    let that = this;
    this.setData({
      videoUrl: '',
      taskId: '',
      requestId: '',
    });
    const { inputVal } = this.data;
    this.setData({
      inputVal: '',
    });
    if (!inputVal.trim()) {
      wx.showToast({
        title: '请输入视频描述',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '生成中',
      icon: 'loading',
      duration: 100000,
      mask: true
    });

    // 调用生成视频请求的云函数
    wx.cloud.callFunction({
      name: 'onScene',
      data: { inputVal },
      success: (res) => {
        if (res.result.error) {
          wx.showToast({ title: '请重试', icon: 'none' });
        } else {
          // 获取taskId和requestId
          const { taskId, requestId } = res.result;
          this.setData({
            taskId,
            requestId
          });
          // 调用检查视频生成状态的云函数
          // this.checkVideoGenerationStatus(taskId, requestId);
          setTimeout(() => {
            that.checkVideoGenerationStatus(taskId, requestId);
          }, 30000);
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        wx.showToast({ title: '请重试', icon: 'none' });
      }
    });
  },

  checkVideoGenerationStatus: function(taskId, requestId) {
    if (!taskId || !requestId) {
      wx.showToast({
        title: '请重试',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'onScenefinal',
      data: { taskId, requestId },
      success: (res) => {
        if (res.result.error) {
          wx.showToast({ title: '请重试', icon: 'none' });
        } else {
          const videoUrl = res.result.videoUrl;
          this.setData({
            videoUrl
          });
          if (videoUrl) {
            wx.hideToast();
            wx.showToast({
              title: '视频生成成功',
              icon: 'success',
              duration: 2000,
              complete: () => {
                // 可以在这里添加打开视频的逻辑
              }
            });
          };
        }
      },
      fail: (err) => {
        console.error('检查视频生成状态云函数调用失败:', err);
        wx.showToast({ title: '请重试', icon: 'none' });
      }
    });
  }
});