Page({
  data: {
    imageSrc: '',
    aspectRatio: '',
    poem: '',
    biaoti: '《登黄鹤楼》',
    sentences: ['昔人已乘黄鹤去', '此地空余黄鹤楼', '黄鹤一去不复返', '白云千载空悠悠']
  },

  chooseImage: function() {
    let that = this;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFiles = res.tempFiles;
        if (tempFiles.length > 0) {
          const tempFilePath = tempFiles[0].tempFilePath;
          console.log(tempFilePath);
          wx.getImageInfo({
            src: tempFilePath,
            success(res) {
              const width = res.width;
              const height = res.height;
              const aspectRatio = `${width / height * 30}vh`;
              that.setData({
                aspectRatio: aspectRatio
              });
            },
            fail(err) {
              console.error('获取图片信息失败：', err);
            }
          });

          wx.getFileSystemManager().getFileInfo({
            filePath: tempFilePath,
            success(res) {
              let quality = 100;
              let compressedSize = res.size / (1024 * 1024).toFixed(2);
              console.log(compressedSize);
              if (compressedSize > 1) {
                quality = quality * 1 / (compressedSize + 0.1);

                wx.compressImage({
                  src: tempFilePath,
                  quality: quality,
                  success(res) {
                    const newTempFilePath = res.tempFilePath;
                    wx.getFileSystemManager().getFileInfo({
                      filePath: newTempFilePath,
                      success(res) {
                        compressedSize = res.size / (1024 * 1024).toFixed(2);
                        console.log(compressedSize);
                        console.log(newTempFilePath);
                        if (compressedSize <= 1) {
                          wx.getFileSystemManager().readFile({
                            filePath: newTempFilePath,
                            encoding: 'base64',
                            success: (res) => {
                              const base64Data = res.data;
                              that.uploadImage(newTempFilePath, base64Data);
                            }
                          });
                        }
                      }
                    })
                  }
                })
              } else {
                wx.getFileSystemManager().readFile({
                  filePath: tempFilePath,
                  encoding: 'base64',
                  success: (res) => {
                    const base64Data = res.data;
                    that.uploadImage(tempFilePath, base64Data);
                  }
                });
              }
            },
            fail(err) {
              console.error('获取图片信息失败：', err);
            }
          })
        }
        that.setData({
          imageSrc: tempFiles[0].tempFilePath,
        });
      },
      fail(err) {
        console.error('获取图片信息失败：', err);
      }
    });
  },

  uploadImage: function(tempFilePath, base64) {
    let that = this;
    const cloudPath = `upload/${new Date().getTime()}.jpg`; // 云存储路径

    wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: res => {
        console.log('上传成功', res);
        // console.log(cloudPath);
        // 调用云函数处理图片
        that.callBaiduAI(`cloud://common-0gtwhhyic77736c7.636f-common-0gtwhhyic77736c7-1330176420/${cloudPath}`, base64);
      },
      fail: err => {
        console.error('上传失败', err);
      }
    });
  },

  callBaiduAI: function(imageUrl, base64Data) {
    // console.log(imageUrl);
    // console.log(base64Data);
    let that = this;
    wx.cloud.callFunction({
      name: 'imageUnder',
      data: { base64Data },
      success: res => {
        if (res.result.error) {
          console.error(res.result.error);
          return;
        }
        const { task_id, token } = res.result;
        console.log(task_id);
        // 等待30秒
        setTimeout(() => {
          that.getBaiduAIResult(task_id, token);
        }, 40000);
      },
      fail: err => {
        console.error('调用云函数失败：', err);
      }
    });
  },

  getBaiduAIResult: function(task_id, token) {
    let that = this;
    wx.cloud.callFunction({
      name: 'onBard',
      data: { task_id, token },
      success: res => {
        console.log("百度AI处理结果:", res.result);
        that.callKimiApi(res.result);
      },
      fail: err => {
        console.error('调用云函数失败：', err);
      }
    });
  },

  callKimiApi: function(description) {
    wx.cloud.callFunction({
      name: 'onBardfinal',
      data: { description },
      success: res => {
        this.setData({
          poem: res.result
        });
      },
      fail: err => {
        console.error('调用云函数失败：', err);
      }
    });
  },

  parsePoem: function() {
    wx.showToast({
      title: '生成中',
      icon: 'loading',
      duration: 50000,
    });
    setTimeout(() => {
      let poem = this.data.poem;
      console.log(poem);
      if (poem != '') {
        let lines = poem.split('\n');
        let biaoti = lines[0].replace('标题：', '');
        let sentences = lines.slice(1).map(sentence => sentence.trim());
        this.setData({
          biaoti: biaoti,
          sentences: sentences
        });
      } else {
        wx.showToast({
          title: '请重试',
          icon: 'none'
        })
      }
    }, 30000);
  },
});