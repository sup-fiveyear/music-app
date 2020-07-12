<template>
  <div id="app">
    <div class="player-test"></div>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MyHeader from "components/MyHeader/MyHeader";
import Player from "components/Player/Player";


export default {
  components: {
    MyHeader,
    Player,
  }
};
</script>
<style lang="stylus">
@import "common/stylus/mixin.styl"
  #app {
    /*height 200px*/
    //background linear-gradient(#E1E1E1,#FAFAFA);
    }
  .player-test
    position fixed
    top 10px
    right 10px
    width 30px
    height 30px
    border-radius 50%
    background #EBEBEB
    z-index 999
</style>
