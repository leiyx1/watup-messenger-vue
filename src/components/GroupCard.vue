<template>
  <div class="group-card">
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
      <img :src="group.avatarUrl" />
    </div>
    <el-divider class="divider1" />
    <div class="level-2">
      <div>
        <el-card> </el-card>
      </div>
    </div>
    <el-divider class="divider1" />
    <div class="level-3">
      <el-button @click="goChat" style="margin-right:5%">发起聊天</el-button>
      <el-button @click="exitGroup" style="margin-right:5%">{{
        isManager ? "解散群聊" : "退出群聊"
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupCard",
  props: ["group"],
  data() {
    return {
      editName: false,
      newNick: "",
    };
  },
  mounted() {
    console.log("");
    console.log();
  },
  computed: {
    isManager: {
      get() {
        return this.$store.state.user.id === this.group.managerId;
      },
    },
  },
  methods: {
    goChat() {
      this.$router.push("/index/chatpanel");
      // findChatByUserID
      var foundChat = {
        id: "1",
        name: "找到的聊天",
        sign: "最后一条..",
        avatarUrl:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        messageList: [
          {
            mine: true,
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: "第一条消息",
          },
          {
            mine: true,
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: "第2条消息",
          },
          {
            mine: false,
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: "第3条消息",
          },
          {
            mine: true,
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: "hahha",
          },
          {
            mine: true,
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            content: "我是达斯吐尔😄",
          },
        ],
      };
      this.$store.commit("unshiftChatList", foundChat);
      // this.$store.commit("setCurrentChat", this.user);
    },
    editNick() {
      this.editName = true;
      this.newNick = "";
      this.$nextTick(() => {
        document.getElementById("NickInput").focus();
      });
    },
    handleCommand(command) {
      if (command == "a") {
        this.$confirm("此操作将拉黑该好友, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送拉黑请求并更新
            this.$message({
              type: "success",
              message: "拉黑成功!",
            });
          })
          .catch(() => {});
      } else {
        this.$confirm("此操作将删除该好友, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送删除请求并更新
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {});
      }
    },
    saveNick() {
      console.log("1");
      this.editName = !this.editName;
      this.user.nickname = this.newNick;

      // 涉及到更新数据库
    },
    exitGroup() {},
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
    div {
      height: 100%;
      .el-card {
        height: 100%;
        margin: 5px 10%;
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
