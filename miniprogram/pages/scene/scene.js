// pages/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    videoUrl: '',
    taskId: '',
    requestId: '',
    bard: 0,
    couplet: 0,
    scene: 0,
    zither: 0,
  },

  onLoad: function () {
    this.loadCustomFont();
    this.getData();
  },

  getData: function() {
    // console.log("ok");
    let that = this;
    // 获取文件变量值
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        owner: 'gu-taiyang',
        repo: 'pipe-dream',
        path: 'data.txt',
        giteeToken: '4754bceeb7e1ef81453da3841529b40a',
      },
      success: function(res) {
        that.setData({
          bard: res.result.data.bard,
          couplet: res.result.data.couplet,
          scene: res.result.data.scene,
          zither: res.result.data.zither
        });
        // console.log(that.data.bard);
      },
      fail: function(err) {
        console.error('获取文件变量值失败:', err);
      },
    });
  },

  updataData: function() {
    let that = this;
    // 更新文件变量值
    wx.cloud.callFunction({
      name: 'updateData',
      data: {
        owner: 'gu-taiyang',
        repo: 'pipe-dream',
        path: 'data.txt',
        giteeToken: '4754bceeb7e1ef81453da3841529b40a',
        updates: { bard: this.data.bard, couplet: this.data.couplet, zither: this.data.zither, scene: this.data.scene+1 },
      },
      success: function(res) {
        console.log('更新文件变量值结果:', res.result.data);
        that.getData();
      },
      fail: function(err) {
        console.error('更新文件变量值失败:', err);
      },
    });
  },

  // 跳转回首页
  goHome: function() {
    wx.navigateBack({
      url: '/pages/home/home',
    });
  },

  loadCustomFont: function () {
    wx.loadFontFace({
      family: 'spring', // 自定义字体的名字
      source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Bold.ttf?sign=9b2c6947a8a74131bfe5d0e19bb533ba&t=1731074336")`, // 字体文件的网络地址
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Thin.ttf?sign=d6195b9436d35f7a7a5a5b1f483e2732&t=1731074548")`,
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Light.ttf?sign=a66da007f54eb3fb81591480f7278b4b&t=1731074565")`,
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Regular.ttf?sign=8779a01167bae8e6e1cc1fde0cd843d6&t=1731074495")`,
      success: (res) => {
        console.log(res.status);
        // this.setData({ fontLoaded: true });
      },
      fail: (res) => {
        console.log(res.status);
      },
      complete: (res) => {
        console.log(res.status);
      }
    });

    wx.loadFontFace({
      family: 'spring-regular', // 自定义字体的名字
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Bold.ttf?sign=9b2c6947a8a74131bfe5d0e19bb533ba&t=1731074336")`, // 字体文件的网络地址
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Thin.ttf?sign=d6195b9436d35f7a7a5a5b1f483e2732&t=1731074548")`,
      // source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Light.ttf?sign=a66da007f54eb3fb81591480f7278b4b&t=1731074565")`,
      source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/ELEYANG-Spring-Regular.ttf?sign=8779a01167bae8e6e1cc1fde0cd843d6&t=1731074495")`,
      success: (res) => {
        console.log(res.status);
        // this.setData({ fontLoaded: true });
      },
      fail: (res) => {
        console.log(res.status);
      },
      complete: (res) => {
        console.log(res.status);
      }
    });
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
            this.updataData();
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