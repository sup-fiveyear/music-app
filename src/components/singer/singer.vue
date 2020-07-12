<template>
  <div class="singer">
    <!-- 傻瓜组件：渲染歌手内容和字母表 -->
    <singer-view :artists="artistsData" @select="selectSinger" />
    <!-- 用于承担二级页面：歌手详情 -->
    <router-view></router-view>
  </div>
</template>

<script>
import SingerView from "base/SingerView/SingerView.vue";
import { getArtists } from "api/singer";
import pinyin from "pinyin";
import Singer from "common/js/singer";
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("musicSinger");
const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  components: {
    SingerView
  },
  data() {
    return {
      artistsData: []
    };
  },
  created() {
    this.getArtistsData();
  },
  methods: {
    /**
     * 功能： 响应歌手点击行为
     *
     *  - 路由跳转到歌手详情页面
     *
     *  - 向vuex中存储歌手信息
     */
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    /**
     * 1. 对数据进行两层处理
     *  - 调用_addFirstPY函数，增加initial字段并标识拼音首字母
     *  - 调用_normalizeSinger函数，进行数据二次处理
     *
     * 2. 将处理后的数据存储至 artistsData
     */
    async getArtistsData() {
      let res = await getArtists();
      let originData = res.data.artists;
      originData = this._addFirstPY(originData);
      this.artistsData = this._normalizeSinger(originData);
    },
    _addFirstPY(data) {
      data.map(item => {
        let py = pinyin(item.name[0], { style: pinyin.STYLE_FIRST_LETTER });
        item.initial = py[0][0].toUpperCase();
      });
      console.log(`提取首字母后的数据为:`, data);
      return data;
    },
    /**
     * - 默认前十条数据为热门歌手
     * - 通过Singer类包装数据
     * - 对数据进行排序
     * - 拼接数据 hot + (A-Z) 返回结果
     */
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        // 增加热门数据
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias.join(" / ")
            })
          );
        }
        // 初始化字母表数据结构
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        // 按照字母分类存储至map中
        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          })
        );
      });
      let hot = [];
      let ret = [];
      /*
       * - 对map中数据进行分区操作，存储到两个数组中：
       *  - hot 存储 热门数据
       *  - ret 存储 A - Z歌手数据
       */
      for (const key in map) {
        let val = map[key];
        if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      /**
       * - 数据排序操作
       *
       * sort 排序算法默认情况下就是对utf-16代码单元值进行排序
       *
       * 因此我们可以获取其首字母的utf-16码进行比较
       *
       * 这样直接使用sort函数相比更"严谨"
       */
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      // 最后将数据进行拼接后返回
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style lang="stylus" scoped>
.singer
  position: fixed
  top: 48px
  bottom: 0
  width: 100%
</style>
