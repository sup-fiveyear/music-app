<template>
  <Scroll
    class="suggest"
    :data="songs"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    :click="true"
    @scrollToEnd="getSearchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in songs"
        @click="selectItem(item)"
        :key="index"
      >
        {{ item.name }} - {{ _artistsName(index) }}
      </li>
      <loading v-show="showLoading" title=""></loading>
    </ul>
    <div v-show="!haveMore && !songs.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </Scroll>
</template>

<script>
import { getSearchSongs, getSongDetail } from "api/search";
import loading from "base/loading/loading";
import NoResult from "base/NoResult/NoResult";
import Scroll from "base/Scroll/Scroll";
import { ERR_OK } from "common/js/config";
import { debounce } from "common/js/util";
import { createSearchSong } from "common/js/song";
const MAX_LOAD_MORE = 61;
export default {
  name: "SearchSuggest",
  props: {
    searchKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      songs: [],
      pullup: true,
      // 用于监听页面滚动
      // 向外派发，使得input 产生blur效果
      beforeScroll: true,
      haveMore: true,
      page: 0
    };
  },
  computed: {
    showLoading() {
      return this.songs.length >= 30 && this.haveMore;
    }
  },
  created() {
    this.$watch(
      "searchKey",
      debounce(query => {
        if (query) {
          this.getSuggestData(query);
        }
      }, 500)
    );
  },
  methods: {
    listScroll() {
      this.$emit("listScroll");
    },
    async getSearchMore() {
      console.log("触发加载更多");
      if (!this.haveMore || !this.searchKey) {
        return;
      }
      if (this.page >= MAX_LOAD_MORE) {
        this.haveMore = false;
        return;
      }
      let res = await getSearchSongs(this.searchKey, this.page);
      let list = res.data.result.songs;
      if (!res.data.result.songs) {
        this.haveMore = false;
        return;
      }
      let ret = [];
      list.forEach(item => {
        ret.push(createSearchSong(item));
      });
      this.page += 30;
      this.songs = this.songs.concat(ret);
      // this.$emit('refresh')
    },
    async getSuggestData(query) {
      this.haveMore = true;
      this.page = 0;
      if (query === "") {
        console.log("捕获到空query");
        return;
      }
      let { data: res } = await getSearchSongs(query);
      if (res.code === ERR_OK) {
        let list = res.result.songs;
        let ret = [];
        //边界处理，如果当前搜索不到歌曲
        if (!list) {
          this.songs = [];
          this.haveMore = false;
          return;
        }
        list.forEach(song => {
          ret.push(createSearchSong(song));
        });
        // console.log(`格式化的数据为：`, ret);
        this.songs = ret;
      }
    },
    /**
     * 功能：
     *  - 向外派发当前点击歌手的信息，以便做历史搜索
     *  - 播放当前歌曲
     * @param item
     * @returns {Promise<void>}
     */
    async selectItem(item) {
      let res = await getSongDetail(item.id);
      item.image = res.data.songs[0].al.picUrl;
      this.$emit("selectItem", item);
    },
    _artistsName(index) {
      return this.songs[index].singer || "";
    }
  },
  components: {
    Scroll,
    loading,
    NoResult
  }
};
</script>

<style lang="stylus" scoped>
.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
      font-size 12px
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
