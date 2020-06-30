<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input
      type="text"
      class="box"
      v-model="query"
      :placeholder="placeHolderText"
    />
    <i class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: {
    placeHolderText: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  created() {
    this.$watch("query", newVal => {
      this.$emit("queryChange", newVal);
    });
  }
};
</script>

<style lang="stylus" scoped>
//note: input表单样式
@import "~common/stylus/variable"
.search-box

  display flex
  height 40px
  pading 0 6px
  border-radius 6px
  border 1px solid
  align-items center
  box-sizing: border-box
  // background red
  .box
    flex 1
    margin: 0 5px
    font-size: $font-size-medium
    // 用于控制输入框高度
    line-height 18px
    outline none
    border-radius 5px
    // background red
  .icon-dismiss
    font-size: 16px
    // color: $color-background
</style>
