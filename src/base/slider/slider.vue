<template>
  <div class="slider" ref="slider">
    <!-- better scroll 内部元素 -->
    <!-- XXX: 横向不能被撑开，所有需要计算sliderGroup的宽度 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{ active: currentPageIndex === index }"
        v-for="(item, index) in dots"
      ></span>
    </div>
  </div>
</template>

<script>
// FIXME: 轮播图的bug 再看看这段的实现思路

import { addClass } from "common/js/dom";
import BScroll from "better-scroll";
export default {
  name: "slider",
  props: {
    loop: {
      default: true,
      type: Boolean
    },
    autoPlay: {
      default: false,
      type: Boolean
    },
    interval: {
      default: 1000,
      type: Number
    }
  },
  /*
   * dots: 保存轮播图下方小点；通过计算真实slider-item所获得
   *
   * currentPageIndex: 用于标识当前slider-item的位置
   * **/
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    /**
     * XXX: 不是很理解这个经验值的意思
     */
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this._play();
      }
    }, 20);
  },
  methods: {
    /**
     * 初始化轮播容器：sliderGroup 的宽度
     *
     * 对插槽内部的内容元素添加class属性：slider-item
     *
     * 注意：better-scroll 在实现轮播图上需要左右各克隆一个节点，因此这里的width最终需要 + 2个
     * @private
     */
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children;
      let sliderWidth = this.$refs.slider.clientWidth;
      let width = 0;
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    /**
     * 对 BScroll 进行初始化，轮播容器为：$refs.slider
     *
     * BS实例挂在至 this.slider
     *
     * 初始化对轮播滚动事件的监听：
     *  当滚动发生后，获取当前最新的pageIndex
     *  将pageIndex 设置到currentPageIndex
     *
     *  如果是自动轮播
     *    先清除定时器，而后调用_play方法进行轮播
     * @private
     */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      });

      this.slider.on("scrollEnd", this._onScrollEnd);

      this.slider.on("touchend", () => {
        console.log("touchend");
        if (this.autoPlay) {
          this._play();
        }
      });

      this.slider.on("beforeScrollStart", () => {
        console.log("beforeScrollStart");
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },

    _initDots() {
      this.dots = new Array(this.children.length);
    },
    /**
     * 向后滚动一页元素
     * @private
     */
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  }
};
</script>

<style lang="stylus">
@import "~common/stylus/variable"

.slider
  min-height: 1px
  position: relative
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
