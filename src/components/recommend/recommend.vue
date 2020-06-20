<template>
  <div class="recommend" ref="recommend">
    <!--    XXX: 绑定data -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--bscroll 需要包裹一个空标签-->
      <div>
        <!--轮播组件-->
        <div
          v-if="this.recommends.length > 0"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <slider @refresh="refresh">
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl"></a>
              <img @load="loadImage" :src="item.picUrl" />
            </div>
          </slider>
        </div>
        <!--推荐列表-->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList">
              <!--            左边：图片-->
              <div class="icon">
                <a :href="item.linkUrl">
                  <img
                    width="60"
                    height="60"
                    :src="defaultImage"
                    v-lazy="item.imgurl"
                  />
                </a>
              </div>
              <!--            右边：文本内容-->
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
          <div class="loading-container">
            <loading class="" v-show="discList.length === 0" />
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getDiscList, getRecommend } from "../../api/recommend";
import Slider from "@/base/slider/slider.vue";
import scroll from "@/base/scroll/scroll";
import { ERR_OK } from "../../api/config";
import { defaultImage } from "../../common/js/config";
import Loading from "../../base/loading/loading";

//FIXME: 和pc版切换后更换后，依然存在bug：点击失效

export default {
  name: "Recommend",
  components: {
    Loading,
    Slider,
    scroll
  },
  /**
   * recommends: 保存轮播图数据
   * discList： 推荐列表数据
   * @returns {{recommends: [], discList: []}}
   */
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this.getSliderData();
    this.getdiscListData();
    this.defaultImage = defaultImage;
  },
  methods: {
    /**
     * 虽然已经没有了这个bug，但这种处理思想还是值得学习的
     *
     *
     */
    loadImage() {
      if (!this.checkloaded) {
        console.log("loadImage");
        this.checkloaded = true;
        this.refresh();
      }
    },
    refresh() {
      this.$refs.scroll.refresh();
    },
    getSliderData() {
      getRecommend()
        .then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
        .catch(err => {
          console.log(`获取轮播图数据出错，${err}`);
        });
    },
    getdiscListData() {
      getDiscList()
        .then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        })
        .catch(err => {
          console.log(`获取推荐列表数据出错，${err}`);
        });
    }
  }
};
</script>

<style lang="stylus">
// @import "~common/stylus/variable.styl"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0

    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
        .loading-container
          position absolute
          width 100%
          top 50%
          transform translateY(50%)
</style>
