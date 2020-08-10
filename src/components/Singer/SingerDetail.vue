<template>
  <transition appear name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="listDetail"
    ></music-list>
  </transition>
</template>

<script>
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "../../common/js/config";
import { createSong } from "../../common/js/song";
import MusicList from "../music-list/music-list";

import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters } = createNamespacedHelpers("musicSinger");

export default {
  name: "singer-detail",
  components: { MusicList },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  data() {
    return {
      hotSongs: [],
      listDetail: []
    };
  },
  watch: {
    hotSongs(newData) {
      this.listDetail = this._normalizeSongs(newData);
    }
  },
  created() {
    this._getDetail();
  },
  methods: {
    async _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/Singer");
      }
      console.log(this.singer)
      let res = await getSingerDetail(this.singer.id);
      if (res.status === ERR_OK) {
        this.hotSongs = res.data.hotSongs;
      }
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      return ret;
    }
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s
}
.slide-enter, .slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
</style>
