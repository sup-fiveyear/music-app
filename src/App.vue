<template>
  <div id="app">
    <div class="player-test"></div>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MyHeader from "components/MyHeader/MyHeader";
import Tab from "components/Tab/Tab";
import Player from "components/Player/Player";


export default {
  components: {
    MyHeader,
    Player,
    Tab
  }
};
</script>
<style lang="stylus">

</style>
