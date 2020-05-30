<template>
  <div class="windows">
    <div class="top">
      <span>{{ this.currentChat.name }}</span>
      <el-button
        plain
        icon="el-icon-more"
        size="small"
        circle
        class="btn"
      ></el-button>
    </div>
    <el-divider class="divider" />
    <div class="message">{{ chat.name }} {{ chat.sign }}</div>
    <el-divider />
    <div class="send"></div>
  </div>
</template>

<script>
export default {
  name: "userChat",
  props: ["chat"],
  computed: {
    currentChat: {
      get: function() {
        return this.$store.state.currentChat;
      },
    },
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
      padding-left: 5%;
      padding-top: 2%;
    }
    .btn {
      float: right;
      margin-top: 2%;
      // margin-bottom: 4%;
      margin-right: 2%;
    }
  }
  .message {
    height: 57%;
  }
  .send {
    height: 33%;
  }
}
</style>
