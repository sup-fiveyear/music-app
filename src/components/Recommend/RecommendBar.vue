<template>
  <div class="recommend-bar-wrapper">
    <scroll :data="tabData" :scrollX="true">
      <div class="recommend-content">
        <div class="content-item" v-for="(item,index) in tabData" :key="index">
          <div class="flex-wrapper">
            <i :class="item.iconName" class="icon-cycle"></i>
            <span class="label">{{item.name}}</span>
          </div>
        </div>
      </div>
    </scroll>
</template>

<script>
  import Scroll from "../../base/Scroll/Scroll";
  export default {
    name: "RecommendBar.vue",
    components: {Scroll},
    props: {
      tabData: {
        type: Array,
        default: []
      },
    }
  }
</script>


<style lang="stylus" scoped>
  @import '~common/stylus/variable';
  .recommend-bar-wrapper
    width 90%
    margin 0 auto;
    /*display flex*/
    /*align-items center;*/
    height 70px;
    overflow hidden
    white-space nowrap
    .recommend-content
      display inline-block
      margin-top 25px;
      .content-item
        display inline-block
        .flex-wrapper
          display flex
        .iconfont
          color #fff
          font-size 18px;
        .icon-cycle
          padding 8px;
          box-sizing border-box;
          background $color-all-active
          border-radius 50%;
        .label
          margin-top 10px;
</style>
