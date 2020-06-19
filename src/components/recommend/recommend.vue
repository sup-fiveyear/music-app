<template>
  <div>
    recommend
    <div class="recommend" ref="recommend">
    <!--轮播组件-->
      <div
        v-if="this.recommends.length > 0"
        class="slider-wrapper"
        ref="sliderWrapper"
      >
        <slider>
          <div v-for="(item, index) in recommends" :key="index">
            <a :href="item.linkUrl"></a>
            <img :src="item.picUrl" />
          </div>
        </slider>
      </div>
    <!--推荐列表-->

    </div>
  </div>
</template>

<script>
import { getDiscList, getRecommend } from "../../api/recommend";
import Slider from "@/base/slider/slider.vue";
export default {
  name: "Recommend",
  components: {
    Slider
  },
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this.getSliderData();
    console.log(getDiscList());
  },
  methods: {
    getSliderData() {
      getRecommend()
        .then(data => {
          this.recommends = data.data.slider;
        })
        .catch(err => {
          console.log(`获取轮播图数据出错，${err}`);
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
</style>
