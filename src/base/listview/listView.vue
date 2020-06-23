<template>
  <Scroll :data="artists" class="listview">
    <!--    作曲家-->
    <ul>
      <!--      拿到27个区域-->
      <li v-for="(group, index) in artists" :key="index" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <!--        区域内对应的歌手列表-->
        <ul>
          <li
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
          >
            <!--            FIXME: v-lazy 为什么会导致图片加载迟缓和异样发生？-->
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </Scroll>
</template>

<script>
import Scroll from "../scroll/scroll";
export default {
  components: { Scroll },
  props: {
    artists: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable';
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  .list-group
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      background: $color-sub-theme
    .list-group-item
      display flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius: 50%
      .name
        margin-left: 20px
        font-size: $font-size-medium
</style>
