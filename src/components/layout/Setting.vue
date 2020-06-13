<template>
  <div class="settingBox">
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
                  maxlength="6"
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
        <img :src="user.avatar" />
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
                  maxlength="6"
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
                  maxlength="10"
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
        <el-button @click="clearNeDB">清空本地数据</el-button>
        <el-button @click="save">黑名单</el-button>
        <el-button @click="logout" type="danger">注销</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import getWebsocket from "../../JavaScript/Websocket";
import getNeDB from "../../JavaScript/NedbConfig";
export default {
  data() {
    return {
      newName: "",
      newSign: "",
      newArea: "",
      hasEditArea: false,
      hasEditName: false,
      hasEditSign: false,
      permissions: {
        notify: true,
        voice: true,
        fullscreen: false,
        unseen: false,
      },
      user: {
        id: "huyikun",
        username: "我是达斯吐尔",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        area: "China",
        sign: "Coolo(*￣▽￣*)ブ",
      },
    };
  },
  computed: {
    // 实际应该登录后从vuex中取user
    // user: {
    //   get() {
    //     return this.$store.state.user;
    //   },
    // },
  },
  methods: {
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
      this.user.username = this.newName;
      this.hasEditName = false;
      this.$notify({
        title: "成功",
        message: "已改名为:" + this.newName,
        type: "success",
      });
    },
    saveArea() {
      if (this.user.area == this.newArea || this.newArea == "") {
        this.hasEditArea = false;
        return;
      }
      // 发送改地区请求并更新
      this.user.area = this.newArea;
      this.hasEditArea = false;
      this.$notify({
        title: "成功",
        message: "地区已改为:" + this.newArea,
        type: "success",
      });
    },
    saveSign() {
      if (this.user.sign == this.newSign || this.newSign == "") {
        this.hasEditSign = false;
        return;
      }
      this.user.sign = this.newSign;
      // 发送改签名请求并更新
      this.hasEditSign = false;
      this.$notify({
        title: "成功",
        message: "签名已改为:" + this.newSign,
        type: "success",
      });
    },
    logout() {
      this.$router.push("/login");
      getWebsocket().close();
    },
    clearNeDB() {
      this.$confirm("此操作将永久删除用户本地数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(getNeDB());
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
          font-size: 35px;
        }
        p {
          float: left;
          margin: 2px 0px;
        }
      }
      img {
        // padding-right: 10%;
        position: absolute;
        right: 5%;
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
