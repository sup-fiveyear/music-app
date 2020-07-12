<template>
  <div class="history-wrapper">
    <h1 class="history-title">
      <span class="history-text">搜索历史</span>
      <span class="history-clear">
        <i class="icon-clear" @click="clearAllSearch"></i>
      </span>
    </h1>
    <Scroll ref="historyScroll" class="history-scroll-wrapper" :data="searchData" :scrollX="scrollX" >
      <div class="history-scroll-content" v-show="searchData.length">
          <div :key="index" class="history-list-item" @click="selectItem(item)" v-for="(item,index) in searchData">
            <span class="text">{{item}}</span>
          </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
  /**
   * TODO:
   *
   *
   *
   *
   *  - 拦截弹框组件
   */
  import Scroll from "../../base/Scroll/Scroll";

  export default {
    components: {Scroll},
    props: {
      searchData: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        scrollX: true,
      }
    },
    watch: {
      //FIXME: 间接性的存在问题：添加新的词条后不能滚动
      searchData() {
        setTimeout(() => {
          this.$refs.historyScroll.refresh()
        },20)
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      clearAllSearch() {
        this.$emit('clearAllSearch')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
    .history-wrapper

      .history-title
        display flex
        justify-content space-between

      .history-scroll-wrapper
      // 保证超出内容不换行，能够水平拖动
        white-space nowrap
        overflow hidden
        /*border-radius 5px*/
        .history-scroll-content
          // 保证在BScroll 中能够左右滑动
          display inline-block
          .history-list-item
            display inline-block
            min-width 50px
            height 35px
            line-height 35px
            text-align center
            padding 0 5px
            border-radius 10px
            background #e2e2e2
            margin 0 10px
</style>
