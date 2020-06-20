<template>
  <div class="card">
    <div class="level-1">
      <div class="level-1-word">
        <div style="height: 60px">
          <span v-if="!editName" class="span1"
            >{{ user.nickname === "" ? user.username : user.nickname }}
            <el-button
                v-if="inFriendList"
              type="text"
              icon="el-icon-edit"
              @click="editNick"
            ></el-button
          ></span>
          <div v-else>
            <el-tooltip content="按回车保存" placement="bottom">
              <el-input
                id="NickInput"
                maxlength="12"
                show-word-limit
                v-model="newNick"
                placeholder="按回车保存"
                @keyup.enter.native="saveNick"
                @change="saveNick"
              ></el-input>
            </el-tooltip>
          </div>
        </div>
        <div :class="{ unseen: user.nickname == '' }">
          <p>用户名:{{ user.username }}</p>
        </div>
        <div>
          <p>watup_ID:{{ user.id }}</p>
        </div>
        <!-- <el-button class="btn" type="text">修改备注</el-button> -->
      </div>
      <img :src="user.avatarUrl" />
    </div>
    <el-divider class="divider1" />
    <div class="level-2">
      <ul>
        <li>地 &nbsp;区: {{ user.area }}</li>
        <li>签 &nbsp;名: {{ user.sign }}Coolo(*￣▽￣*)ブ</li>
        <li>来 &nbsp;源: 通过搜索ID添加</li>
      </ul>
    </div>
    <el-divider class="divider1" />
    <div class="level-3">
      <el-button v-if="inFriendList" @click="goChat" style="margin-right:5%">发起聊天</el-button>
      <el-button v-else @click="newFriendDialogVisible=true" style="margin-right:5%">添加好友</el-button>
      <el-dropdown @command="handleCommand">
        <el-button>
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="inBlockList" command="c">取消拉黑</el-dropdown-item>
          <el-dropdown-item  v-else command="a">拉黑</el-dropdown-item>
          <el-dropdown-item command="b">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <new-friend-dialog
        :visible.sync="newFriendDialogVisible"
        :default-id="user.id"
    ></new-friend-dialog>
  </div>
</template>

<script>
import getNeDB from "../JavaScript/NedbConfig";

import { loadBlockList,loadFriends } from "../JavaScript/load.js";
import NewFriendDialog from "./NewFriendDialog";
export default {
  name: "UserCard",
  props: ["user"],
    components: {
        NewFriendDialog,
    },
  data() {
    return {
      editName: false,
      newNick: "",
        newFriendDialogVisible:false,
    };
  },
  mounted() {
    console.log(this.user);
  },
  computed: {
    chatList: {
      get: function() {
        return this.$store.state.chatList;
      },
      set: function(val) {
        this.$store.commit("setChatList", JSON.parse(JSON.stringify(val)));
      },
    },
      inFriendList:{
          get: function() {
              return this.$store.state.friends.find((obj) => obj.id === this.user.id);
          },
      },
      inBlockList:{
          get: function() {
              return this.$store.state.blacklist.find((obj) => obj.id === this.user.id);
          },
      }
  },
  methods: {
    goChat() {
      var foundChat = this.chatList.find(
        (obj) => obj.chatId === this.user.id && obj.type === "UNICAST"
      );
      if (foundChat) {
        this.$store.commit("unshiftChatList", foundChat);
      } else {
        var newChat = {
          type: "UNICAST",
          chatId: this.user.id,
          name: this.user.username,
          sign: "",
          avatarUrl: this.user.avatarUrl,
          messageList: [],
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
    handleCommand(command) {
      if (command === "a") {
        this.$confirm("此操作将拉黑该好友, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送拉黑请求并更新
              this.$axios
                  .put("/api/friend/block"+"?access_token="+this.$store.state.user.access_token+"&friendId="+this.user.id)
                  .then(res => {
                      if(res.status===200){
                          this.$notify.success("拉黑成功")
                      }else {
                          this.$notify.error("无效操作")
                      }
                      loadBlockList();
                  })
                  .catch(function (error) {
                      this.$notify.error("无效操作")
                      console.log(error);
                  })
          })
          .catch(() => {});
      } else if (command === "b") {
        this.$confirm("此操作将删除该好友, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送删除请求并更新
              this.$axios
                  .delete("/api/friend"+"?access_token="+this.$store.state.user.access_token+"&friendId="+this.user.id)
                  .then(res => {
                      if(res.status===200){
                          this.$notify.success("删除成功")
                      }else {
                          this.$notify.error("无效操作")
                      }
                      loadFriends();
                      this.$emit("removeFriend");
                  })
                  .catch(function (error) {
                      this.$notify.error("无效操作")
                      console.log(error);
                  })
          })
          .catch(() => {});
      }else {
          this.$confirm("此操作将取消拉黑该好友, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
          })
              .then(() => {
                  // 发送拉黑请求并更新
                  this.$axios
                      .delete("/api/friend/block"+"?access_token="+this.$store.state.user.access_token+"&friendId="+this.user.id)
                      .then(res => {
                          if(res.status===200){
                              this.$notify.success("取消拉黑成功")
                          }else {
                              this.$notify.error("无效操作")
                          }
                          loadBlockList();
                      })
                      .catch(function (error) {
                          this.$notify.error("无效操作")
                          console.log(error);
                      })
              })
              .catch(() => {});
      }
    },
    saveNick() {
      this.editName = !this.editName;
      this.user.nickname = this.newNick;
        this.$axios
            .put("/api/friend/nickname"+"?access_token="+this.$store.state.user.access_token+"&friendId="+this.user.id+"&nickname="+this.newNick)
            .then(res => {
                if(res.status===200){
                  this.$notify.success("修改成功")
                  //更新chatList里面的name
                  let updateChatList = this.chatList
                  let obj = updateChatList.find(
                    (obj) => obj.type === "UNICAST" && obj.chatId === this.user.id,
                  )
                  if(obj){
                    let index = updateChatList.indexOf(obj);
                    updateChatList[index].name = this.newNick;
                    this.chatList = updateChatList;
                  }
                //更新friends里面的nickname


                }else {
                    this.$notify.error("无效操作")
                }
            })
            .catch(function (error) {
                this.$notify.error("无效操作")
                console.log(error);
            })
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
      .span1 {
        float: left;
        font-size: 40px;
      }
      p {
        float: left;
        margin: 5px 0px;
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
