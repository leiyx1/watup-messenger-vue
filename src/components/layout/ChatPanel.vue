<template>
  <div class="chat-panel">
    <div class="side-list">
      <el-menu
        router
        background-color="#d3d3d3"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <div v-if="chatList.length == 0">
          <div style="padding-top: 5%">
            <i class="el-icon-warning" />
            <span style="padding-left: 2%">没有最近联系人哦😔</span>
          </div>
          <el-button plain type="text" @click="goFriendPanel"
            >前往查看好友</el-button
          >
        </div>
        <el-menu-item
          class="item"
          v-for="(chat, index) in chatList"
          :key="index"
          @click="showChat(chat, index)"
        >
          <div class="item-avatar">
            <el-badge
              :value="chat.unReadCount"
              :hidden="chat.unReadCount === 0"
              class="item"
              id="badge"
            >
              <img :src="chatInfo(chat).avatarUrl" alt="头像" />
            </el-badge>
          </div>
          <div class="item-body">
            <div class="item-title">
              <b>{{ chatInfo(chat).name | ellipsis }}</b>
            </div>
            <div class="item-word">
              <span>{{ chat.sign | ellipsis }}</span
              ><span class="right">{{ time(chat.timestamp) }}</span>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="chat-box">
      <userChat v-if="show" />
    </div>
  </div>
</template>

<script>
import userChat from "../UserChat.vue";

export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    userChat,
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";

      let reg = /^[\u4e00-\u9fa5]{0,}$/;
      let len = 0,
        sliceLen = 0;
      for (let i = 0; i < value.length; i++) {
        sliceLen++; //又多一个字符了呢
        if (reg.test(value[i])) {
          if (len >= 10) {
            //最多再容纳一个中文
            len += 2;
            break;
          }
          len += 2;
        } else {
          if (len >= 11) {
            //最多再容纳一个非中文
            len += 1;
            break;
          }
          len++;
        }
      }
      if (len >= 12) {
        return value.slice(0, sliceLen) + "...";
      }
      return value;
    },
  },
  mounted() {
    console.log(this.chatList);
    console.log(this.$store.state.groups);
  },
  computed: {
    currentChat: {
      get: function() {
        return this.$store.state.currentChat;
      },
      set: function(currentChat) {
        this.$store.commit(
          "setCurrentChat",
          JSON.parse(JSON.stringify(currentChat))
        );
      },
    },
    chatInfo(){
      return function (chat) {
        if (chat.type === "UNICAST") {
          console.log(
            this.$store.state.userCache.find((obj) => obj.id === chat.chatId)
          );
          return this.$store.state.userCache.find(
            (obj) => obj.id === chat.chatId
          );
        } else {
          return this.$store.state.groups.find((obj) => obj.id === chat.chatId);
        }
      }
    },
    chatList: {
      get: function() {
        return this.$store.state.chatList;
      },
      set: function(chatList) {
        this.$store.commit("setChatList", chatList);
      },
    },
    messageList: {
      get: function() {
        return this.$store.state.currentChat.messageList;
      },
      set: function(val) {
        console.log("messageList setter");
        this.$store.commit("setMessageList", val);
      },
    },
  },
  methods: {


    time: function(val) {
      if (!val) {
        var t = new Date();
        var h = t.getHours(),
          m = t.getMinutes();
        if (!h / 10) h = "0" + h;
        if (!m / 10) m = "0" + m;
        return h + ":" + m;
      } else {
        var x = new Date();
        var c = val.split("T");
        var cm = parseInt(c[0].split("-")[1]),
          cd = parseInt(c[0].split("-")[2]);
        var xm = x.getMonth() + 1,
          xd = x.getDate();
        if (xm == cm && xd == cd) {
          // today's message
          var res = c[1].split(":");
          return res[0] + ":" + res[1];
        } else {
          res = c[0].split("-");
          return res[1] + "-" + res[2];
        }
      }
    },

    showChat(chat, index) {
      this.show = true;
      this.currentChat = chat;

      //若是群聊 则刷新群聊成员信息
      if (chat.type === "MULTICAST") {
        let groups = this.$store.state.groups;
        let obj = groups.find((obj) => obj.id === chat.chatId);
        this.loadGroupMembers(obj);
        this.loadSingleGroup(obj);
      } else if (chat.type === "UNICAST") {
        this.$axios
          .get("/api/friend/search/id", {
            params: {
              access_token: this.$store.state.user.access_token,
              friendId: chat.chatId,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              this.$store.commit("updateUserCache", res.data);
            } else {
              console.log("errrorrrr");
            }
          });
      }

      this.$store.commit("resetUnread", index);
      console.log("showChat");
    },
    loadSingleGroup(group) {
      this.$axios
        .get(
          "/api/group/" +
            group.id +
            `?access_token=` +
            this.$store.state.user.access_token
        )
        .then((res) => {
          if (res.status === 400) {
            console.log("error occurred!");
          } else if (res.status === 200) {
            let groups = this.$store.state.groups;
            let obj = groups.find((obj) => obj.id === group.id);
            if (obj) {
              let index = groups.indexOf(obj);
              groups[index] = res.data;
            } else {
              groups.unshift(res.data);
            }
            this.$store.commit("setGroups", groups);
          }
        });
    },
    loadGroupMembers(group) {
      this.groupMembers = [];
      let ids = group.usersId;
      let failedMembers = [];
      let userCache = this.$store.state.userCache;
      [].forEach.call(ids, (id) => {
        this.$axios
          .get("/api/friend/user", {
            params: {
              access_token: this.$store.state.user.access_token,
              keyword: id,
            },
          })
          .then((res) => {
            this.groupMembers.push(res.data);

            let obj = userCache.find((obj) => obj.id === res.data.id);
            if (obj) {
              let index = userCache.indexOf(obj);
              userCache[index] = res.data;
            } else userCache.push(res.data);

            this.$store.commit("setUserCache", userCache);
          })
          .catch(function(error) {
            console.log(error);
            failedMembers.push(id);
          });
      });
      if (failedMembers.length > 0)
        this.$message.info(failedMembers.join(", ") + "信息未成功获取");
    },
    goFriendPanel() {
      this.$router.push("/index/friends");
    },
  },
};
</script>

<style lang="scss">
.chat-panel {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  // position: fixed;
  .side-list {
    width: 25%;
    height: 100%;
    margin: 0;
    background-color: #d3d3d3;
    .item {
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 70px;
      padding-left: 0px;
      padding-right: 0px;
      .item-avatar {
        align-items: center;
        float: left;
        width: 50px;
        #badge {
          height: 50px;
        }

        img {
          width: 50px;
        }
      }
      .item-body {
        width: 100%;
        height: 100%;
        padding-left: 3%;
        display: flex;
        flex-direction: column;
        .item-title {
          float: left;
          height: 33%;
          // align-items: left;
          b {
            // display: inline-block;
            color: #696969;
            font-size: medium;
            float: left;
            padding-left: 5px;
            // align-items: left;
          }
          span {
            // display: inline-block;
            float: right;
            padding-right: 10px;
            color: #808080;
            font-size: small;
          }
        }
        .item-word {
          float: left;
          span {
            float: left;
            padding-left: 5px;
            color: #808080;
            // height: 67%;
          }
          .right {
            float: right;
            padding-right: 15px;
          }
        }
      }
    }
  }
  .chat-box {
    width: 75%;
  }
}
</style>
