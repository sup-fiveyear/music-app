<template>
  <div class="tab">
    <router-link tag="div" to="/recommend" class="tab-item">
      <span class="tab-link">每日推荐</span>
    </router-link>
    <router-link tag="div" to="/songSquare" class="tab-item">
      <span class="tab-link">歌单广场</span>
    </router-link>
    <router-link tag="div" to="/rank" class="tab-item">
      <span class="tab-link">榜上有名</span>
    </router-link>
    <router-link tag="div" to="/singer" class="tab-item">
      <span class="tab-link">歌手速览</span>
    </router-link>

    <!--    <router-link tag="div" to="/search" class="tab-item">-->
    <!--      <span class="tab-link">搜索</span>-->
    <!--    </router-link>-->
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';

.tab {
  display: flex;
  line-height: 44px;
  height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      color: $color-text-ll;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
      }
    }
  }
}
</style>
