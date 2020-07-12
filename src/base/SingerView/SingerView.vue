<template>
  <Scroll
    :data="artists"
    ref="listView"
    class="listview"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    @scroll="getScrollY"
    :click="true"
  >
    <!--作曲家-->
    <ul>
      <li
        v-for="(group, index) in artists"
        :key="index"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <!--区域内对应的歌手列表-->
        <ul>
          <li
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--字符表-->
    <div
      class="list-shortcut"
      @touchstart.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script>
// FIXME: lazy 图片问题
import Scroll from "base/Scroll/Scroll.vue";
import { getData } from "../../common/js/dom";
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  components: { Scroll },
  props: {
    artists: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1
    };
  },
  watch: {
    // NOTE: 2a. 每当歌手数据发生改变后，重新计算每个区间的高度
    artists() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    //NOTE: 3 监控scrollY的变化
    /**
     * 根据newY的变化，可以分为两个区间：
     *
     * - 超出整个列表的上线 < 热门的高度
     *
     * - 在[热门，Z]
     */
    scrollY(newY) {
      const listHeight = this.listHeight;
      // console.log(this.currentIndex, newY);
      // 向上滚动，并且超出列表高度的上线
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let lowerBound = listHeight[i];
        let upperBound = listHeight[i + 1];
        if (-newY >= lowerBound && -newY < upperBound) {
          this.currentIndex = i;
          // console.log(this.currentIndex, upperBound, -newY);
          return;
        }
      }
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    // 用于触摸交互事件处理
    this.touch = {};
    // 存储动态计算的每个区域的高度
    this.listHeight = [];
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    // NOTE: 1. 获取当前滚动位置
    /**
     * 1. 拿到当前滚动的实时距离：scrollY
     */
    getScrollY(pos) {
      this.scrollY = pos.y;
    },
    /**
     * 功能1. 跳转字母表
     *  - 拿到当前单击字母表中dom元素存储的index
     *  - 映射到 list-group 中，随之跳转即可
     *
     * 功能2：为拖动结束后提供
     *  - 手指首次位置
     *  - 对应的index
     * @param e
     */
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      this._scrollTo(anchorIndex);
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
    },
    /*
     *
     * 功能：支持拖动滚动列表
     *
     * 根据拖动起始点的位置、和index，动态计算出delta偏移量，并加上初始的index,实现跳转
     *
     *
     * */
    onShortcutTouchMove(e) {
      let lastTouch = e.touches[0];
      this.touch.y2 = lastTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    //NOTE: 2b. 动态计算歌手区间高度
    /**
     * - pre-process: 向区间增加最初的lowerBound：0
     *
     * - 计算区间高度，将计算后的内容保存到 this.listHeight中
     *
     * - 思路：
     *    获取当前listGroup的高度，累加到初始height上
     *    这样可以获取一个数组，每两个数对应一个歌手区间的[lowerBound,upperBound]
     *
     * - 为scrollY发生改变时，能够精准定位区间
     *
     */
    _calculateHeight() {
      this.listHeight = [];
      let height = 0,
        list = this.$refs.listGroup;
      this.listHeight.push(height);
      console.log(`一共有`, list.length, `个区间`);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        // console.log(`每个区间的高度为`, item.clientHeight);
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      // console.log(`最终处理的区间为:`, this.listHeight);
    },
    /**
     * 跳转指定位置
     *
     * 对 Scroll组件 内部提供的跳转方法进行一层代理而已
     * @param index
     * @private
     */
    _scrollTo(index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
    }
  },
  computed: {
    shortcutList() {
      return this.artists.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.artists[this.currentIndex]
        ? this.artists[this.currentIndex].title
        : "";
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable';
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  .list-group
    .list-group-title
      height: 20px
      line-height: 20px
      padding-left: 10px
      margin-top 10px
      font-size: $font-size-small
      // background: #E0E0E0
      background: $color-sub-theme
    .list-group-item
      display flex
      align-items: center
      padding: 10px 0 0 10px
      .avatar
        width 50px
        height 50px
        border-radius: 5px
      .name
        margin-left: 20px
        font-size: $font-size-medium
  .list-shortcut
    // 定位
    position: absolute
    right 0
    top 55%
    transform translateY(-65%)

    // 上下留白，尺寸
    padding 20px 0
    border-radius: 10px
    width: 20px
    background: #E0E0E0
    text-align: center
    .item
      padding 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
  .fixed-title
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    // color: $color-text-l
    background: #E0E0E0
    border-radius 5px
</style>
