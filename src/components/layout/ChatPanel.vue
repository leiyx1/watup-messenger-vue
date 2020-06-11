<template>
  <div class="chat-panel">
    <div class="side-list">
      <el-menu
        router
        background-color="#d3d3d3"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <el-menu-item
          class="item"
          v-for="(chat, index) in this.chatList"
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
              <img :src="chat.avatar" alt="头像" />
            </el-badge>
          </div>
          <div class="item-body">
            <div class="item-title">
              <b>{{ chat.name }}</b>
              <span>10:10</span>
            </div>
            <div class="item-word">
              <span>{{ chat.sign }}</span>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="chat-box">
      <userChat v-if="show"/>
    </div>
  </div>
</template>

<script>
import userChat from "../UserChat.vue";
import db from "../../JavaScript/NedbConfig";

export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    userChat,
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
      set: function (val) {
        console.log("messageList setter")
        this.$store.commit("setMessageList", val);
      }
    },
  },
  mounted() {
    // this.loadChatList();
    let self = this;
    db.localMessage.find({}, function (err, docs) {
      self.chatList = docs;
    })
  },
  methods: {
    loadChatList() {
      this.$axios
        .get("usercenter/chatList", {
          params: {
            userID: this.$store.state.user.ID,
          },
        })
        .then((successResponse) => {
          // var responseResult = JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$store.commit("setChatList", successResponse.data.data);
          } else {
            this.$notify.error({
              title: "错误",
              message: "拉取最近聊天出错",
            });
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
    showChat(chat, index) {
      this.show = true;
      this.currentChat = chat;
      this.$store.commit("resetUnread");
      this.chatList[index] = this.$store.state.currentChat;
      console.log(this.currentChat);
      // setMessageListByChatID
      let self = this;
      let query = {chatId: this.currentChat.chatId, type: this.currentChat.type}
      db.find(query).sort({timestamp: 1}).exec(function (err, docs){
        self.messageList = docs;
      })
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
        }
      }
    }
  }
  .chat-box {
    width: 75%;
  }
}
</style>
