import { playMode } from "../../common/js/config";
import * as types from "../mutations-types";
import { SET_SEQUENCE_LIST } from "../mutations-types";
import { SET_PLAY_LIST } from "../mutations-types";
import { SET_PLAYING } from "../mutations-types";
import { SET_CURRENT_INDEX } from "../mutations-types";
import { SET_FULL_SCREEN } from "../mutations-types";
import { getSong } from "api/song";
import { SET_CURRENT_SONG_URL } from "../mutations-types";

export default {
  state: {
    playing: false,
    fullScreen: false,
    mode: playMode.sequence, // 增强语义化，避免直接用 0 、 1 、 2 来表示
    playList: [], // 控制当前播放状态，例如需要随机播放时候，就需要乱序playList数据
    sequenceList: [], // 歌单"原列表"
    currentIndex: -1, // 当前播放的索引
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
    selectPlay({ commit, state }, { list, index }) {
      commit(types[SET_SEQUENCE_LIST], list);
      commit(types[SET_PLAY_LIST], list);
      commit(types[SET_CURRENT_INDEX], index);
      commit(types[SET_PLAYING], true);
      commit(types[SET_FULL_SCREEN], true);
    },
    insertSong({ commit, state }, song) {
      let playList = state.playList.slice()
      let sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      // 记录当前正在播放的歌曲
      let currentSong = playList[currentIndex]
      // 查找当前列表中是否有待插入的歌曲并返回其索引
      let fpIndex = findIndex(playList, song)
      // 因为是插入歌曲，所以索引+1
      currentIndex++
      // 插入这首歌到当前索引位置
      playList.splice(currentIndex, 0, song)
      // 如果已经包含了这首歌
      if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          playList.splice(fpIndex + 1, 1)
        }
      }
      let currentSIndex = findIndex(sequenceList, currentSong) + 1

      let fsIndex = findIndex(sequenceList, song)

      sequenceList.splice(currentSIndex, 0, song)

      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }
      commit(types.SET_PLAY_LIST, playList)
      commit(types.SET_SEQUENCE_LIST, sequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING, true)
    },
    getSongUrl({ commit, state }) {
      let id = state.playList[state.currentIndex].id;
      getSong(id).then((res) => {
        commit(types[SET_CURRENT_SONG_URL], res.data.data[0].url)
      })
        .catch(e => {
          console.log('获取歌曲地址接口出错', e)
        })
    }
  }
};

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
