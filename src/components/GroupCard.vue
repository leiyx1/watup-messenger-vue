<template>
  <div class="group-card">
    <InviteFriendToGroupDialog
      :visible.sync="inviteFriendDialogVisible"
      :group-id="group.id"
      :groupMembers="group.usersId"
      friend-list="friends"
    ></InviteFriendToGroupDialog>
    <RemoveFriendFromGroupDialog
      :visible.sync="removeFriendDialogVisible"
      :group-id="group.id"
      :members="groupMembers"
      @remove-friend="loadGroupMembers"
    ></RemoveFriendFromGroupDialog>
    <div class="level-1">
      <div class="level-1-word">
        <div style="height: 60px">
          <span v-if="!editName" class="span1"
            >{{ group.name }}
            <el-button
              v-if="isManager"
              type="text"
              icon="el-icon-edit"
              @click="editNick"
            ></el-button
          ></span>
          <div v-else>
            <el-tooltip content="按回车保存" placement="bottom">
              <el-input
                id="NickInput"
                maxlength="6"
                show-word-limit
                v-model="newNick"
                placeholder="按回车保存"
                @keyup.enter.native="saveNick"
                @change="saveNick"
              ></el-input>
            </el-tooltip>
          </div>
        </div>
        <!-- <el-button class="btn" type="text">修改备注</el-button> -->
      </div>
      <div class="avatar">
        <img
          src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2121061596,2871071478&fm=26&gp=0.jpg"
          alt="头像"
          width="100px"
          height="100px"
        />
      </div>
    </div>
    <el-divider class="divider1" />
    <div class="level-2">
      <div id="members">
        <div v-for="member in groupMembers" :key="member.id">
          <div class="member" @click="goUser(member)">
            <el-avatar
              shape="square"
              size="medium"
              :src="member.avatarUrl"
            ></el-avatar>
            <span class="name">{{ member.username }}</span>
          </div>
        </div>
        <div class="member">
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="inviteFriendDialogVisible = true"
          ></el-button>
        </div>
        <div class="member" v-if="isManager">
          <el-button
            size="mini"
            icon="el-icon-minus"
            @click="removeFriendDialogVisible = true"
          ></el-button>
        </div>
      </div>
    </div>
    <el-divider class="divider1" />
    <div class="level-3">
      <el-button @click="goChat" style="margin-right:5%">发起聊天</el-button>
      <el-button style="margin-right:5%" slot="reference" @click="exitGroup">{{
        isManager ? "解散群聊" : "退出群聊"
      }}</el-button>
    </div>
  </div>
</template>

<script>
import InviteFriendToGroupDialog from "./InviteFriendToGroupDialog";
import RemoveFriendFromGroupDialog from "./RemoveFriendFromGroupDialog";
import getNeDB from "../JavaScript/NedbConfig";
import { loadGroups } from "../JavaScript/load.js";
export default {
  name: "GroupCard",
  props: ["group"],
  components: {
    InviteFriendToGroupDialog,
    RemoveFriendFromGroupDialog,
  },
  data() {
    return {
      editName: false,
      inviteFriendDialogVisible: false,
      removeFriendDialogVisible: false,
      newNick: "",
      groupMembers: [],
    };
  },
  created() {
    this.loadGroupMembers();
    this.loadSingleGroup();
  },
  watch: {
    group() {
      this.loadGroupMembers();
    },
  },
  computed: {
    isManager: {
      get() {
        return this.$store.state.user.id === this.group.managerId;
      },
    },
    friends: {
      get: function() {
        return this.$store.state.friends;
      },
      set: function(val) {
        this.$store.commit("setFriends", JSON.parse(JSON.stringify(val)));
      },
    },
    chatList: {
      get() {
        return this.$store.state.chatList;
      },
    },
  },
  methods: {
    goUser(member) {
      if (member.id === this.$store.state.user.id) {
        this.$router.push("/index/setting");
      } else {
        this.$emit("showGroupFriend", member);
      }
    },
    loadSingleGroup() {
      this.$axios
        .get(
          "/api/group/" +
            this.group.id +
            `?access_token=` +
            this.$store.state.user.access_token
        )
        .then((res) => {
          if (res.status === 400) {
            console.log("error occurred!");
          } else if (res.status === 200) {
            let groups = this.$store.state.groups;
            let obj = groups.find((obj) => obj.id === this.group.id);
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
    loadGroupMembers() {
      this.groupMembers = [];
      let ids = this.group.usersId;
      let failedMembers = [];
      // let userCache = this.$store.state.userCache;
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
            this.$store.commit("updateUserCache", res.data);
            // let obj = userCache.find((obj) => obj.id === res.data.id);
            // if (obj) {
            //   let index = userCache.indexOf(obj);
            //   userCache[index] = res.data;
            // } else userCache.push(res.data);
            // this.$store.commit("setUserCache", userCache);
          })
          .catch(function(error) {
            console.log(error);
            failedMembers.push(id);
          });
      });
      if (failedMembers.length > 0)
        this.$message.info(failedMembers.join(", ") + "信息未成功获取");
    },
    goChat() {
      var foundChat = this.chatList.find(
        (obj) => obj.chatId === this.group.id && obj.type === "MULTICAST"
      );
      if (foundChat) {
        this.$store.commit("unshiftChatList", foundChat);
      } else {
        console.log(this.group);
        var newChat = {
          type: "MULTICAST",
          chatId: this.group.id,
          name: this.group.name,
          sign: "",
          avatarUrl: this.group.avatarUrl,
          messageList: [],
          groupMembers: this.groupMembers,
        };
        this.$store.commit("unshiftChatList", newChat);
        getNeDB().localMessage.insert(newChat, function(err, docs) {
          console.log("add new item:" + docs);
        });
      }
      this.$router.push("/index/chatpanel");
    },
    editNick() {
      this.editName = true;
      this.newNick = "";
      this.$nextTick(() => {
        document.getElementById("NickInput").focus();
      });
    },
    saveNick() {
      this.editName = !this.editName;
      this.group.name = this.newNick;
      this.$axios
        .put(
          "/api/group/" +
            this.group.id +
            "?access_token=" +
            this.$store.state.user.access_token +
            "&name=" +
            this.newNick
        )
        .then((res) => {
          if (res.status === 200) {
            this.$notify.success("修改成功");
          } else {
            this.$notify.error("无效操作");
          }
        })
        .catch(function(error) {
          this.$notify.error("无效操作");
          console.log(error);
        });
    },
    exitGroup() {
      this.$confirm("此操作将退出群聊, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(
              "/api/group/" +
                this.group.id +
                "?access_token=" +
                this.$store.state.user.access_token
            )
            .then((res) => {
              if (res.status === 200) {
                this.$notify.success("成功退群");
              } else {
                this.$notify.error("无效操作");
              }
              loadGroups();
              this.$emit("exit-group");
            })
            .catch(function(error) {
              this.$notify.error("无效操作");
              console.log(error);
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss">
.unseen {
  display: none;
}
.divider1 {
  margin: 0;
  width: 77%;
  margin: auto;
}
.group-card {
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
      .span1 {
        float: left;
        font-size: 40px;
      }
      p {
        float: left;
        margin: 5px 0px;
      }
    }
    .avatar {
      position: absolute;
      right: 10%;
      float: right;
      width: 100px;
      height: 100px;
    }
  }
  .level-2 {
    padding-top: 3%;
    height: 23%;
    div {
      height: 100%;
      .el-card {
        height: 100%;
        margin: 5px 10%;
      }
    }
    .member {
      .el-button {
        // width: 42px;
        height: 70%;
      }
    }
  }
  .level-3 {
    .el-button {
      margin-top: 10%;
    }
  }
  #members {
    padding-left: 20%;
    align-self: start;
    grid-column: 3;
    grid-row: 3;
    overflow: auto;
    display: grid;
    height: 300px;
    grid-template-columns: 60px 60px 60px 60px;
    grid-template-rows: 60px 60px;
    grid-auto-rows: 60px;
    align-items: center;
  }
  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  .name {
    text-align: center;
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
