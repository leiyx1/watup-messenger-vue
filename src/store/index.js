import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "watup?",
    token: "",
    user: {
      id: "",
      username: "",
      email: "",
      friendID: [],
      avatarUrl: "",
      profile: "",
      blacklist: [],
    },
    chatList: [
      {
        id: 1,
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        name: "老板",
        sign: "你吃了吗?",
        unReadCount: 0,
      },
      {
        id: 2,
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        name: "钢铁侠",
        sign: "好的好的.",
        unReadCount: 2,
      },
    ],
    currentChat: {},
    messageList: [],
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
  },
  actions: {},
  modules: {},
});
