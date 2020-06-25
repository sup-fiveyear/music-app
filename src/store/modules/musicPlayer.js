import { playMode } from "../../common/js/config";
import * as types from "../mutations-types";
import { SET_SEQUENCE_LIST } from "../mutations-types";
import { SET_PLAY_LIST } from "../mutations-types";
import { SET_PLAYING } from "../mutations-types";
import { SET_CURRENT_INDEX } from "../mutations-types";
import { SET_FULL_SCREEN } from "../mutations-types";
import { getSong } from "api/song";
import {SET_CURRENT_SONG_URL} from "../mutations-types";

export default {
  state: {
    playing: false,
    fullScreen: false,
    mode: playMode.sequence,
    playList: [],
    sequenceList: [],
    currentIndex: -1,
    disc: {},
    topList: {},
    playHistory: [],
    favoriteList: [],
    currentSongUrl: ''
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    mode: state => state.mode,
    playList: state => state.playList,
    sequenceList: state => state.sequenceList,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.playList[state.currentIndex] || {},
    disc: state => state.disc,
    topList: state => state.topList,
    currentSongUrl: state => state.currentSongUrl
  },
  mutations: {
    [types.SET_PLAYING](state, playing) {
      state.playing = playing;
    },
    [types.SET_FULL_SCREEN](state, fullScreen) {
      state.fullScreen = fullScreen;
    },
    [types.SET_MODE](state, mode) {
      state.mode = mode;
    },
    [types.SET_PLAY_LIST](state, playList) {
      state.playList = playList;
    },
    [types.SET_SEQUENCE_LIST](state, sequenceList) {
      state.sequenceList = sequenceList;
    },
    [types.SET_CURRENT_INDEX](state, currentIndex) {
      state.currentIndex = currentIndex;
    },
    [types.SET_DISC](state, disc) {
      state.disc = disc;
    },
    [types.SET_TOP_LIST](state, topList) {
      state.topList = topList;
    },
    [types.SET_PLAY_HISTORY](state, playHistory) {
      state.playHistory = playHistory;
    },
    [types.SET_FAVORITE_LIST](state, favoriteList) {
      state.favoriteList = favoriteList;
    },
    [types.SET_CURRENT_SONG_URL](state, url) {
      state.currentSongUrl = url;
    },

  },
  actions: {
    selectPlay({commit,state,getters }, { list, index }) {
      commit(types[SET_SEQUENCE_LIST], list);
      commit(types[SET_PLAY_LIST], list);
      commit(types[SET_CURRENT_INDEX], index);
      commit(types[SET_PLAYING], true);
      commit(types[SET_FULL_SCREEN], true);
    },
    getSongUrl ({commit,state}) {
      let id = state.playList[state.currentIndex].id;
      getSong(id).then((res) => {
        commit(types[SET_CURRENT_SONG_URL],res.data.data[0].url)
      })
        .catch(e => {
          console.log('获取歌曲地址接口出错', e)
        })
    }
  }
};
