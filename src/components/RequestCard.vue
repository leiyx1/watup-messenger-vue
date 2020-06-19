<template>
  <div class="request">
    <el-tabs v-model="activeName" :stretch="true">
      <el-tab-pane label="好友申请" name="first">
        <el-table
          :data="this.$store.state.friendRequest"
          stripe
          highlight-current-row
          style="width: 100%;text-align: center;cursor:pointer"
        >
          <el-table-column prop="avatarUrl" label="头像" width="70">
            <template slot-scope="scope">
              <img :src="scope.row.senderAvatarUrl" alt="头像" width="40px" />
            </template>
          </el-table-column>
          <el-table-column prop="senderId" label="watup-id" width="100">
          </el-table-column>
          <el-table-column prop="remark" label="备注" style="float: right;">
          </el-table-column>
          <el-table-column width="70">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleFriendRequest(scope.$index, scope.row)"
                type="success"
              >
                同意
              </el-button>
            </template>
          </el-table-column>
          <el-table-column width="70">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="rejectFriendRequest(scope.$index, scope.row)"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="群聊邀请" name="second">
        <el-table
          :data="this.$store.state.groupRequest"
          stripe
          highlight-current-row
          style="width: 100%;text-align: center;cursor:pointer"
        >
          <el-table-column prop="groupName" label="groupName" width="150">
          </el-table-column>
          <el-table-column
            prop="invitedBy"
            label="邀请人"
            width="150"
            style="float: right;"
          >
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleGroupRequest(scope.$index, scope.row)"
                type="success"
              >
                同意
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { loadGroupRequests, loadFriendRequests } from "../JavaScript/load.js";
export default {
  name: "RequestCard",
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleGroupRequest(index, row) {
      this.$axios
        .put(
          "api/request/" +
            row.id +
            "?access_token=" +
            this.$store.state.user.access_token
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.$notify({
              title: "成功",
              message: "成功加入" + row.groupName,
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "失效的邀请",
            });
          }
          loadGroupRequests();
          this.$emit("joinGroup");
        })
        .catch((error) => {
          console.log(error);
          this.$notify.error({
            title: "错误",
            message: "失效的邀请",
          });
        });
    },
    rejectFriendRequest(index, row) {
      this.$axios
        .delete(
          "api/friend/request?access_token=" +
            this.$store.state.user.access_token +
            "&requestId=" +
            row.id
        )
        .then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: "成功",
              message: "已拒绝" + row.id,
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "请求已被处理",
            });
          }
          loadFriendRequests();
          this.$emit("addFriend");
        })
        .catch((error) => {
          console.log(error);
          this.$notify.error({
            title: "错误",
            message: "请求已被处理",
          });
        });
    },
    handleFriendRequest(index, row) {
      this.$axios
        .put(
          "api/friend/request?access_token=" +
            this.$store.state.user.access_token +
            "&requestId=" +
            row.id
        )
        .then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: "成功",
              message: row.id + " 已成为你的好友",
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "请求已被处理",
            });
          }
          loadFriendRequests();
          this.$emit("addFriend");
        })
        .catch((error) => {
          console.log(error);
          this.$notify.error({
            title: "错误",
            message: "请求已被处理",
          });
        });
    },
    // loadGroupRequest(){
    //     this.$axios
    //         .get("api/request", {
    //             params: {
    //                 access_token:this.$store.state.user.access_token,
    //             },
    //         })
    //         .then((successResponse) => {
    //             if (successResponse.status === 200) {
    //                 this.groupRequest=successResponse.data
    //             } else {
    //                 this.$notify.error({
    //                     title: "错误",
    //                     message: "拉取群聊邀请出错",
    //                 });
    //             }
    //         })
    //         .catch((failResponse) => {
    //             console.log(failResponse);
    //         });
    // },
    // loadFriendRequest(){
    //     this.$axios
    //         .get("api/friend/request", {
    //             params: {
    //                 access_token:this.$store.state.user.access_token,
    //             },
    //         })
    //         .then((successResponse) => {
    //             if (successResponse.status === 200) {
    //                 this.friendRequest=successResponse.data
    //             } else {
    //                 this.$notify.error({
    //                     title: "错误",
    //                     message: "拉取好友申请出错",
    //                 });
    //             }
    //         })
    //         .catch((failResponse) => {
    //             console.log(failResponse);
    //         });
    // },
  },
};
</script>

<style scoped>
.friendRequest {
  margin-left: 0;
  text-align: left;
  color: black;
}
</style>
