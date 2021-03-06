<template>
  <div class="slider" ref="slider">
    <!-- better Scroll 内部元素 -->
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
  // FIXME: 轮播图点击失效

  import {addClass} from "common/js/dom";
  import BScroll from "better-scroll";

  export default {
    name: "slider",
    props: {
      loop: {
        default: true,
        type: Boolean
      },
      autoPlay: {
        default: true,
        type: Boolean
      },
      interval: {
        default: 2000,
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
      setTimeout(() => {
        // 动态计算轮播图的宽度
        this._setSliderWidth();
        // 之所以在initSlider前初始化，是为了保证dots的数量正确性
        this._initDots();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      }, 20);
      /**
       * FIX: 当窗口大小发生改变后，会导致BScroll失效
       * 方案：
       *  - 重新计算轮播图的宽度
       *  - 调用 BS 的 进行刷新
       * */
      window.addEventListener("resize", () => {
        if (!this.slider || !this.slider.enabled) {
          return;
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
          this.refresh()
        }, 60);
      });
    },
    methods: {
      /**
       * 当视口改变后，需要重新计算轮播图的宽度，同时调用betterScroll的重置方法
       * */
      refresh () {
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      },
      /**
       * 初始化轮播容器：sliderGroup 的宽度
       *
       * 对插槽内部的内容元素添加class属性：slider-item，使其获得 正确的样式
       *
       * 注意：better-Scroll 在实现轮播图上需要左右各克隆一个节点，因此这里的width宽度最终需要 + 2个
       *
       *
       * @private
       * @param {boolean} resize true:不需要再对图片进行左右克隆操作
       */
      _setSliderWidth(resize) {
        this.children = this.$refs.sliderGroup.children;
        let sliderWidth = this.$refs.slider.clientWidth;
        let width = 0;
        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i];
          addClass(child, "slider-item");
          child.style.width = sliderWidth + "px";
          width += sliderWidth;
        }
        if (this.loop && !resize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + "px";
      },
      /**
       * 根据真实数据，动态计算出dots的数量
       * */
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      /**
       * 重点：BScroll 初始化报错，或者点击失效通常是两个原因：
       *  - 高度计算有误
       *  - dom 还没有真实渲染
       *
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
          click: true,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });
        /**
         * 当手指开始触摸时，需要清空自动轮播的定时器，保证拖动后才开始自动轮播
         *
         * 有点防抖的那个意思
         */
        this.slider.on("beforeScrollStart", () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
        /**
         * 当触摸结束后，如果是自动轮播，需要开启新的定时器，保证能够自动播放
         */
        this.slider.on("touchend", () => {
          if (this.autoPlay) {
            this._play();
          }
        });
        // 更新当前索引
        this.slider.on("scrollEnd", this._onScrollEnd);
      },
      /**
       * 轮播图播放一帧后更新 currentPageIndex 的值
       */
      _onScrollEnd() {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this._play();
        }
      },
      /**
       * 1. 轮播核心功能，有他才能向后、向前滚动
       *
       * 2. 为自动轮播提供的功能
       *
       * 需要做一个防抖操作，避免帕金森患者
       *
       * 主要是调用betterscoll的next方法
       */
      _play() {
        // 防止手动滑动后，重复触发定时器
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      },
    },
  };
</script>

<style lang="stylus">
  @import '~common/stylus/variable';

  .slider {
    min-height: 1px;
    position: relative;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 16px;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;

        &.active {
          width: 8px;
          border-radius: 5px;
          background: $color-theme;
        }
      }
    }
  }
</style>
