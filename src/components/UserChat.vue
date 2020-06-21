<template>
  <div class="windows">
    <div class="top">
      <span>{{ this.currentChat.name }}</span>
      <el-dropdown trigger="click" class="btn" @command="handleCommand">
        <el-button plain size="small" icon="el-icon-more" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="delete">
            删除聊天记录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-divider class="divider" />
    <div class="message" id="message">
      <!-- <div
        class="others"
        v-for="item in currentChat.messages"
        :key="item"
        :class="{ me: item.mySent }"
      >
        <img :src="item.avatar" alt="头像" />
        <el-card shadow="hover"> {{ item.content }}</el-card>
      </div> -->
      <ul>
        <li
          v-for="(item, index) in messageList"
          :key="index"
          :class="{ 'chat-mine': item.mine }"
        >
          <img
            :src="
              item.mine == true ? mineUrl : chatInfo(item.senderId).avatarUrl
            "
            alt="头像"
            style="height: 50px; width: 50px"
          />
          <div
            :class="{
              'message-body': true,
              'multi-message-body': item.type === 'MULTICAST',
            }"
          >
            <div>
              <span>{{ chatInfo(item.senderId).username }}</span>
            </div>
            <el-card class="card" shadow="hover"
              ><div>
                <span>{{ item.content }}</span>
              </div></el-card
            >
          </div>
        </li>
      </ul>
    </div>
    <el-divider class="divider" />
    <div class="tools">
      <div class="left">
        <el-button circle type="text"
          ><i class="el-icon-picture-outline-round"></i
        ></el-button>
      </div>
      <div class="right">
        <el-button circle type="text"
          ><i class="el-icon-phone-outline"></i
        ></el-button>
      </div>
    </div>

    <div class="send">
      <el-input
        class="textarea"
        type="textarea"
        v-model="text"
        :rows="4"
        @keyup.enter.native="sendUniMessage()"
      >
      </el-input>
      <div class="footer">
        <el-button class="btn" @click="sendUniMessage()">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import getWebsocket from "../JavaScript/Websocket";
import getNedb from "../JavaScript/NedbConfig";

export default {
  name: "userChat",
  // components: {
  //   VEmojiPicker,
  // },
  props: ["chat"],
  data() {
    return {
      text: "",
    };
  },
  watch: {
    messageList() {
      this.scrollToBottom();
    },
  },
  computed: {
    mineUrl: {
      get: function() {
        return this.$store.state.user.avatarUrl;
      },
    },
    messageList: {
      get: function() {
        return this.$store.state.currentChat.messageList;
      },
      set: function(val) {
        console.log("messageList setter");
        console.log(val);
        this.$store.commit("setMessageList", val);
      },
    },
    currentChat: {
      get: function() {
        return this.$store.state.currentChat;
      },
      set: function(val) {
        this.$store.commit("setCurrentChat", val);
      },
    },
  },
  methods: {
    chatInfo(val) {
      return this.$store.state.userCache.find((obj) => obj.id === val);
    },
    handleCommand(command) {
      console.log(command);
      if (command === "delete") {
        //删除聊天记录
        getNedb().localMessage.remove(
          { type: this.currentChat.type, chatId: this.currentChat.chatId },
          { multi: true },
          function(err, numRemove) {
            if (err !== null) {
              console.log(err);
            } else {
              console.log(`${numRemove} 条数据被删除`);
            }
          }
        );
      }
    },
    sendUniMessage() {
      console.log(this.currentChat);
      console.log(
        `send uni message:` + this.text + " to " + this.currentChat.chatId
      );
      let message = {
        type: this.currentChat.type,
        receiverId: this.currentChat.chatId,
        content: `${this.text}`,
      };
      if (this.currentChat.type === "UNICAST")
        message.receiverId = this.currentChat.chatId;
      else if (this.currentChat.type === "MULTICAST")
        message.groupId = this.currentChat.chatId;
      getWebsocket().send(JSON.stringify(message));
      this.text = "";
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let msg = document.getElementById("message"); // 获取对象
        if (msg.scrollHeight !== null && msg.scrollTop !== null)
          msg.scrollTop = msg.scrollHeight; // 滚动高度
      });
    },
  },
  mounted() {
    let msg = document.getElementById("message"); // 获取对象
    msg.scrollTop = msg.scrollHeight; // 滚动高度
    console.log(this.messageList);
  },
  beforeMount() {
    // setMessageListByChatID
    console.log("111");
    // this.refreshMessages();
  },
};
</script>

<style lang="scss">
.windows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .divider {
    margin: 0px;
  }
  .top {
    // display: flex;
    // flex-direction: row;
    height: 10%;
    span {
      // display: block;
      float: left;
      font-size: large;
      font-weight: 600;
      padding-left: 15px;
      padding-top: 3%;
    }
    .btn {
      float: right;
      margin-top: 2%;
      // margin-bottom: 4%;
      margin-right: 2%;
    }
  }
  .message {
    width: 100%;
    height: 57%;
    overflow-y: scroll;
    ul {
      width: 100%;
      margin: 0px;
      padding-inline-start: 0px;
      list-style: none;
      li {
        padding: 5px;
        display: flex;
        flex-direction: row;
        img {
          padding: 0% 2%;
          height: 60px;
        }
        .message-body {
          display: flex;
          flex-direction: column;
          min-height: 60px;
          max-height: 140px;
          span {
            display: none;
          }
          .el-card {
            margin-top: 10px;
            margin-bottom: 10px;
            // height: 65%;
            max-width: 420px;
            div {
              span {
                margin: 10px;
                padding-right: 0;
                text-align: left;
                display: inline-grid;
                white-space: pre-line;
                word-wrap: break-word;
                // overflow: hidden;
                line-height: 20px;
              }
            }
            // height: 100%;
            .el-card__body {
              padding: 0px;
            }
          }
        }
        .multi-message-body {
          height: 60px;
          div {
            span {
              margin: 0px;
              display: block;
              // height: 25%;
              float: left;
              font-size: 13px;
            }
          }
          .el-card {
            margin-top: 0px;
            margin-bottom: 0px;
            height: 65%;
            .el-card__body {
              padding: 0px;
            }
          }
        }
      }
      li.chat-mine {
        flex-direction: row-reverse;
        div {
          span {
            float: right;
          }
        }
      }
      li.chat-mine.el-card {
        color: #409eff;
      }
    }
  }
  .tools {
    height: 6%;
    .left {
      padding-left: 10px;
      float: left;
    }
    .right {
      padding-right: 10px;
      float: right;
    }
  }
  .send {
    height: 27%;
    .textarea {
      // border-style: none;
      // border: 0px;
      // outline-style: none;
      cursor: pointer;
    }
    .el-textarea__inner {
      border-style: none;
      // outline
    }
    .footer {
      .btn {
        margin-top: 5px;
        margin-right: 5px;
        float: right;
      }
    }
  }
  // .emoji {
  // }
}
</style>
