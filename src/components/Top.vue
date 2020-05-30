<template>
  <div>
    <span>{{ this.currentChat.name }}</span>
    <el-divider style="margin: 0px" />
  </div>
</template>
<script>
export default {
  name: "Top",
  data() {
    return {
      // 默认选中的值
      icon: "ios-square-outline",
    };
  },

  methods: {
    min() {
      this.winControl.min();
    },
    close() {
      this.winControl.close();
    },
  },
};
</script>
<style lang="scss">
$top-height: 4rem;
$color-online: #d1ffe9;

.im-top {
  height: $top-height;
  padding: 0.5rem;

  width: 100%;

  a {
    padding-right: 10px;
    display: block;
    // color: $color-write;
    float: right;

    i {
      // color: $color-default;
      font-size: 1.4rem;
      font-weight: bolder;
    }

    :hover {
      // background-color: $color-gray;
    }

    .text-right {
      float: right;
      width: 2.4rem;
      height: 2.4rem;
      display: inline-block;
      padding: 0.5rem;
      text-align: center;
    }
  }
}
</style>
