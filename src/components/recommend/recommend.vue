<template>
  <div class="recommend" ref="recommend">
    <!-- 抽离公共的scroll列表 -->
    <!--    XXX: 绑定data，保证当数据请求回来后，让scroll自动refresh -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--bscroll 需要包裹一个空标签,这样轮播和列表才可以一起滚动-->
      <div>
        <!--轮播组件-->
        <div
          v-if="this.recommends.length > 0"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <slider 
          @refresh="refresh"
          @xuanranchenggong="testFn"
          >
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl"></a>
              <img @load="loadImage" :src="item.picUrl" />
            </div>
          </slider>
        </div>

        <hot-song-list class="test" :data="recommendsList" v-if="_flag"></hot-song-list>
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
            <loading class v-show="discList.length === 0" />
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import {
  getDiscList,
  getRecommend,
  getRecommendList
} from "../../api/recommend";
import Slider from "@/base/slider/slider.vue";
import scroll from "@/base/scroll/scroll";
import { ERR_OK } from "../../api/config";
import { defaultImage } from "../../common/js/config";
import Loading from "../../base/loading/loading";
import HotSongList from "@/components/test/HotSongList.vue";

//FIXME: 
/**
 * - 和pc版切换后更换后，依然存在bug：点击失效
 * - 刷新闪烁问题
 * - 图片和文字不是在一起显示的
 * - 图片懒加载：能够解决闪动问题？
 */

export default {
  name: "Recommend",
  components: {
    Loading,
    Slider,
    scroll,
    HotSongList
  },
  /**
   * recommends: 保存轮播图数据
   * discList： 推荐列表数据
   * @returns {{recommends: [], discList: []}}
   */
  data() {
    return {
      recommends: [],
      discList: [],
      recommendsList: [],
      _flag: false
    };
  },
  created() {
    this.getSliderData();
    this.getdiscListData();
    this.getRecommendListData();
    this.defaultImage = defaultImage;    
    console.log(this._flag)
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
    loadImage() {      
      
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
    },
    getRecommendListData() {
      getRecommendList().then(res => {
        if (res.data) {
          let resData = res.data.result.slice(0, 6);
          console.log(resData);
          this.recommendsList = resData;
        }
      });
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

    .test{
      margin-top 30px
    }
    .recommend-list {
      width 90%
      margin 0 auto
      .list-title {
        height: 45px;
        line-height: 45px;
        text-align: left ;
        font-size: 15px;
        color: $color-theme;
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
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(50%);
      }
    }
  }
}
</style>
