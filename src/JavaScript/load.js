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
      } else {
        console.log("known error");
      }
    })
    .catch((failResponse) => {
      console.log(failResponse);
    });
}
