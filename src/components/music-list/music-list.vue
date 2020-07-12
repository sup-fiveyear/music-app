<template>
  <div class="music-list">
    <!--    头部返回按钮-->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!--title-->
    <h1 class="title" v-html="title"></h1>
    <!--背景图片-->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!--    背景蒙层-->
      <div class="filter" ref="filter"></div>
    </div>
    <!--歌曲列表-->
    <!--    为什么这里需要加一层layer？-->
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      @scroll="scroll"
      class="list"
      ref="list"
      :click="true"
    >
      <div class="song-list-wrapper">
        <div class="song-title" :class="{ 'title-fiexd': stateSuctionTop }">
          测试
        </div>
        <song-list @selectSong="selectSongHandle" :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/Scroll/Scroll";
import songList from "base/song-list/song-list";
import { prefixStyle } from "../../common/js/dom";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("musicPlayer");

const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop");

export default {
  name: "music-list",
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      scrollY: 0,
      stateSuctionTop: false
    };
  },
  watch: {
    scrollY(newVal) {
      let zIndex = 0;
      let translateY = Math.max(this.minTranslateY, newVal);
      let scale = 1;
      /*
       * - 下拉放大头像
       * - 上推图片高斯模糊
       * */
      const present = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        // 向下拉动
        scale = 1 + present;
      } else {
        // 向上滑动
        blur = Math.min(20, present * 20);
      }
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;

      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;
      if (newVal < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        console.log(`到达吸顶状态，`, this.minTranslateY);
        this.stateSuctionTop = true;
        /**
         * 达到吸顶状态时，向内派发事件？
         */
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
      } else {
        // 下拉
        zIndex = 0;
        console.log(`下拉状态`);
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.stateSuctionTop = false;
        this.$refs.bgImage.style.height = 0;
      }
      this.$refs.bgImage.style["transform"] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  mounted() {
    /**
     * - 计算作者图片高度
     * - 设置歌单top值，使得达到正常位置
     */
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    // list是一个组件，我们需要拿到$el，对他进行高度设置
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  components: {
    Scroll,
    songList
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    /**
     * 调用播放器
     *
     * 将歌曲名、对应的索引传递给vuex
     * @param song
     * @param index
     */
    selectSongHandle(song, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    ...mapActions(["selectPlay"])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background

    .song-list-wrapper
      padding: 20px 30px
      .title-fiexd
        position fixed
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
