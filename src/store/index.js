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
      area: "",
      sign: "",
      avatarUrl: "",
      access_token: "",
    },
    friends: [],
    groups: [],
    blacklist: [],
    chatList: [],
    currentChat: {
      messageList: [],
    },
  },
  mutations: {
    setUsername(state, val) {
      //todo 理应存userId
      state.user.username = val;
    },
    setId(state, val) {
      state.user.id = val;
    },
    setUser(state, val) {
      state.user = val;
    },
    setToken(state, val) {
      state.token = val;
    },
    setChatList(state, val) {
      state.chatList = val;
    },
    unshiftChatList(state, val) {
      var obj = state.chatList.find((obj) => obj.id == val.id);
      if (obj == null) {
        state.chatList.unshift(val);
        state.currentChat = val;
        return;
      }
      var index = state.chatList.indexOf(obj);
      state.chatList.splice(index, 1);
      state.chatList.unshift(val);
      state.currentChat = val;
    },
    setCurrentChat(state, val) {
      state.currentChat = val;
      console.log("in store the currentChat:");
      console.log(state.currentChat);
    },
    setMessageList(state, val) {
      state.currentChat.messageList = val;
    },
    resetUnread(state) {
      state.currentChat.unReadCount = 0;
    },
    setFriends(state, val) {
      state.friends = val;
    },
    setGroups(state, val) {
      state.groups = val;
    },
  },
  actions: {},
  modules: {},
});
