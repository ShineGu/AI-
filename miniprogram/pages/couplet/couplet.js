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

  showAndclear: function() {
    const inputText = this.data.inputVal;
    this.setData({
      showText: inputText,
      inputText: inputText,
      inputVal: ''
    });
    this.callKimiAPI(inputText);
  },

  callKimiAPI: function(inputText) {
    wx.cloud.callFunction({
      name: 'onCouplet', 
      data: { query: inputText },
      success: res => {
        if (res.result && res.result.content) {
          this.appendMessage({
            role: 'assistant',
            content: res.result.content
          });
        } else {
          this.appendMessage({
            role: 'assistant',
            content: '抱歉，我暂时无法回答你的问题。'
          });
        }
      },
      fail: err => {
        console.error('云函数调用失败:', err);
        this.appendMessage({
          role: 'assistant',
          content: '抱歉，我暂时无法回答你的问题。'
        });
      }
    });
  },

  appendMessage: function(message) {
    this.setData({
      answer: message.content,
    });
  },
});