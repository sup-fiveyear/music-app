<template>
  <Scroll
  :data="artists"
  class="listview"
  ref="listView"
  :listen-scroll="listenScroll"
  :probe-type="probeType"
  @scroll="scroll"
   >
    <!--    作曲家-->
    <ul >
      <!--      拿到27个区域-->
      <li v-for="(group, index) in artists" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <!--        区域内对应的歌手列表-->
        <ul>
          <li
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
            @click="selectItem(item)"
          >
            <!--            FIXME: v-lazy 为什么会导致图片加载迟缓和异样发生？-->
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
<!--    字符表-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" >
      <ul>
        <li
        v-for="(item,index) in shortcutList "
        class="item"
        :data-index="index"
        :class="{'current':currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
<!--    固定头部-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "../scroll/scroll";
import {getData} from "../../common/js/dom";
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
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.artists.map((group) => {
        return group.title.substr(0,1);
      })
    },
    fixedTitle() {
      if(this.scrollY > 0){
        return ''
      }
      return this.artists[this.currentIndex] ? this.artists[this.currentIndex].title : ''
    }
  },
  watch: {
    artists() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    /**
    * BUG: 滚到到Z 后 回弹只Y
    *
    * */
    scrollY (newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return
      }
      // 在中间部分滚动

      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          // 此时的diff就是fixtittle 和 当前滑动之间的距离
          this.diff = height2 + newY;
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    this.touch = {};
    this.listHeight = [];
  },
  methods: {
    /**
    * 功能1：跳转字母表
     *  - 拿到当前单击字母表中对应的index
     *  - 映射到 list-group 中，随之跳转即可
     *
     * 功能2：为拖动结束后提供
     *  - 手指首次位置
     *  - 对应的index
     * @param e
     */
    onShortcutTouchStart(e) {

      let anchorIndex = getData(e.target,'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
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
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex)
    },
    /*
    * 计算区间
    * **/
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height)
      }

    },
    selectItem(item) {
      this.$emit('select', item)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    /**
     * 对 scroll组件内部跳转方法进行代理
     * @param index
     * @private
     */
    _scrollTo(index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index],0)
    }
  },
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
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      background: $color-sub-theme
    .list-group-item
      display flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius: 50%
      .name
        margin-left: 20px
        font-size: $font-size-medium
  .list-shortcut
    // 定位
    position: absolute
    right 0
    top 50%
    transform translateY(-65%)

    // 上下留白，尺寸
    padding 20px 0
    border-radius: 10px
    width: 20px
    background: $color-background-d
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
    color: $color-text-l
    background: $color-highlight-background
</style>
