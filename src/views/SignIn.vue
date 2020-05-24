<template>
  <div>
    <div>This is SignIn, Vuex测试: {{ name }}</div>
    <el-button @click="goNext">GGo</el-button>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      name: this.$store.state.name,
    };
  },
  methods: {
    goNext: function() {
      this.$router.replace("/index");
    },
  },
};
</script>

<style></style>
