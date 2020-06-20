<template>
  <div id="app">
    <m-header />
    <!--导航栏-->
    <tab />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";

export default {
  components: {
    MHeader,
    Tab
  }
};
</script>
<style lang="stylus">
@import "common/stylus/mixin.styl"
</style>
