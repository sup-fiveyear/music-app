<template>
  <div class="progress-bar" ref="progressBar" @click="clickOnHandle">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"
             @touchstart="touchstartHandle"
             @touchmove="touchmoveHandle"
             @touchend="touchendHandle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  // FIXME: 进度条，磕巴，怀疑是在player计算这里出现了问题
  // BUG: 增加拖动功能后，进度条向前播放功能失效
  import {prefixStyle} from "common/js/dom";
  const transform = prefixStyle('transform');
  const progressBtnWidth = 16

  export default {
    name: "progress-bar",
    props: {
      percent: {
        type: Number,
        default: 0
      },
    },
    created() {
      this.touch = {}
    },
    methods: {
      /**
       * 1. 获取当前整个进度条的宽度
       * 2. 计算偏移量
       * @param newV
       */
      compProgressOffset(newV) {
        if (newV >= 0 ) {
          const offsetWidth = newV * this.barWidth
          this._setProgressOffset(offsetWidth)
        }
      },
      clickOnHandle(e) {
        this._setProgressOffset(e.offsetX);
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        console.log(this.$refs.progress.clientWidth,barWidth)
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChangeEnd',percent)
      },
      touchstartHandle(e) {
        this.beginToTouch = true;
      //  记录当前开始的位置
        this.touch.startX = e.touches[0].pageX;
      //  记录进度条已经走过的位置
        this.touch.hasCome = this.$refs.progress.clientWidth;
      },
      touchmoveHandle(e) {
        if(!this.beginToTouch) return;
      // 获取当前移动的差值
        const deltaX = e.touches[0].pageX - this.touch.startX;
      // 计算偏移量
      //  两个限制：最小移动范围不能小于0，最大移动范围不能超过progressBar的宽度
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth,Math.max(0,this.touch.hasCome + deltaX))
        this._setProgressOffset(offsetWidth)
      },
      touchendHandle() {
        this.beginToTouch = false;
      //  计算偏移量，并向外传递
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChangeEnd', percent)
      },
      _setProgressOffset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
    },
    watch: {
      percent(newV) {
        this.compProgressOffset(newV)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
