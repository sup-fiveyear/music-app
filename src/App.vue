<template>
  <div id="app">
    <!-- 全局Header -->
    <my-header />
    <!--全局导航器-->
    <tab-bar />
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MyHeader from "components/MyHeader/MyHeader";
import TabBar from "components/TabBar/TabBar";
import Player from "components/player/player";

export default {
  components: {
    MyHeader,
    TabBar,
    Player
  }
};
</script>
<style lang="stylus">
@import "common/stylus/mixin.styl"

</style>
