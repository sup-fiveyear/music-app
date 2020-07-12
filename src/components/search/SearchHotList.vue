<template>
  <div class="hot-search-wrapper">
    <div class="hot-title">
      <h1>热门搜索</h1>
    </div>
      <div class="hot-list-content">
        <!--外层flex 控制每个item-->
        <div
          class="hot-list-item"
          v-for="(item, index) in hotKeyData"
          :key="index"
          @click="hotListClick(item)"
        >
          <!--内层flex 控制具体内容展示-->
          <p>{{index + 1}} {{ item.searchWord }}</p>
          <p>{{item.content}}</p>
        </div>
      </div>
  </div>
</template>

<script>

  export default {
    name: "SearchHotList",
    props: {
      hotKeyData: {
        type: Array,
        default: []
      },
    },
    methods: {
      hotListClick(item) {
        this.$emit('hotListClick',item)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .hot-search-wrapper
    .hot-title
    .hot-list-content
      display flex
      flex-wrap wrap
      text-align left
      .hot-list-item
        flex 1 0 50%
        box-sizing border-box
        padding 35px 5px;
        /*display flex*/
</style>
