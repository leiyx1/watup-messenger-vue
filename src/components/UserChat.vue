<template>
  <div class="windows">
    <div class="top">
      <span>{{ this.currentChat.name }}</span>

      <el-dropdown trigger="click" class="btn" @command="handleCommand">
        <el-button plain size="small" icon="el-icon-more" circle> </el-button>

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
            :src="item.mine == true ? mineUrl : currentChat.avatarUrl"
            alt="头像"
          />

          <div class="message-body">
            <el-card class="card" shadow="hover">{{ item.content }}</el-card>
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
        <el-button circle type="text"
          ><i class="el-icon-chat-line-square"></i
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
        @keyup.enter="sendUniMessage"
      >
      </el-input>
      <div class="footer">
        <el-button class="btn" @click="sendUniMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import getWebsocket from "../JavaScript/Websocket";
import getNedb from "../JavaScript/NedbConfig";

export default {
  name: "userChat",
  data() {
    return {
      text: "",
    };
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
      let ws = getWebsocket();
      console.log(`send uni message:` + this.text);
      // ws.send(JSON.stringify({
      //   type: "UNICAST",
      //   receiverId: "5eccfc418e17974a04b86b19",
      //   content: `${this.text}`,
      // }))
      ws.send(this.text);
      this.refreshMessages();
    },
    refreshMessages() {
      let self = this;
      let query = {
        chatId: this.currentChat.chatId,
        type: this.currentChat.type,
      };
      getNedb()
        .find(query)
        .sort({ timestamp: 1 })
        .exec(function(err, docs) {
          self.messageList = docs;
        });

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
  },
  beforeMount() {
    // setMessageListByChatID
    console.log("111");
    this.refreshMessages();
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
        card {
          margin: 10px 5px;
        }
      }
      li.chat-mine {
        flex-direction: row-reverse;
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
      padding-top: 1%;
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
}
</style>
