<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加好友"
      :before-close="close"
      width="300px"
      :center="true"
      :modal-append-to-body="false"
      top="20px"
    >
      <el-input
        placeholder="watup code"
        prefix-icon="el-icon-search"
        v-model="userId"
        @change="searchUser"
      ></el-input>
      <div id="card">
        <el-card v-for="user in users" :key="user.id" shadow="hover">
          <div id="info">
            <div><img id="avatar" :src="user.avatarUrl" alt="头像" /></div>
            <div>{{ user.username }}</div>
          </div>
        </el-card>
      </div>
      <div id="remark">
        <el-input
          v-if="users.length > 0"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入验证信息"
          v-model="remark"
        >
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddFriend"
          :disabled="users.length === 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NewFriendDialog",
  props: {
    visible: {
      required: true,
    },
    defaultId: {
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      userId: this.defaultId,
      users: [],
      remark: "",
    };
  },
  watch: {
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    visible(val) {
      this.dialogVisible = val;
    },
    defaultId(val) {
      this.userId = val;
    },
  },
    created() {
        this.searchUser();
    },
    methods: {
    searchUser() {
      this.$axios
        .get("/api/friend/user", {
          params: {
            access_token: this.$store.state.user.access_token,
            keyword: this.userId,
          },
        })
        .then((res) => {
          this.users = [res.data];
        })
        .catch(
          function() {
            this.users = [];
          }.bind(this)
        );
    },
    handleAddFriend() {
      let user;
      if (this.users.length > 0) {
        user = this.users[0];
      } else {
        this.$message.error("未指定用户");
        return;
      }
      if (this.$store.state.friends.some((data) => data.id === user.id)) {
        this.$message.error("该用户已经是你的好友");
      } else {
        this.$axios
          .post("/api/friend/request", null, {
            params: {
              access_token: this.$store.state.user.access_token,
              friendId: this.users[0].id,
              remark: this.remark,
            },
          })
          .then(() => {
            this.$message.success("好友申请发送成功");
            this.close();
          })
          .catch(
            function(error) {
              console.log(error);
              this.$message.error("好友申请发送失败");
            }.bind(this)
          );
      }
    },
    close() {
      this.dialogVisible = false;
      this.userId = "";
      this.users = [];
      this.remark = "";
    },
  },
};
</script>

<style scoped>
#info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
#remark {
  margin-top: 10px;
}
#card {
  margin-top: 10px;
}
</style>
