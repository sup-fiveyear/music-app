<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";

/**
 * 对bscroll 进行初始化工作
 */
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    /**
     * 初始化bscroll
     *
     */
    _initScroll() {
      // 保证bscroll初始化时不会出错
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });

      //向外触发scroll事件，并传递当前的位置
      if (this.listenScroll) {
        // 在箭头函数中的this是指向scroll自身的
        // 需要让其指向当前组件实例，所以保存了this
        let me = this;
        console.log('scroll')
        this.scroll.on("scroll", pos => {
          me.$emit("scroll", pos);
        });
      }

      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd");
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    /**
     * 对bscroll 进行方法代理
     *
     *
     */
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },

  /*
   * 保证当外部数据发生改变后，scroll组件能够自动刷新
   * 保证能够正确点击和拖动
   *
   * **/
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
