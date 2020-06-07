<template>
  <div class="windows">
    <div class="top">
      <span>{{ chat.name }}</span>
      <el-button
        plain
        icon="el-icon-more"
        size="small"
        circle
        class="btn"
      ></el-button>
    </div>
    <el-divider class="divider" />
    <div class="message">
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
          <img :src="item.avatar" alt="头像" />

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
        @keyup.enter="send()"
      >
      </el-input>
      <div class="footer">
        <el-button class="btn" @click="send()">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userChat",
  props: ["chat"],
  data() {
    return {
      text: "",
    };
  },
  computed: {
    messageList: {
      get: function() {
        return this.$store.state.messageList;
      },
      // set: function(val) {
      //   this.$store.commit("setMessageList", val);
      // },
    },
  },
  methods: {
    send() {
      console.log(1);
    },
  },
  beforemounted() {
    // setMessageListByChatID
    console.log("111");
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
