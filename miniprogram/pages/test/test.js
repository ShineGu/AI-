// pages/index/index.js
Page({
  data: {
    musicUrl: 'https://cdn1.suno.ai/56f02385-9b68-4e15-9216-ed6823465de1.mp3', // 音乐网址
    musicDuration: 0 // 音乐时长（秒）
  },

  onLoad: function (options) {
    // 假设音乐网址是通过页面参数传递的
    // this.setData({
    //   musicUrl: options.musicUrl
    // });
    this.initAudioContext();
  },

  initAudioContext: function () {
    // 创建音频上下文
    this.audioCtx = wx.createInnerAudioContext();
    // 设置音频源
    this.audioCtx.src = this.data.musicUrl;
    // 监听音频加载状态
    this.audioCtx.onCanplay(() => {
      let audioDuration = Math.floor(this.audioCtx.duration); // 获取音频时长（秒）
      console.log('音频总时长为：', audioDuration);
      this.setData({
        musicDuration: audioDuration
      });
    });
  },

  // 其他页面逻辑...
});