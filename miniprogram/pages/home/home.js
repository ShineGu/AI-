// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bard: 0,
    couplet: 0,
    scene: 0,
    zither: 0,
  },

  onLoad: function() {
    this.getData();
    // console.log("okk");
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

  Couplet: function() {
    wx.navigateTo({
      url: '/pages/couplet/couplet',
    });
  },

  Bard: function() {
    wx.navigateTo({
      url: '/pages/bard/bard',
    });
  },

  Scene: function() {
    wx.navigateTo({
      url: '/pages/scene/scene',
    });
  },

  Zither: function() {
    wx.navigateTo({
      url: '/pages/zither/zither',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})