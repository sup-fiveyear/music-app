<template>
  <div class="recommend" ref="recommend">
    <!--头部input-->
    <div class="recommend-header">
      <div @click="jumpToSearchPage" ref="recommendSearch" class="recommend-search-wrapper">
        <i class="icon-search"></i>
      </div>
    </div>
    <!--全屏滚动内容-->
    <!--FIXME: scroll data绑定的内容，需要通过计算属性计算-->
    <scroll
      ref="scroll"
      class="recommend-content"
      :data="bannerData"
      :click="true"
    >
      <!--scroll组件只能让第一个元素进行滚动-->
      <div>
        <!--轮播组件-->
        <div class="slider-background" v-if="this.bannerData.length <= 0"></div>
        <div
          v-if="this.bannerData.length > 0"
          class="slider-wrapper"
          ref="sliderWrapper"
        >
          <div class="slider-content">
            <slider
              @refresh="refresh"
              @xuanranchenggong="testFn"
            >
              <div v-for="(item, index) in bannerData" :key="index">
                <a href="https://music.163.com/#/discover">
                  <img  @load="loadImage" :src="item.imageUrl"/>
                </a>
              </div>
            </slider>
          </div>
        </div>
        <!--推荐歌单-->
        <tab></tab>
        <recommend-menus
          class="recommend-songs-list"
          v-if="recommendDsicData.length > 0"
          :data="recommendDsicData"
        ></recommend-menus>
        <!--推荐歌曲-->
        <recommend-songs v-if="recommendSongsData.length > 0" :data="recommendSongsData"></recommend-songs>
      </div>
    </scroll>
  </div>
</template>

<script>
  //TODO: 下拉刷新功能实现
  //TODO: ！！！代码体积太大，需要做优化
  import {
    getBanner,
    getRecommendList,
    getRecommendSongs
  } from "../../api/recommend";
  import Slider from "@/base/slider/slider.vue";
  import Scroll from "@/base/Scroll/Scroll";
  import {defaultImage, ERR_OK} from "common/js/config";
  import {createRecommendSong} from "common/js/song";
  import RecommendMenus from "./RecommendMenus.vue";
  import RecommendSongs from "./RecommendSongs.vue";
  import {addClass} from "../../common/js/dom";
  import Tab from 'components/Tab/Tab'
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
      RecommendMenus,
      RecommendSongs,
      Tab
    },
    /**
     * recommends: 保存轮播图数据
     * discList： 推荐列表数据
     * @returns {{recommends: [], discList: []}}
     */
    data() {
      return {
        bannerData: [],
        recommendDsicData: [],
        recommendSongsData: [],
        _flag: false,
        showRecommend: true,
        tabData: [
          {
            iconName: 'iconfont icon-gedan',
            name: '歌单'
          },
          {
            iconName: 'iconfont icon-paihangbang',
            name: '排行榜'
          },
          {
            iconName: 'iconfont icon-zhibo',
            name: '直播'
          },
          {
            iconName: 'iconfont icon-diantai',
            name: '电台'
          },
          {
            iconName: 'iconfont icon-gedan',
            name: '歌单'
          },
          {
            iconName: 'iconfont icon-paihangbang',
            name: '排行榜'
          },
          {
            iconName: 'iconfont icon-zhibo',
            name: '直播'
          },
          {
            iconName: 'iconfont icon-diantai',
            name: '电台'
          },
        ]
      };
    },
    created() {
      this._getSliderData();
      this._getRecommendMenusData();
      this._getRecommendSongsData();
      this.defaultImage = defaultImage;
    },

    methods: {
      jumpToSearchPage() {
        this.$router.push("/search");
      },
      /**
       * 用来切换推荐内容和搜索内容
       */
      showRecommendHandle(isShow) {
        this.showRecommend = isShow;
      },
      test() {
        this.showRecommend = false;
        console.log("1");
        //  动画
        console.log(this.$refs.recommendSearch);
        addClass(this.$refs.recommendSearch, "test");
      },
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
      /**
       * 获取轮播图数据
       * @returns {Promise<void>}
       * @private
       */
      async _getSliderData() {
        try {
          let res = await getBanner()
          if (res.status === 200) {
            this.bannerData = res.data.banners;
          }
        } catch (e) {
          console.log(`获取轮播图数据出错，${e}`);
        }
      },
      /**
       * 获取歌单数据
       * @returns {Promise<void>}
       * @private
       */
      async _getRecommendMenusData() {
        try {
          let res = await getRecommendList();
          if (res.data) {
            this.recommendDsicData = res.data.result;
          }
        } catch (e) {
          console.log('获取推荐歌单数据出错:', e)
        }
      },
      /**
       * 获取推荐歌曲数据
       *
       * 对获取到的歌曲进行格式化操作，便于后续处理
       *
       * @returns {Promise<void>}
       * @private
       */
      async _getRecommendSongsData() {
        try {
          let res = await getRecommendSongs()
          if (res.status === ERR_OK) {
            let songsList = res.data.result.map(item => {
              return createRecommendSong(item);
            });
            this.recommendSongsData = songsList;
          }
        } catch (e) {
          console.log('获取推荐歌曲数据出错：', e)
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import '~common/stylus/variable';
  .recommend {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
  }

  .recommend-header {
    height $head-height
  }

  .recommend-search-wrapper {
    border-radius 20px;
    width 75%;
    background $color-input
    /*居中*/
    position relative
    left 50%
    transform translateX(-50%)
    height 30px;
    margin 10px 0;
    display flex
    justify-content center
    align-items center
  }

  .icon-search {
    font-size 20px
  }

  .recommend-search
    display flex
    width 300px
    position relative
    left 50px;
    top -($head-height / 2);

  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-background {
      background #E8E8E8
      width: 90%;
      margin 0 auto;
      height 140px;
      border-radius 8px
    }
    .slider-wrapper {
      position: relative;
      width: 90%;
      padding-top 30%;
      overflow: hidden;
      border-radius 8px
      margin 0 auto;
      border-radius 8px
    }

    .slider-content {
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    }
    .recommend-songs-list {
      // 用于控制位置，跟BetterScroll无关
      margin-top 10px
    }
  }
</style>
