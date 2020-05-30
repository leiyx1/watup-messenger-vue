<template>
  <div id="main">
    <div class="side-menu">
      <el-menu
        router
        default-active="page1"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <el-menu-item index="/index">
          <i class="el-icon-user"></i>
        </el-menu-item>
        <el-menu-item index="/index/chatpanel">
          <i class="el-icon-menu"></i>
        </el-menu-item>
        <el-menu-item index="/index/page3">
          <i class="el-icon-document"></i>
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
export default {
  name: "Index",
  data() {
    return {
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
