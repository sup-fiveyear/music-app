<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" @click="packUpPlayer">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd">
                <img
                  :class="cdCls"
                  :src="currentSong.image"
                  class="image"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChangeEnd="modifyMusicTime"></progress-bar>
            </div>
            <span class="time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="mode" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="mini-player" v-show="!fullScreen" @click="fullScreenPlayer">
      <div class="icon">
        <div class="imgWrapper">
          <img
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSong.image"
            alt=""
          />
        </div>
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius" :percent="percent">
          <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
        </progress-circle>
      </div>
      <div class="control"><i class="icon-playlist"></i></div>
    </div>
    <audio ref="audio" @timeupdate="updateTime"
    @ended="songEnd"
    ></audio>
  </div>
</template>

<script>
  // FIXME: 音乐播放器放大缩小再次进入时，图片旋转位置不对
  import {createNamespacedHelpers} from "vuex";
  import ProgressBar from "../../base/progress-bar/progress-bar";
  import ProgressCircle from 'base/progress-circle/progress-circle';
  import {playMode} from "../../common/js/config";
  import {shuffleDeck} from "../../common/js/util";

  const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  "musicPlayer"
);

export default {
  name: "player",
  components: {ProgressCircle, ProgressBar},
  data() {
    return {
      currentTime: 0,
      duration: 0,
      radius: 32,
      songReady: false,
    }
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return 'icon-next'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    percent () {
      console.log('计算属性重新计算了');      
      let res = +(this.currentTime / this.duration).toFixed(6)
      return res;
    },
    ...mapGetters([
      "playList",
      "fullScreen",
      "currentSong",
      "currentSongUrl",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
    ])
  },
  methods: {
    packUpPlayer() {
      this.setFullScreen(false);
    },
    fullScreenPlayer() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      this.setPlaying(!this.playing);
    },
    songEnd() {
      this.currentTime = 0;
      console.log(this.percent);      
      if(this.mode === playMode.loop) {
        this.playLoop()
      }else {
        this.playNext()
      }      
    },
    playLoop() {
      this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlayingState(true)
    },
    playNext() {
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    prevSong() {
      this.$refs.audio.pause();
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index);
    },
    nextSong() {
      this.$refs.audio.pause();
      let index = this.currentIndex + 1
      if (index === this.playList) {
        index = 0
      }
      this.setCurrentIndex(index);
    },
    format(time) {
      /*
      * 1. 取整
      * 2. 获取分钟
      * 3. 获取秒钟
      *
      * **/
      time = time | 0
      const minute = time / 60 | 0;
      const second = this._pad(time % 60 | 0);
      return `${minute} : ${second}`
    },
    updateTime(e) {
      //XXX: duration放在这里可能不太合适，再考虑。
      this.duration = this.$refs.audio.duration
      this.currentTime = e.target.currentTime
    },
    modifyMusicTime(percent) {
      const currentTime = percent * this.duration;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlaying(true)
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      /**
       * - 根据不同模式进行当前歌单的调整
       *
       * - 如果是随机播放模式，为了保证当前歌曲的正确性
       *   还需要计算随机后的歌单中，对应的currentIndex，并同步到vuex中
       * */
      let songListProcessing = null;
      if(mode === playMode.random) {
        songListProcessing = shuffleDeck(this.playList);
      }else {
        songListProcessing = this.sequenceList
      }          
      this._resetCurrentIndex(songListProcessing);
      this.setPlayList(songListProcessing);
    },
    _resetCurrentIndex(list) {
      /**
       * 在打乱的数组中 和 原歌曲列表
       * 
       * 找到歌曲id相同的index
       */
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index);
    },
    _pad(num,n = 2) {
      let len = num.toString().length;
      while(len < n) {
        num = '0' + num;
        len++
      }
      return num;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlaying: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAY_LIST",      
    }),
    ...mapActions(["getSongUrl"])
  },
  watch: {
    currentSong(cur, prev) {
      if(cur.id === prev.id) {
        return;
      }
      this.getSongUrl();
      // console.log(`this.currentSongUrl is:`,this.currentSongUrl == false);
      /**
       * 之所以是1s 是因为
       * 调用 this.getSongUrl 会导致vuex获取新数据再次刷新视图，此时的url才能拿到
       * 因此延时20ms 保证在组件内部拿到src后才开始播放，防止报错
       */
      setTimeout(() => {
        this.$refs.audio.src = this.currentSongUrl;
        this.$refs.audio.play();
      }, 500);
    },
    playing(newState) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newState ? audio.play() : audio.pause();
      });
    },
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .play {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    /**
      TODO：动画为什么需要加开始状态，和结束状态？
      - 贝塞尔曲线：cubic-bezier(0.86, 0.18, 0.82, 1.32)
     */
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;
      .top, .bottom {
        transition: all 0.4s ;
      }
    }
    &.normal-enter, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;

      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
