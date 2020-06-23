<template>
  <div class="settingBox">
    <div class="avatarView" v-viewer="{ movable: false }" style="display: none">
      <img v-for="src in avatars" :src="src" :key="src" />
    </div>
    <div class="left">
      <div class="item">
        <el-switch v-model="permissions.notify" inactive-text="通知">
        </el-switch>
      </div>
      <div class="item">
        <el-switch v-model="permissions.voice" inactive-text="声音">
        </el-switch>
      </div>
      <div class="item">
        <el-switch v-model="permissions.fullscreen" inactive-text="全屏">
        </el-switch>
      </div>
      <div class="item">
        <el-switch v-model="permissions.unseen" inactive-text="勿扰模式">
        </el-switch>
      </div>
    </div>
    <el-divider id="vert-divider" direction="vertical" />
    <div class="right">
      <div class="level-1">
        <!-- <div class="level-1-word">
          <span>{{ user.username }}</span>
        </div>
        <img :src="user.avatar" /> -->
        <div class="level-1-word">
          <div style="height: 60px">
            <span class="span1" v-if="!hasEditName"
              >{{ user.username }}
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="editName"
              ></el-button
            ></span>
            <div v-else>
              <el-tooltip content="按回车保存" placement="bottom">
                <el-input
                  id="nameput"
                  maxlength="12"
                  show-word-limit
                  v-model="newName"
                  placeholder="回车保存"
                  @change="saveName"
                  @keyup.enter.native="saveName"
                ></el-input>
              </el-tooltip>
            </div>
          </div>
          <div>
            <p>watup_ID:{{ user.id }}</p>
          </div>
          <!-- <el-button class="btn" type="text">修改备注</el-button> -->
        </div>
        <div class="level-1-img">
          <img :src="user.avatarUrl" @click="viewLargerAvatar($event)" />
          <el-upload
            class="avatar-uploader"
            :action="upUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button>更改头像</el-button>
          </el-upload>
        </div>
      </div>
      <el-divider class="divider1" />
      <div class="level-2">
        <ul>
          <li>
            <span v-if="!hasEditArea"
              >地 &nbsp;区: {{ user.area }}
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="editArea"
              ></el-button
            ></span>
            <div v-else>
              <el-tooltip content="按回车保存" placement="bottom">
                地区：
                <el-input
                  id="areaput"
                  maxlength="12"
                  show-word-limit
                  v-model="newArea"
                  placeholder="回车保存"
                  @change="saveArea"
                  @keyup.enter.native="saveArea"
                ></el-input>
              </el-tooltip>
            </div>
          </li>
          <li>
            <span v-if="!hasEditSign"
              >签 &nbsp;名: {{ user.sign }}
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="editSign"
              ></el-button
            ></span>
            <div v-else>
              <el-tooltip content="按回车保存" placement="bottom">
                <el-input
                  id="signput"
                  maxlength="30"
                  show-word-limit
                  v-model="newSign"
                  placeholder="回车保存"
                  @change="saveSign"
                  @keyup.enter.native="saveSign"
                ></el-input>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </div>
      <el-divider class="divider1" />
      <div class="level-3">
        <el-upload
          class="avatar-uploader"
          :action="upUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-button>更改头像</el-button>
        </el-upload>

        <el-button @click="clearNeDB">清空本地数据</el-button>
        <el-button @click="blockListVisible = true">管理黑名单</el-button>
        <el-button @click="logout" type="danger">注销</el-button>
      </div>
    </div>
    <BlockListDialog :visible.sync="blockListVisible"></BlockListDialog>
  </div>
</template>

<script>
import getWebsocket from "../../JavaScript/Websocket";
import getNeDB from "../../JavaScript/NedbConfig";
import BlockListDialog from "../BlockListDialog";
export default {
  components: {
    BlockListDialog,
  },
  data() {
    return {
      avatars: [],
      token: {
        access_token: this.$store.state.user.access_token,
      },
      upUrl:
        "http://106.13.123.20:8080/api/user/updateAvatar?access_token=" +
        this.$store.state.user.access_token,
      newName: "",
      newSign: "",
      newArea: "",
      hasEditArea: false,
      hasEditName: false,
      hasEditSign: false,
      blockListVisible: false,
      permissions: {
        notify: true,
        voice: true,
        fullscreen: false,
        unseen: false,
      },
    };
  },
  mounted() {},
  computed: {
    // 实际应该登录后从vuex中取user
    user: {
      get() {
        return this.$store.state.user;
      },
    },
  },
  methods: {
    viewLargerAvatar: function(event) {
      console.log(event.target.currentSrc);
      let imgUrl = event.target.currentSrc;
      if (typeof imgUrl !== "undefined") {
        this.avatars = [];
        this.avatars.push(imgUrl);
        this.$nextTick(this.show());
      }
    },
    show() {
      let viewer = this.$el.querySelector(".avatarView").$viewer;
      viewer.show();
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.$store.commit("setUserAvatar", res.data);
        this.user.avatarUrl = res.data;
        // this.$axios
        //   .get("usercenter/uploadAvatar", {
        //     params: {
        //       username: this.user.username,
        //       avatarUrl: this.url[0]
        //     }
        //   })
        //   .then(response => {
        //   });
      } else if (res.code === 400) {
        console.log("fail");
      } else {
        console.log(res);
      }
      //location.reload();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isPNG || isJPG) && isLt2M;
    },
    editName: function() {
      this.newName = "";
      this.hasEditName = true;
      this.$nextTick(() => {
        document.getElementById("nameput").focus();
      });
    },
    editArea: function() {
      this.newArea = "";
      this.hasEditArea = true;
      this.$nextTick(() => {
        document.getElementById("areaput").focus();
      });
    },
    editSign: function() {
      this.newSign = "";
      this.hasEditSign = true;
      this.$nextTick(() => {
        document.getElementById("signput").focus();
      });
    },
    saveName() {
      if (this.user.username == this.newName || this.newName == "") {
        this.hasEditName = false;
        return;
      }
      // 发送改名请求并更新
      this.$axios
        .post(
          "/api/user/updateUsername?access_token=" +
            this.$store.state.user.access_token +
            "&username=" +
            this.newName
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify({
              title: "成功",
              message: "已改名为:" + this.newName,
              type: "success",
            });
            this.user.username = this.newName;
            this.hasEditName = false;
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.message,
            });
          }
        });
    },
    saveArea() {
      if (this.user.area == this.newArea || this.newArea == "") {
        this.hasEditArea = false;
        return;
      }
      // 发送改地区请求并更新
      this.$axios
        .post(
          "/api/user/updateArea?access_token=" +
            this.$store.state.user.access_token +
            "&area=" +
            this.newArea
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.user.area = this.newArea;
            this.hasEditArea = false;
            this.$notify({
              title: "成功",
              message: "地区已改为:" + this.newArea,
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.message,
            });
          }
        });
    },
    saveSign() {
      if (this.user.sign == this.newSign || this.newSign == "") {
        this.hasEditSign = false;
        return;
      }

      // 发送改签名请求并更新
      this.$axios
        .post(
          "/api/user/updateSign?access_token=" +
            this.$store.state.user.access_token +
            "&sign=" +
            this.newSign
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.user.sign = this.newSign;
            this.hasEditSign = false;
            this.$notify({
              title: "成功",
              message: "签名已改为:" + this.newSign,
              type: "success",
            });
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.message,
            });
          }
        });
    },
    logout() {
      this.$axios
        .get("/oauth/removeToken?access_token=" + this.user.access_token)
        .then((res) => {
          if (res.data.code === 200) {
            this.$notify({
              title: "成功",
              message: res.data.message,
              type: "success",
            });
            this.$store.commit("resetVuex");
            this.$router.push("/login");
            getWebsocket().close();
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.message,
            });
          }
        });
    },
    clearNeDB() {
      this.$confirm("此操作将永久删除用户本地数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getNeDB().userInfo.remove({}, { multi: true }, function(
          err,
          numRemoved
        ) {
          console.log(numRemoved + "条userInfo数据被删除");
        });
        getNeDB().localMessage.remove({}, { multi: true }, function(
          err,
          numRemoved
        ) {
          console.log(numRemoved + "条localMessage数据被删除");
        });
        getNeDB().systemInfo.remove({}, { multi: true }, function(
          err,
          numRemoved
        ) {
          console.log(numRemoved + "条systemInfo数据被删除");
        });
        this.$store.commit("setChatList", []);
      });
    },
    submit() {
      // 修改个人资料
      this.visible = false;
    },
    save() {
      // setting save
    },
  },
};
</script>

<style lang="scss">
#vert-divider {
  height: 75%;
  margin: auto;
}
.divider1 {
  margin: 0;
  width: 77%;
  margin: auto;
}
.avatar-uploader {
  width: 150px;
  margin-top: 10%;
}
.settingBox {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
  display: flex;
  flex-direction: row;
  .left {
    width: 33%;
    display: flex;
    flex-direction: column;
    .item {
      padding-top: 20%;
      .el-switch {
        float: left;
        padding-left: 12%;
      }
    }
  }
  .right {
    width: 66%;
    .level-1 {
      display: flex;
      flex-direction: row;
      height: 23%;
      padding-top: 10%;
      .level-1-word {
        // width: 30%;
        display: flex;
        flex-direction: column;
        padding-left: 15%;
        padding-right: 5%;
        .span1 {
          float: left;
          font-size: 30px;
        }
        p {
          float: left;
          margin: 2px 0px;
        }
      }
      .level-1-img {
        width: 100%;
        display: flex;
        flex-direction: column;
        img {
          // padding-right: 10%;
          position: absolute;
          right: 5%;
          float: right;
          width: 100px;
          height: 100px;
        }
        .el-button {
          position: absolute;
          right: 5%;
          top: 24%;
          float: right;
        }
      }
    }
    .level-2 {
      height: 23%;
      ul {
        padding-left: 0;
        list-style: none;
        li {
          padding-left: 15%;
          padding-top: 2%;
          text-align: left;
          .btn {
            float: right;
            padding-right: 30%;
          }
          .el-input {
            width: 70%;
          }
        }
      }
    }
    .level-3 {
      .el-button {
        margin-top: 10%;
      }
    }
  }
}
</style>
