import * as types from "../mutations-types";
import {clearSearch, loadSearch, saveSearch} from "../../common/js/cache";
export default {
  state: {
    searchHistory: loadSearch() || [],
  },
  getters: {
    searchHistory: state => state.searchHistory
  },
  mutations: {
    [types.SET_SEARCH_HISTORY](state,payload) {
      state.searchHistory = payload;
    },
  },
  actions: {
    saveSearchHistory({commit},query) {
      // 存入本地后，并更新当前state中的搜索历史数据
      commit(types.SET_SEARCH_HISTORY,saveSearch(query))
    },
    clearAllSearchHistory({commit}) {
      commit(types.SET_SEARCH_HISTORY,clearSearch())
    }
  },
}
