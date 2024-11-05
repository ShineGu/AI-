Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    inputText: '',
    showText: '',
    answer: ''
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