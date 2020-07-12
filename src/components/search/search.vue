<template>
  <transition appear name="slide">
    <div class="search">
      <!--输入框-->
      <SearchBox
        ref="searchBox"
        @showAllSearch="showAllSearch"
        @query="onQueryChange"
        @goRecommend="goRecommend"
      >
      </SearchBox>
      <!-- 热门搜索和历史 -->
      <div class="default-content-wrapper" v-show="!query">
        <Scroll
          ref="historyScroll"
          class="out-scroll-wrapper"
          :data="hotKeyData"
          :click="true"
        >
          <div>
            <!-- 历史 -->
            <SearchHistoryList
              class="search-history-list"
              :searchData="searchHistory"
              @select="selectHistoryItem"
              @clearAllSearch="clearAllSearchHistory"
            ></SearchHistoryList>
            <!-- 热门搜索 -->
            <SearchHotList
              class="search-hot-list"
              :hotKeyData="hotKeyData"
              @hotListClick="additionalSearchKey"
            ></SearchHotList>
          </div>
        </Scroll>
      </div>
      <!-- 搜索词条组件 -->
      <div class="search-result" v-show="query">
        <SearchSuggest
          :searchKey="query"
          @selectItem="selectItemHandle"
        ></SearchSuggest>
      </div>
    </div>
  </transition>
</template>
<script>
import SearchBox from "base/SearchBox/SearchBox";
import Scroll from "base/Scroll/Scroll";
import SearchSuggest from "./SearchSuggest";
import SearchHistoryList from "./SearchHistoryList";
import { getHotKey } from "api/search";
import { ERR_OK } from "common/js/config";
import SearchHotList from "./SearchHotList";

import { createNamespacedHelpers } from "vuex";
const { mapActions: musicPlayerMapActions } = createNamespacedHelpers(
  "musicPlayer"
);
const { mapActions: searchMapActions, mapGetters } = createNamespacedHelpers(
  "search"
);
export default {
  name: "Search",
  data() {
    return {
      query: "",
      hotKeyData: [],
      mockHistory: ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
      hideAllSearch: true
    };
  },
  computed: {
    shortcut() {
      return this.hotKeyData.concat(this.searchHistory);
    },
    ...mapGetters(["searchHistory"])
  },
  created() {
    this.getHotKeyData();
  },
  watch: {
    searchKey(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
    hideAllSearch(newVal) {
      console.log("hideAllSearch ", newVal);
      setTimeout(() => {
        this.$refs.historyScroll.refresh();
      }, 20);
    }
  },
  methods: {
    /**
     * 功能：
     *  修改搜索框中的query
     * */
    additionalSearchKey(hotKey) {
      this.$refs.searchBox.query = hotKey.searchWord || "";
    },
    saveHistoryQuery(item) {
      this.saveSearchHistory(item.name);
    },
    onQueryChange(query) {
      // 处理带空格的情况
      this.query = query.trim();
    },
    showAllSearch() {
      console.log("showAllSearch");
      this.hideAllSearch = false;
      this.$emit("showRecommend", false);
    },
    goRecommend() {
      this.$router.push("/recommend");
      this.query = "";
      this.$refs.searchBox.query = "";
    },
    inputBlur() {
      this.$refs.searchBox.blur();
    },
    /**
     * 功能：
     *  - 插入歌曲，并播放
     *  - 保存当前搜索词条
     *
     */
    selectItemHandle(item) {
      this.insertSong(item);
      this.saveHistoryQuery(item);
      this.$refs.searchBox.query = "";
    },
    selectHistoryItem(item) {
      this.$refs.searchBox.query = item || "";
      console.log("item", item);
    },
    async getHotKeyData() {
      let resData = await getHotKey();
      // console.log(resData);
      if (resData.status === ERR_OK) {
        this.hotKeyData = resData.data.data;
      }
    },
    addQuery(hotKey) {
      this.$refs.searchBox.setQuery(hotKey);
    },
    queryChangeHandle(newQuery) {
      // console.log("拿到内部组件传递的query", newQuery);
      this.query = newQuery;
    },
    queryClearHandle() {
      this.$refs.searchSuggest.songs = [];
      this.$refs.searchSuggest.haveMore = true;
    },
    ...musicPlayerMapActions(["insertSong"]),
    ...searchMapActions(["saveSearchHistory", "clearAllSearchHistory"])
  },
  components: {
    SearchHotList,
    SearchBox,
    SearchSuggest,
    Scroll,
    SearchHistoryList
  }
};
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable';
  .slide-enter-active, .slide-leave-active {
    transition: all 0.1s
    opacity: 1;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%,0, 0);
    opacity: 0;
  }

.search
  height 100%
  .default-content-wrapper
    position: absolute
    top: 68px
    left: 0
    right: 0
    bottom: 0
    width: 95%
    margin 0 auto
    .out-scroll-wrapper
      // NOTE: betterScroll 外层容器高度必须初始化时确定，并且拥有overflow属性
      overflow hidden
      height 100%
      .search-history-list
        margin-bottom 20px;
  .search-result
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
