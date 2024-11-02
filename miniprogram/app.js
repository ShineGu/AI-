// app.js

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // 必填，云开发环境的ID
        env: 'common-0gtwhhyic77736c7', // 替换成你的环境ID
        // 非必填，是否禁用内网访问
        // traceUser: true,
      });
    }
    // 其他初始化代码...
  }
});