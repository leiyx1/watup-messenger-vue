<template>
  <div id="main">
    <div class="side-menu">
      <el-menu
        router
        default-active="/index/chatpanel"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <el-menu-item>
          <el-popover
            placement="right"
            trigger="click"
            content="Hi~ o(*￣▽￣*)ブ"
          >
            <el-button type="text" slot="reference">
              <i class="el-icon-s-grid"></i
            ></el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="/index/chatpanel">
          <i class="el-icon-chat-round"></i>
        </el-menu-item>
        <el-menu-item index="/index/friends">
          <i class="el-icon-user"></i>
        </el-menu-item>
        <el-menu-item index="/index/setting">
          <i class="el-icon-setting"></i>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-panel">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
// import { desktopNotify } from "@/js/Notification.js";
export default {
  name: "Index",
  data() {
    return {
      visible: false,
      user: {
        id: "",
        username: "",
        email: "",
        friendID: [],
        avatarUrl: "",
        profile: "",
        blacklist: [],
      },
    };
  },
  components: {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {
    this.$axios
      .get("/user", {
        params: {
          token: this.$store.state.token,
        },
      })
      .then((successResponse) => {
        if (successResponse.data.code === 200) {
          this.$store.commit("setUser", successResponse.data.data);
        } else {
          this.$notify({
            title: "error",
            type: "error",
            message: "Invalid Token",
          });
        }
      });
    this.user = this.$store.state.user;

    // 监听是否有消息
    // desktopNotify();
    if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function() {
        var notice_ = new Notification("From Watup", { body: "您有新的消息" });
        notice_.click = function() {
          // seems like unworking
          window.show();
          window.focus();
        };
      });
    }
  },
};
</script>

<style>
body {
  height: 100%;
}
#main {
  display: flex;
  flex-direction: row;
  position: fixed;
  width: 100%;
  height: 100%;
}
.side-menu {
  background-color: #545c64;
  height: 100%;
  width: 8%;
}
.right-panel {
  width: 92%;
  height: 100%;
}
</style>
