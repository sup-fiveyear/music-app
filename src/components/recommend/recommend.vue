<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="sliderData">
      <div>
        <!--轮播组件-->
        <div
          v-if="this.sliderData.length > 0"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <slider @refresh="refresh" @xuanranchenggong="testFn">
            <div v-for="(item, index) in sliderData" :key="index">
              <a :href="item.linkUrl"></a>
              <img @load="loadImage" :src="item.picUrl" />
            </div>
          </slider>
        </div>
        <!--推荐歌单-->
        <recommend-songs-list
          class="recommend-songs-list"
          :data="recommendDsicData"
        ></recommend-songs-list>
        <!--推荐歌曲-->
        <recommend-songs :data="recommendSongsData"></recommend-songs>
      </div>
    </scroll>
  </div>
</template>

<script>
import {
  getDiscList,
  getRecommend,
  getRecommendDsic,
  getRecommendSongs
} from "../../api/recommend";
import Slider from "@/base/slider/slider.vue";
import Scroll from "@/base/Scroll/Scroll";
// import { ERR_OK } from "../../api/config";
import { defaultImage, ERR_OK } from "common/js/config";
import { createRecommendSong } from "common/js/song";
import RecommendSongsList from "./RecommendSongsList.vue";
import RecommendSongs from "./RecommendSongs.vue";

//FIXME:
/**
 * - 和pc版切换后更换后，依然存在bug：点击失效
 * - 刷新闪烁问题
 * - 图片和文字不是在一起显示的
 * - 图片懒加载：能够解决闪动问题？
 * - 刷新导致轮播图放大
 * - 轮播图上面缺一角
 */

export default {
  name: "Recommend",
  components: {
    Slider,
    Scroll,
    RecommendSongsList,
    RecommendSongs
  },
  /**
   * recommends: 保存轮播图数据
   * discList： 推荐列表数据
   * @returns {{recommends: [], discList: []}}
   */
  data() {
    return {
      sliderData: [],
      recommendDsicData: [],
      recommendSongsData: [],
      _flag: false
    };
  },
  created() {
    this._getSliderData();
    this._getRecommendDsicData();
    this._getRecommendSongsData();
    this.defaultImage = defaultImage;
  },

  methods: {
    /**
     * 虽然已经没有了这个bug，但这种处理思想还是值得学习的
     *
     * 图片高度撑开后，重新计算高度，保证滚动事件有效
     */
    testFn(e) {
      this._flag = e;
    },
    loadImage() {},
    refresh() {
      this.$refs.scroll.refresh();
    },
    // TODO: 轮播图的接口需要改一下
    _getSliderData() {
      getRecommend()
        .then(res => {
          if (res.code === 0) {
            this.sliderData = res.data.slider;
          }
        })
        .catch(err => {
          console.log(`获取轮播图数据出错，${err}`);
        });
    },
    _getRecommendDsicData() {
      getRecommendDsic().then(res => {
        if (res.data) {
          let resData = res.data.result.slice(0, 6);
          this.recommendDsicData = resData;
        }
      });
    },
    _getRecommendSongsData() {
      getRecommendSongs()
        .then(res => {
          console.log(res);

          if (res.status === ERR_OK) {
            console.log(1);
            console.log(res.data);
            let songsList = res.data.result.map(item => {
              return createRecommendSong(item);
            });
            console.log(songsList);
            this.recommendSongsData = songsList;
          }
        })
        .catch(e => console.log(e));
    }
  }
};
</script>

<style lang="stylus">
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 90%;
      overflow: hidden;
      border-radius 8px
      margin 0 auto;
    }
    .recommend-songs-list{
      margin-top 10px
    }
  }
</style>
