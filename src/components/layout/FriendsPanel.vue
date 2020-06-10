<template>
  <div class="user-panel">
    <div class="side-list">
      <div class="side-top">
        <el-autocomplete
          class="inline-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="搜索"
          @select="handleSelect"
        ></el-autocomplete>
        <el-button @click="dialogVisible = true" size="small"
          ><i class="el-icon-plus"> </i
        ></el-button>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          :modal="false"
          width="30%"
        >
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
      <el-divider id="divider" />
      <el-menu
        router
        background-color="#d3d3d3"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <el-menu-item
          class="item"
          v-for="(item, index) in friends"
          :key="index"
          @click="showCard(item, index)"
        >
          <div class="item-avatar">
            <img :src="item.avatarUrl" alt="头像" />
          </div>
          <div class="item-body">
            <div class="item-word">
              <b>{{ item.id }}({{ item.nickname }})</b>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-card">
      <UserCard v-if="show" :user="currentItem" />
    </div>
  </div>
</template>

<script>
import UserCard from "../UserCard.vue";
export default {
  name: "FriendsPanel",
  components: {
    UserCard,
  },
  data() {
    return {
      show: false,
      state: "",
      dialogVisible: false,
      currentItem: {},
    };
  },
  mounted() {
    this.loadFriends();
    // this.friends = [
    //   {
    //     ID: "1",
    //     name: "老板",
    //     nickname: "",
    //     avatar:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    //   {
    //     ID: "2",
    //     name: "钢铁侠",
    //     nickname: "老大",
    //     avatar:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    //   {
    //     ID: "3",
    //     name: "Happy",
    //     nickname: "绿巨人",
    //     avatar:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    // ];
  },
  computed: {
    friends: {
      get: function() {
        return this.$store.state.friends;
      },
      set: function(val) {
        this.$store.commit("setFriends", JSON.parse(JSON.stringify(val)));
      },
    },
  },
  methods: {
    showCard(item) {
      this.show = true;
      this.currentItem = item;
      // this.chatList[index] = this.$store.state.currentChat;
      console.log(this.currentItem);
      // setMessageListByChatID
    },
    querySearch(queryString, cb) {
      var userList = this.userList;
      var results = queryString
        ? userList.filter(this.createFilter(queryString))
        : userList;
      cb(results);
    },
    createFilter(queryString) {
      return (val) => {
        return val.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    loadFriends() {
      this.$axios
        .get("api/friends",{
        headers:{ Authorization: "token:1" }
      })
        .then((successResponse) => {
          // var responseResult = JSON.stringify(successResponse.data);
          console.log(successResponse.data);
          if (successResponse.status>=200&&successResponse.status<300) {
            this.$store.commit("setFriends", successResponse.data);
          } else {
            this.$notify.error({
              title: "错误",
              message: "拉取好友列表出错",
            });
          }
        })
        .catch((failResponse) => {
          console.log(failResponse);
        });
    },
  },
};
</script>

<style lang="scss">
#divider {
  margin: 0px;
}
.user-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .side-list {
    width: 25%;
    height: 100%;
    margin: 0;
    background-color: #d3d3d3;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .side-top {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding-top: 2%;
      padding-left: 3%;
      .el-autocomplete {
        width: 70%;
      }
    }
    .item {
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 70px;
      padding-left: 0px;
      padding-right: 0px;
      .item-avatar {
        align-items: center;
        float: left;
        width: 45px;
        img {
          width: 45px;
        }
      }
      .item-body {
        width: 100%;
        height: 100%;
        padding-left: 3%;
        .item-word {
          b {
            float: left;
            padding-left: 5px;
            padding-top: 8%;
            color: #808080;
            // height: 67%;
          }
        }
      }
    }
  }
  .right-card {
    width: 75%;
  }
}
</style>
