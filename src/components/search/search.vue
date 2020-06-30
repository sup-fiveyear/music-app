<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box @queryChange="queryChangeHandle"></search-box>
    </div>
    <!-- 热门搜索和历史 -->
    <div class="shortcut-wrapper">
      <div>
        <!-- 热门搜索 -->
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li>
              <span></span>
            </li>
          </ul>
        </div>
        <!-- 搜索历史 -->
        <div class="search-history">
          <h1 class="title">
            <span class="text"></span>
            <span class="clear"></span>
            <i class="icon-clear"></i>
          </h1>
          <!-- 历史词条组件 -->
        </div>
      </div>
    </div>
    <!-- 搜索词条组件 -->
    <div class="search-result"></div>
  </div>
</template>
<script>
import SearchBox from "base/SearchBox/SearchBox";
export default {
  name: "Search",
  methods: {
    queryChangeHandle(newQuery) {
      console.log("拿到内部组件传递的query", newQuery);
    }
  },
  components: {
    SearchBox
  }
};
</script>

<style lang="stylus" scoped>
.search
  .search-box-wrapper
    margin 20px
</style>
