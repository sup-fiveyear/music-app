<template>
  <div class="search-box-wrapper">
    <div class="search-box">
      <i class="icon-search"></i>
      <input
        type="text"
        class="box"
        v-model="query"
        :placeholder="placeHolderText"
        ref="input"
        @click="test"
        autofocus="true"
      />
      <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
    </div>
    <button class="back-button" @click.stop="goRecommend"
    >测试
    </button>
  </div>
</template>

<!--FIXME: 通过键盘删除关键字时，不会清除上一次的结果-->
<script>
  import {debounce} from "common/js/util";
  // import { createNamespacedHelpers } from "vuex";

  // const { mapMutations } = createNamespacedHelpers("search");
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
      this.changeFouce();
      this.$watch(
        "query",
        debounce(newQuery => {
          this.$emit("query", newQuery);
        }, 100)
      );
    },
    methods: {
      changeFouce(){
        this.$nextTick((x)=>{   //正确写法
          this.$refs.inputs.focus();
        })
        this.$refs.inputs.focus(); //错误写法

      },
      blur() {
        this.$refs.input.blur();
      },
      setQuery(query) {
        this.query = query;
      },
      clearQuery() {
        this.query = "";
      },
      goRecommend() {
        this.$emit('goRecommend')
      }
      // ...mapMutations({
      //   setKey: "SET_SEARCH_KEY"
      // })
    }
  };
</script>

<style lang="stylus" scoped>
  //note: input表单样式
  @import "~common/stylus/variable"
  .search-box-wrapper
    display flex
    align-items center
    padding-left 20px;
    .search-box
      display flex
      width 75%
      height 30px;
      border-radius 15px
      pading 0 6px
      align-items center
      box-sizing: border-box
      background $color-input
      margin 10px 0;
      .icon-search
        margin-left 10px
      .box
        flex 1
        margin: 0 5px
        font-size: $font-size-medium
        // 用于控制输入框高度
        line-height 18px
        outline none
        border-radius 5px
        background $color-input
      .icon-dismiss
        font-size: 16px
        margin-right 10px
    .back-button
      margin-left 10px
      height 30px
      line-height 30px
      outline none
      border none
      background none

    // color: $color-background
</style>
