Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    inputText: '',
    showText: '',
    answer: '',
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
        updates: { bard: this.data.bard, couplet: this.data.couplet+1, zither: this.data.zither, scene: this.data.scene },
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


  loadCustomFont: function () {
    wx.loadFontFace({
      family: 'HYXingKaiF', // 自定义字体的名字
      source: `url("https://636f-common-0gtwhhyic77736c7-1330176420.tcb.qcloud.la/font/HYXingKaiF.ttf?sign=acf24f55f62f8f88e205b686acaa7c2b&t=1731150903")`, // 字体文件的网络地址
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

  // 跳转回首页
  goHome: function() {
    wx.navigateBack({
      url: '/pages/home/home',
    });
  },

  inputChange: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  initContent: function() {
    this.setData({
      inputVal: '',
      inputText: '',
      showText: '',
      answer: '',
    });
  },

  showAndclear: function() {
    const inputText = this.data.inputVal;
    wx.showToast({
      title: '生成中',
      icon: 'loading',
      duration: 100000,
      mask: true,
    });

    if (inputText) {
      this.setData({
        showText: inputText,
        inputText: inputText,
        inputVal: ''
      });
      this.callKimiAPI(inputText);
    } else {
      wx.showToast({
        title: '请输入上联',
        icon: 'none',
      });
      this.initContent();
    }
  },

  callKimiAPI: function(inputText) {
    wx.cloud.callFunction({
      name: 'onCouplet', 
      data: { query: inputText },
      success: res => {
        if (res.result && res.result.content && res.result.content !== 'error') {
          // wx.hideToast();
          wx.showToast({
            title: '生成成功',
            icon: 'success'
          });
          this.updataData();
          this.appendMessage({
            role: 'assistant',
            content: res.result.content
          });
        } else {
          this.appendMessage({
            role: 'assistant',
            // content: '抱歉，我暂时无法回答你的问题。'
          });
          wx.showToast({
            title: '太快了，请重试',
            icon: 'error',
          });
          this.initContent();
        }
      },
      fail: err => {
        console.error('云函数调用失败:', err);
        this.appendMessage({
          role: 'assistant',
          // content: '抱歉，我暂时无法回答你的问题。'
        });
        wx.showToast({
          title: '太快了，请重试',
          icon: 'error',
        });
        this.initContent();
      }
    });
  },

  appendMessage: function(message) {
    this.setData({
      answer: message.content,
    });
  },
});