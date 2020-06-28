<template>
  <div class="recommend-hot">
    <!-- 文本内容-->
    <div class="hot-text">
      <h1>人气歌单推荐</h1>
    </div>
    <!-- TODO: 抽象一个支持左右滑动的scroll组件 -->
    
    <div class="scroll-wrapper" ref="scroll">
      
      <play-list-cover :data="data"></play-list-cover>
      
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import PlayListCover from 'base/PlaylistCover/PlaylistCover'
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
  components: {
    PlayListCover
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
      // this._registerHooks(['scroll', 'scrollEnd'], (pos) => {
      //   // console.log('done')
      // })
    },
    // _registerHooks(hookNames, handler) {
    //   hookNames.forEach((name) => {
    //     this.bs.on(name, handler)
    //   })
    // }
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
    
</style>
