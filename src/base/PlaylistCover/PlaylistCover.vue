<template>
  <div class="list-content">
    <div class="scroll-item" v-for="(item, index) in data" :key="index">
      <div class="list-img-content">
        <div class="gradients"></div>
        <img class="list-img" v-lazy="item.picUrl" alt="" />
      </div>
      <!-- 播放量 -->
      <p class="play-count">{{ Math.floor(item.playCount / 10000) }}万</p>
      <!-- 文本内容 -->
      <div class="text">
        <p class="name">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
.list-content
    // 保证在BScroll 中能够左右滑动
    display inline-block
  .scroll-item
    position relative
    width 100px;
    font-size 24px
    display inline-block
    margin 0 5px
    text-align left
    .list-img-content
      .gradients
        position absolute
        top 0
        background linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0))
      .list-img
        width 100%
        height  100%
        border-radius 5px
    .play-count
      position absolute
      top 5px
      right 5px
      line-height $font-size-small-s
      font-size $font-size-small-s
    .text
      /**
        防止继承自父元素的no-wrap
        能够让文字换行显示
       */
      white-space: normal;
      float left
      margin-top 5px
      .name
        font-size $font-size-small
        line-height 15px
</style>
