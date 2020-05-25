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
          <i class="el-icon-menu"></i>
        </el-menu-item>
        <el-menu-item index="/index/page2">
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
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
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
