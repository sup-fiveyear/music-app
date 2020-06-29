<template>
  <div class="recommend-list">
    <div class="recommend-title">
      <h1 class="list-title">热门歌单推荐</h1>
      <span>全部播放</span>
    </div>
    <ul>
      <li
        @click="startPlaying"
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
          <span></span>
        </div>
      </li>
    </ul>
    <div class="loading-container">
      <loading class v-show="data.length === 0" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    startPlaying() {
      console.log(`准备跳转到歌曲播放页面`);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
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
    padding: 5px 0

    .icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 20px;
      img {
        border-radius 5px
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 15px;
      overflow: hidden;
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
      background red
    }
  }
}
</style>
