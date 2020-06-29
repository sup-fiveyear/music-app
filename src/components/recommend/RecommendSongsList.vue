<template>
  <div class="recommend-songs-list">
    <!-- 文本内容-->
    <div class="hot-text">
      <h1>人气歌单推荐</h1>
      <span>发现更多</span>
    </div>
    <scroll class="scroll-wrapper" :data="data" :scrollX="true">
      <play-list-cover :data="data"></play-list-cover>
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
