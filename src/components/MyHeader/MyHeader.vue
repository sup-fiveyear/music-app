<template>
  <div class="m-header">
    <!-- 左侧Logo图片 -->
    <!-- <div class="icon"></div> -->
    <!-- 中间title -->
    <h1 class="text">{{ title }}</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: "MyMusic"
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
  // 可以被后继元素继承样式
  color: $color-theme;
  // 控制文本内容居中显示
  text-align: center;

  
  // .icon {
  //   bg-image('logo');
  //   width: 30px;
  //   height: 32px;
  //   background-size: 30px 32px;
  //   margin-top: 6px;
  //   margin-right: 9px;
  //   display: inline-block;
  //   vertical-align: top;
  //   margin-top: 6px;
  //   margin-right: 9px;
  // }

  .text {
    display: inline-block;    
    font-size: $font-size-large;
    // 保证垂直居中
    line-height: 44px;
    // vertical-align: top;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;

    .icon-mine {
      display: inline-block;      
      font-size: 20px;
      // 保证和text平齐
      padding: 12px;
      
    }
  }
}
</style>
