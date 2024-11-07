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
  },

  onInput: function(e) {
    this.setData({
      userInput: e.detail.value
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
          that.checkAudioGenerationStatus();
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

      wx.showToast({
        title: '音频生成成功',
        icon: 'success'
      });
    } else {
      // 如果为空，1秒后再次检查
      setTimeout(() => {
        that.checkAudioGenerationStatus();
      }, 5000);
    }
  },

});