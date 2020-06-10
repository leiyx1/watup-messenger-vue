import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "watup?",
    token: "",
    user: {
      id: "",
      nickname: "",
      email: "",
      friends: [],
      avatarUrl: "",
      profile: "",
      blacklist: [],
    },
    chatList: [],
    currentChat: {},
    messageList: [],
    friends: [],
  },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    setToken(state, val) {
      state.token = val;
    },
    setChatList(state, val) {
      state.chatList = val;
    },
    setCurrentChat(state, val) {
      state.currentChat = val;
      console.log("in store the currentChat:");
      console.log(state.currentChat);
    },
    setMessageList(state, val) {
      state.messageList = val;
    },
    resetUnread(state) {
      state.currentChat.unReadCount = 0;
    },
    setFriends(state, val) {
      state.friends = val;
    },
  },
  actions: {},
  modules: {},
});
