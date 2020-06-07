<template>
  <el-container id="app">
    <router-view />
  </el-container>
</template>

<script>


export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* height: 100%;
    width: 100%; */
    /* margin-top: 60px; */
  }
  body {
    margin: 0;
    padding: 0;
  }
</style>
