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
    callbackUrl: 'https://eou2enle3ijfjbk.m.pipedream.net',
    musicDuration: '00:00',
    bard: 0,
    couplet: 0,
    scene: 0,
    zither: 0,
  },

  onLoad: function () {
    this.loadCustomFont();
    this.getAudioDuration('');
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
        updates: { bard: this.data.bard, couplet: this.data.couplet, zither: this.data.zither+1, scene: this.data.scene },
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

  getAudioDuration: function(url) {
    // 创建音频上下文
    this.audioCtx = wx.createInnerAudioContext();
    // 设置音频源
    this.audioCtx.src = url;
    // 监听音频加载状态
    this.audioCtx.onCanplay(() => {
      let audioDuration = this.audioCtx.duration; // 获取音频时长（秒）
      let formattedDuration = this.formatDuration(audioDuration); // 格式化音频时长为分:秒
      console.log('音频总时长为：', formattedDuration);
      this.setData({
        musicDuration: formattedDuration
      });
      wx.showToast({
        title: '音频生成成功',
        icon: 'success'
      });
      this.updataData();
    });
    // console.log(this.data.audioUrl1);
  },

  formatDuration: function (duration) {
    // 将秒转换为分:秒格式
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

  // 跳转回首页
  goHome: function() {
    wx.navigateBack({
      url: '/pages/home/home',
    });
  },

  onInput: function(e) {
    this.setData({
      userInput: e.detail.value,
      inputVal: e.detail.value,
    });
  },

  callRequestBin: function() {
    wx.cloud.callFunction({
      name: 'requestBin',
      data: {},
      success: function(res) {
        console.log('success', res.result);
      },
      fail: function(err) {
        console.log('error', err);
      }
    });
  },

  generateAudio: function() {
    const that = this;

    wx.showToast({
      title: '生成中',
      icon: 'loading',
      duration: 100000,
    })

    if (this.data.userInput !== '') {
      that.setData({
        inputVal: '',
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
      });
  
      wx.cloud.callFunction({
        name: 'audioGeneral', // 调用生成音频请求的云函数
        data: { prompt: this.data.userInput, style: this.data.style, callbackUrl: this.data.callbackUrl}, // 传递prompt和style
        success: res => {
          that.setData({
            userInput: '',
          });
          if (res.result.error) {
            wx.showToast({ title: '请重试', icon: 'none' });
          } else {
            const { task_id } = res.result;
            that.setData({ task_id }); // 存储任务ID
            console.log(task_id);
            that.checkAudioGenerationStatus();
            // setTimeout(() => {
            //   that.checkAudioGenerationStatus();
            // }, 50000);
          }
        },
        fail: err => {
          wx.showToast({
            title: '请重试',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '请输入诗句',
        icon: 'none',
      });
    };
  },

  checkAudioGenerationStatus: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'onZitherfinal', // 调用检查音频生成状态的云函数
      // data: { task_id: this.data.task_id }, // 传递任务ID
      success: res => {
        if (res.result.error) {
          wx.showToast({ title: '请重试', icon: 'none' });
        } else {
          // console.log(res.result);
          // 将HTML实体字符转换回对应的字符
          let str = res.result.replace(/&#34;/g, '"');

          // 解析字符串为JSON对象
          let obj;
          try {
            obj = JSON.parse(str);
            console.log(obj); // 打印解析后的JSON对象
          } catch (e) {
            console.error('解析JSON失败:', e);
          };
          that.checkValueAndRepeat(obj, that.data.task_id);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请重试',
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

  checkValueAndRepeat: function(result, task_id) {
    const that = this;
    // 检查 myValue 是否不为空
    if (result.task_id === task_id) {
      // 假设 obj 已经是一个解析后的JSON对象
      const { data } = result;
      const { audio_url: audioUrl1, title: title1, image_url: imageUrl1 } = data[0];
      const { audio_url: audioUrl2, title: title2, image_url: imageUrl2 } = data[1];

      that.setData({
        audioUrl1,
        audioUrl2,
        title1,
        title2,
        imageUrl1,
        imageUrl2,
      });

      this.getAudioDuration(this.data.audioUrl1);

    } else {
      // 如果为空，1秒后再次检查
      setTimeout(() => {
        that.checkAudioGenerationStatus();
      }, 5000);
    }
  },

});