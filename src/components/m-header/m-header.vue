<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus">

/*TODO: ~ 代表什么意思？哪里配置的？*/

@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.m-header
  position: relative
  height: 44px
  color: $color-theme
  text-align center
  .icon
    bg-image('logo')
    width 30px
    height 32px
    background-size 30px 32px
    margin-top 6px;
    margin-right 9px;
    display inline-block
    /*TODO: vertical-align: top 是怎么一回事？*/
    vertical-align: top
    margin-top: 6px
    margin-right: 9px
  .text
    display: inline-block
    vertical-align: top
    font-size: $font-size-large
    line-height: 44px

  .mine
    position absolute
    top 0
    right 0
    .icon-mine
      /*TODO: 为什么这里加一个block 就能下来？*/
      display block

      padding 12px
      font-size 20px
</style>
