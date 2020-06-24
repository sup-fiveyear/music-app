import * as types from "../mutations-types";

export default {
  state: {
    singer: {
    },
  },
  getters: {
    singer: state => state.singer
  },
  mutations: {
    [types.SET_SINGER](state,singer) {
      state.singer = singer
    }
  },
  actions: {},
}
