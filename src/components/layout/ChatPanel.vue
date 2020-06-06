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
      <userChat v-if="show" :chat="currentChat" />
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
        return this.$store.state.messageList;
      },
      set: function(val) {
        this.$store.commit("setMessageList", val);
      },
    },
  },
  mounted() {
    // this.loadChatList();
    this.chatList = [
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
    ];
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
      if (chat.id === 1) {
        this.messageList = [
          {
            mine: true,
            username: "Myself",
            content: "CHILEM",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:00",
          },
          {
            mine: false,
            username: "Myself",
            content: "CHILEM",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:00",
          },
          {
            mine: true,
            username: "Myself",
            content: "CHILEM",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:00",
          },
          {
            mine: true,
            username: "Myself",
            content: "CHILEM",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:00",
          },
          {
            mine: false,
            username: "Boss",
            content: "Yes",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:01",
          },
        ];
      } else {
        this.messageList = [
          {
            mine: true,
            username: "Myself",
            content: "你吃了吗?",
            avatar:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            timestamp: "2020/6/3 20:00",
          },
        ];
      }
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
