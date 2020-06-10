<template>
  <div class="settingBox">
    <el-dialog
      title="个人资料"
      :visible.sync="visible"
      width="70%"
      :append-to-body="true"
    >
      <span>修改个人信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
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
        <div class="level-1-word">
          <span>{{ user.username }}</span>
        </div>
        <img :src="user.avatar" />
      </div>
      <el-divider class="divider1" />
      <div class="level-2">
        <ul>
          <li>地 &nbsp;区: China</li>
          <li>签 &nbsp;名: Coolo(*￣▽￣*)ブ</li>
          <li>
            <el-button @click="visible = true" type="text">编辑</el-button>
          </li>
        </ul>
      </div>
      <el-divider class="divider1" />
      <div class="level-3">
        <el-button @click="save">保存设置</el-button>
        <el-button @click="logout">退出登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      permissions: {
        notify: true,
        voice: true,
        fullscreen: false,
        unseen: false,
      },
      user: {
        username: "测试用户01",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
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
    logout() {
      this.$router.push("/login");
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
      height: 27%;
      padding-top: 10%;
      .level-1-word {
        // width: 30%;
        display: flex;
        flex-direction: column;
        padding-left: 20%;
        padding-right: 5%;
        span {
          font-size: 40px;
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
}
</style>
