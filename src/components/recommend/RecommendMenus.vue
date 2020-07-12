<template>
  <div class="recommend-songs-list">
    <!-- 文本内容-->
    <div class="hot-text">
      <h1>人气歌单推荐</h1>
      <span @click="jumpToSquare">发现更多</span>
    </div>
    <scroll class="scroll-wrapper" :data="data" :scrollX="true">
      <play-list-cover :data="data" @clickItem="jumpToMenusDetail"></play-list-cover>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import PlayListCover from 'base/PlaylistCover/PlaylistCover'
import Scroll from 'base/Scroll/Scroll'

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
  methods: {
    /**
     * 跳转到歌单广场
     */
    jumpToSquare() {
      this.$router.push('/songSquare')
    },
    /**
     * 跳转到指定的歌单详情页面
     */
    jumpToMenusDetail(item) {
      console.log('跳转到歌单歌单详情页面',item)
    }
  },
  components: {
    PlayListCover,
    Scroll,
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';
.recommend-songs-list
  height 200px
  width 90%
  margin 0 auto
  .hot-text
    height 45px
    line-height 45px
    font-size $font-size-recommend-title
    display flex
    justify-content space-between
    span
      font-size 12px
  .scroll-wrapper
    // 保证超出内容不换行，能够水平拖动
    white-space nowrap
    overflow hidden
    border-radius 5px
</style>
