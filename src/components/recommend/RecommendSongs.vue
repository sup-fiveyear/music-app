<template>
  <div class="recommend-list">
    <div class="recommend-title">
      <h1 class="list-title">最热歌曲推荐</h1>
      <!--<i class="iconfont icon-bofang"></i>-->
      <!--全部播放布局如何对齐？-->
      <span @click="playAllSongs">全部播放</span>
    </div>
    <ul>
      <li
        @click="playCurrentSong(item)"
        class="item"
        v-for="(item, index) in data"
        :key="index"
      >
        <!--左边：图片-->
        <div class="icon">
          <img width="60" height="60" v-lazy="item.image" />
        </div>
        <!--右边：文本内容-->
        <div class="text">
          <h2 class="song-name" v-html="item.name"></h2>
          <p class="singer-name" v-html="item.singer"></p>
        </div>
        <div class="icon-play">
          <span class="iconfont icon-bofang"></span>
        </div>
      </li>
    </ul>
    <div class="loading-container">
      <loading class v-show="data.length === 0" />
    </div>
  </div>
</template>

<script>
  import loading from "../../base/loading/loading";
export default {
  //FIXME：底部回弹如何解决？
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    /**
     * 拿到歌曲id，调用vuex 设置当前歌曲即可
     * @param item
     */
    playCurrentSong(item) {
      console.log(`播放当前歌曲`,item)
    },
    /**
     * 播放当前歌曲列表的所有歌曲
     */
    playAllSongs() {
      console.log(`播放所有歌曲`,this.data)
    }
  },
  components: {
    loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
//TODO:
.recommend-list {
  width 90%
  margin 0 auto
  .recommend-title {
    height 45px
    line-height 45px
    display flex
    justify-content space-between
    height: 45px;
    line-height: 45px;
    font-size: $font-size-recommend-title;
  }
  .list-title {
  }
  span {
    font-size 12px
  }

  .item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    height 75px;
    padding: 5px 0
    .icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 20px;

      img {
        border 1px solid #e2e2e2;
        border-radius 5px
      }
    }
    .text {
      height 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;
      font-size: 12px;
      .name {
        margin-bottom: 10px;
      }
      .desc {
      }
    }
    .icon-play{
      width 50px;
      height 50px;
      line-height 50px
      text-align center
    }
      .iconfont{
        font-size 15px;
      }
  }
}
</style>
