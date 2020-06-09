<template>
  <div class="card">
    <div class="level-1">
      <div class="level-1-word">
        <span>{{ user.username }}</span>
        <!-- <el-button class="btn" type="text">修改备注</el-button> -->
      </div>
      <img :src="user.avatar" />
    </div>
    <el-divider class="divider1" />
    <div class="level-2">
      <ul>
        <li>地 &nbsp;区: China</li>
        <li>签 &nbsp;名: Coolo(*￣▽￣*)ブ</li>
        <li>来 &nbsp;源: 通过搜索ID添加</li>
      </ul>
    </div>
    <el-divider class="divider1" />
    <div class="level-3">
      <el-button @click="goChat">发起聊天</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: ["user"],
  methods: {
    goChat() {
      this.$router.push("/index/chatpanel");
    },
  },
};
</script>

<style lang="scss">
.divider1 {
  margin: 0;
  width: 77%;
  margin: auto;
}
.card {
  height: 100%;
  .level-1 {
    display: flex;
    flex-direction: row;
    height: 23%;
    padding-top: 10%;
    .level-1-word {
      // width: 30%;
      display: flex;
      flex-direction: column;
      padding-left: 20%;
      padding-right: 10%;
      span {
        font-size: 40px;
      }
    }
    img {
      // padding-right: 10%;
      position: absolute;
      right: 10%;
      float: right;
      width: 100px;
      height: 100px;
    }
  }
  .level-2 {
    height: 23%;
    ul {
      padding-left: 0;
      list-style: none;
      li {
        padding-left: 20%;
        padding-top: 2%;
        text-align: left;
      }
    }
  }
  .level-3 {
    .el-button {
      margin-top: 10%;
    }
  }
}
</style>
