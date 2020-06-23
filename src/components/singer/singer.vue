<template>
  <list-view :artists="artists" class="singer" />
</template>

<script>
import listView from "../../base/listview/listView.vue";
import { getartists } from "../../api/singer";
import pinyin from "pinyin";
import Singer from "../../common/js/singer";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  components: {
    listView
  },
  data() {
    return {
      artists: []
    };
  },
  created() {
    this.getArtistsData();
  },
  methods: {
    /**
     * FIXME:  对数据的处理，放在nodejs服务器上，避免前端计算浪费过多的性能
     *
     * - 对歌手数据中，每一项增加initail字段
     * - 用于字母表的分组渲染功能
     */
    getArtistsData() {
      getartists().then(res => {
        let s = res.data.artists;
        s.map(item => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          });
          item.initial = py[0][0].toUpperCase();
        });
        this.artists = this._normalizeSinger(s);
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      /*
       * 模拟出热门数据
       *
       * - 默认选择前十条数据作为热门歌手
       *
       * **/
      list.forEach((item, index) => {
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
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
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
       * - 对map中数据进行分区操作
       *  ~ hot 存储 包含HOT_NAME的数据
       *  ~ ret 存储 正常处理后的数据
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
       * sort 排序算法默认情况下就是对utf-16代码单元值进行排序
       *
       * 因此我们可以获取其首字母的utf-16码进行比较
       *
       * 这样直接使用sort函数相比更"严谨"
       */
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    }
  }
};
</script>

<style lang="stylus" scoped>
.singer
  /*
    能够让热门title 固定在一个位置上？
  */
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
