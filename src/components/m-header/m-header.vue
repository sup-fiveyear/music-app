<template>
  <div class="m-header">
    <!-- 左侧Logo图片 -->
    <div class="icon"></div>
    <!-- 中间title -->
    <h1 class="text">{{ title }}</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
/**
 * 该组件并不是通用型组件
 *
 * 头像链接需要抽象出外部属性
 *
 * 左侧Logo可以做一个默认属性，如何把css样式提取出来，进行绑定？
 *
 */
export default {
  props: {
    title: {
      type: String,
      default: "QianQian Music"
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
  position: relative;
  height: 44px;
  color: $color-theme;
  text-align: center;

  .icon {
    bg-image('logo');
    width: 30px;
    height: 32px;
    background-size: 30px 32px;
    margin-top: 6px;
    margin-right: 9px;
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    margin-right: 9px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    font-size: $font-size-large;
    line-height: 44px;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;

    .icon-mine {
      display: block;
      /* TODO: 为什么这里加一个block 就能下来？ */
      padding: 12px;
      font-size: 20px;
    }
  }
}
</style>
