Component({
  properties: {
    musicDuration: '00:00',
    title1: '',
    title2: '',
    imageUrl1: '',
    imageUrl2: '',
    audioUrl1: '',
    audioUrl2: '',
  },

  data: {
    musicUrl: '',
    playing: false,
    currentSongIndex: 0,
    songs: [],
    currentSong: {},
    currentImage: '',
    currentName: '',
    progress: 0,
    currentTime: '00:00',
    sliderValue: 0,
  },

  attached: function() {
    this.initSongs();
    this.loadCustomFont();
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

  methods: {
    initSongs: function() {
      const songs = [
        { name: this.properties.title1, url: this.properties.audioUrl1, cover: this.properties.imageUrl1 },
        { name: this.properties.title2, url: this.properties.audioUrl2, cover: this.properties.imageUrl2 },
      ];
      this.setData({
        songs,
        currentSong: songs[0],
        currentImage: songs[0].cover,
        currentName: songs[0].name,
      });
    },

    updateCurrentSongInfo: function() {
      const currentSong = this.data.songs[this.data.currentSongIndex];
      this.setData({
        currentSong,
        currentImage: currentSong.cover,
        currentName: currentSong.name
      });
    },

    onSliderChange: function(e) {
      this.setData({
        sliderValue: e.detail.value
      });
    },

    onProgressChange: function(e) {
      const audioManager = wx.getBackgroundAudioManager();
      const duration = audioManager.duration;
      const newTime = (e.detail.value / 100) * duration;
      audioManager.seek(newTime);
      this.setData({
        currentTime: this.formatTime(newTime)
      });
    },

    onPrevious: function() {
      let newIndex = this.data.currentSongIndex - 1;
      if (newIndex < 0) {
        wx.showToast({
          title: '暂无上一首',
          icon: 'none'
        });
        return;
      }
      this.setData({
        currentSongIndex: newIndex,
        playing: false
      });
      this.updateCurrentSongInfo();
      this.playMusic();
    },

    onPlayPause: function() {
      const audioManager = wx.getBackgroundAudioManager();
      if (this.data.playing) {
        audioManager.pause();
        this.setData({ playing: false });
      } else {
        this.playMusic();
      }
    },

    onNext: function() {
      let newIndex = this.data.currentSongIndex + 1;
      if (newIndex >= this.data.songs.length) {
        wx.showToast({
          title: '暂无下一首',
          icon: 'none',
        });
        return;
      }
      this.setData({
        currentSongIndex: newIndex,
        playing: false
      });
      this.updateCurrentSongInfo();
      this.playMusic();
    },

    onFastForward: function() {
      const audioManager = wx.getBackgroundAudioManager();
      const currentTime = audioManager.currentTime;
      const duration = audioManager.duration;
      const newTime = currentTime + 10; // 快进10秒
      if (newTime > duration) {
        newTime = duration;
      }
      audioManager.seek(newTime);
      this.setData({
        currentTime: this.formatTime(newTime),
        sliderValue: (newTime / duration) * 100
      });
    },

    playMusic: function() {
      const audioManager = wx.getBackgroundAudioManager();
      const url = this.data.currentSong.url;
      console.log(url);
      if (url === '') {
        wx.showToast({
          title: '暂无歌曲',
          icon: 'none'
        });
      } else {
        audioManager.title = this.data.currentSong.name; // 音频标题
        audioManager.coverImgUrl = this.data.currentSong.cover; // 音频封面图
        audioManager.src = url; // 音频数据地址
        audioManager.play();
        this.setData({ playing: true });
  
        audioManager.onTimeUpdate(() => {
          const currentTime = audioManager.currentTime;
          const duration = audioManager.duration;
          const sliderValue = (currentTime / duration) * 100;
          this.setData({
            currentTime: this.formatTime(currentTime),
            musicDuration: this.formatTime(duration),
            sliderValue: sliderValue
          });
        });
  
        audioManager.onEnded(() => {
          this.setData({ playing: false });
          this.onNext(); // 自动播放下一曲
        });
      };
    },

    getAudioDuration: function(duration) {
      this.setData({
        musicDuration: this.formatTime(duration)
      });
    },

    formatTime: function(time) {
      if (!isNaN(time)) {
        let minute = Math.floor(time / 60);
        let second = Math.floor(time % 60);
        return `${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
      }
    }
  }
});