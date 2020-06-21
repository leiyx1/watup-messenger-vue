import store from "../store/index";
var axios = require("axios");
axios.defaults.baseURL = "http://106.13.123.20:8080/";

export function loadGroups() {
  axios
    .get("/api/group", {
      params: {
        access_token: store.state.user.access_token,
        detailed: true,
      },
    })
    .then((successResponse) => {
      if (successResponse.status === 404) {
        console.log("拉取群组失败");
      } else if (successResponse.status === 200) {
        // let groups = successResponse.data;

        store.commit("setGroups", successResponse.data);

      } else {
        // this.$store.commit("setGroups", successResponse.data);
        // console.log(successResponse);
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}

export function loadFriends() {
  axios
    .get("/api/friends", {
      params: {
        access_token: store.state.user.access_token,
      },
    })
    .then((successResponse) => {
      if (successResponse.status === 404) {
        console.log("拉取好友失败");
      } else if (successResponse.status === 200) {
        store.commit("setFriends", successResponse.data);
        var friends = successResponse.data;
        for (var i = 0; i < friends.length; i++) {
          console.log(friends[i]);
          store.commit("updateUserCache", friends[i]);
          console.log(store.state.userCache);
        }
        // 把自己也加入到映射表
        store.commit("updateUserCache", store.state.user);
      } else {
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}

export function loadFriendRequests() {
  axios
    .get("/api/friend/request", {
      params: {
        access_token: store.state.user.access_token,
      },
    })
    .then((successResponse) => {
      if (successResponse.status === 404) {
        console.log("拉取好友邀请失败");
      } else if (successResponse.status === 200) {
        console.log(successResponse.data);
        store.commit("setFriendRequest", successResponse.data);
      } else {
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}

export function loadGroupRequests() {
  axios
    .get("/api/request", {
      params: {
        access_token: store.state.user.access_token,
      },
    })
    .then((successResponse) => {
      if (successResponse.status === 404) {
        console.log("拉取群聊申请失败");
      } else if (successResponse.status === 200) {
        store.commit("setGroupRequest", successResponse.data);
      } else {
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}

export function loadBlockList() {
  axios
    .get("/api/friend/blocks", {
      params: {
        access_token: store.state.user.access_token,
      },
    })
    .then((successResponse) => {
      if (successResponse.status === 404) {
        console.log("拉取黑名单失败");
      } else if (successResponse.status === 200) {
        store.commit("setBlacklist", successResponse.data);
      } else {
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}
