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
  // 小球的固定宽度
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
       * 获取当前整个进度条的宽度，动态的计算偏移量
       *
       * 保证进度条的小球能够出现在正确的位置上
       * @param newV
       */
      compProgressOffset(newV) {
        if (newV >= 0 ) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
          const offsetWidth = newV * barWidth
          console.log(offsetWidth);
          this._setProgressOffset(offsetWidth)
        }
      },
      /**
       * 处理直接点击进度条的交互行为
       *
       * 1. 直接设置当前进度条和小球的位置
       * 2. 动态计算修改后的百分比，并向外派发，保证音乐能够跟着修改当前播放的音乐
       * */
      clickOnHandle(e) {
        this._setProgressOffset(e.offsetX);
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
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
      /**
       * 通过直接修改style的属性来控制进度条的长度
       *
       * 通过 translate3d 来控制小球的位移
       *
       * @param offsetWidth
       * @private
       */
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
