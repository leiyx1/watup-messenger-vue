<template>
  <div id="app">
<!--    <VideoChat></VideoChat>-->
      <UniChatPage></UniChatPage>

  </div>
</template>

<script>
import UniChatPage from "./components/UniChatPage";

export default {
  name: 'App',
  components: {
      UniChatPage,
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
  margin-top: 60px;
}
</style>
