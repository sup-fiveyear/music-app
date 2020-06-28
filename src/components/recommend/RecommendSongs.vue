<template>
  <div class="recommend-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li class="item" v-for="(item, index) in songList" :key="index">
        <!--左边：图片-->
        <div class="icon">
          <a :href="item.linkUrl">
            <img
              width="60"
              height="60"              
              v-lazy="item.imgurl"
            />
          </a>
        </div>
        <!--右边：文本内容-->
        <div class="text">
          <h2 class="name" v-html="item.creator.name"></h2>
          <p class="desc" v-html="item.dissname"></p>
        </div>
      </li>
    </ul>
    <div class="loading-container">
      <loading class v-show="songList.length === 0" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      songList: {
        type: Array,
        default: []
      },
    },
  }
</script>

<style lang="stylus" scoped>

</style>