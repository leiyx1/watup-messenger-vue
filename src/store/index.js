import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "watup?",
    user: {
      id: "",
      username: "",
      email: "",
      friendID: [],
      avatarUrl: "",
      profile: "",
      blacklist: [],
    },
  },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
  },
  actions: {},
  modules: {},
});
