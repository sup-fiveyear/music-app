<template>
  <div class="recommend-hot">
    <!-- 文本内容-->
    <div class="hot-text">
      <h1>人气歌单推荐</h1>
    </div>
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="(item, index) in data" :key="index">
          <div class="icon">
            <div class="gradients"></div>
            <img class="scroll-img" v-lazy="item.picUrl" alt="" />
          </div>
          <!-- 播放量 -->
          <p class="play-count">
            <!-- <i class="fa fa-headphones"></i> -->
            {{ Math.floor(item.playCount / 10000) }}万
          </p>
          <!-- 文本内容 -->
          <div class="text">
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { defaultImage } from '@/common/js/config'

export default {
  props : {
    data : {
      type: Array,
      default: [],
    },
    go: {
      type: Boolean,
      default:false
    }
  },
  data () {
    return {
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.bs.destroy()
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollX: true,
        probeType: 3 // listening scroll hook
      })
      this._registerHooks(['scroll', 'scrollEnd'], (pos) => {
        console.log('done')
      })
    },
    _registerHooks(hookNames, handler) {
      hookNames.forEach((name) => {
        this.bs.on(name, handler)
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';
// TODO: 如何使用css3选择器？选择第一个元素将其左边推出5px

.recommend-hot
  height 200px
  width 90%
  margin 0 auto
  .hot-text
    height 45px
    line-height 45px
    font-size $font-size-recommend-title
  .scroll-wrapper

    // 保证超出内容不换行，能够水平拖动
    white-space nowrap
    overflow hidden

    border-radius 5px
    .scroll-content
      // 必须保证，否则无法生效
      display inline-block
      height 150px
    .scroll-item
      position relative
      width 100px;
      font-size 24px
      display inline-block
      text-align center
      margin 0 5px
      .icon
        .scroll-img
          width 100%
          height  100%
          border-radius 5px
      .play-count
        position absolute
        top 0
        right 5px
        line-height $font-size-small-s
        font-size $font-size-small-s
        color #fff
      .text
        /**
          防止继承自父元素的no-wrap
          能够让文字换行显示
         */
        white-space: normal;
        float left
        margin-top 5px
        padding-bottom 20px
        .name
          line-height $font-size-small
          font-size $font-size-small
          text-align left
          height 36px
</style>
