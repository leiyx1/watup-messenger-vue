import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "watup?",
    user: {
      id: "",
      token: "",
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
    friendRequest:[],
    groupRequest:[],
    currentChat: {
      messageList: [],
    },
    userCache: [],
  },
  mutations: {
    setGroupRequest(state,val){
      state.groupRequest=val;
    },
    setFriendRequest(state,val){
      state.friendRequest=val;
    },
    setUsername(state, val) {
      //todo 理应存userId
      state.user.username = val;
    },
    setUserCache(state, val) {
      state.userCache = val;
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
      var obj = state.chatList.find((obj) => obj.chatId == val.chatId);
      if (obj == null) {
        state.chatList.unshift(val);
        state.currentChat = val;
        return false;
      }
      var index = state.chatList.indexOf(obj);
      state.chatList.splice(index, 1);
      state.chatList.unshift(val);
      state.currentChat = val;
      return true;
    },
    setCurrentChat(state, val) {
      state.currentChat = val;
      console.log("in store the currentChat:");
      console.log(state.currentChat);
    },
    setMessageList(state, val) {
      state.currentChat.messageList = val;
    },
    resetUnread(state, index) {
      state.currentChat.unReadCount = 0;
      state.chatList[index].unReadCount = 0;
      state.chatList[index] = state.currentChat;
    },
    setFriends(state, val) {
      state.friends = val;
    },
    updateUserCache(state, val) {
      var found = state.userCache.find((obj) => obj.id == val.id);
      var index = state.userCache.indexOf(found);
      if (found) {
        state.userCache[index] = val;
      } else {
        state.userCache.push(val);
      }
    },
    setGroups(state, val) {
      state.groups = val;
    },
  },
  actions: {},
  modules: {},
});
