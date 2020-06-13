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
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button size="large">
            <i class="el-icon-plus"> </i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="newFriendDialogVisible"
              >添加好友</el-dropdown-item
            >
            <el-dropdown-item command="newGroupDialogVisible"
              >新建群组</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <new-friend-dialog
          :visible.sync="newFriendDialogVisible"
        ></new-friend-dialog>
        <new-group-dialog
          :visible.sync="newGroupDialogVisible"
          friend-list="friends"
          @new-group="loadG"
        ></new-group-dialog>
      </div>
      <el-divider id="divider" />
      <el-menu
        router
        background-color="#d3d3d3"
        active-text-color="#ffd04b"
        style="border-right-width: 0;"
      >
        <el-divider content-position="left" class="divider2">群聊</el-divider>
        <el-menu-item
          class="item"
          v-for="(item, index) in groups"
          :key="item.id"
          @click="showGroup(item, index)"
        >
          <div class="item-avatar">
            <img
              src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2121061596,2871071478&fm=26&gp=0.jpg"
              alt="头像"
            />
          </div>
          <div class="item-body">
            <div class="item-word">
              <b>{{ item.name }}</b>
            </div>
          </div>
        </el-menu-item>
        <el-divider content-position="left" class="divider2">好友</el-divider>
        <el-menu-item
          class="item"
          v-for="(item, index) in friends"
          :key="item.id"
          @click="showFriend(item, index)"
        >
          <div class="item-avatar">
            <img :src="item.avatarUrl" alt="头像" />
          </div>
          <div class="item-body">
            <div class="item-word">
              <b>{{ item.nickname === "" ? item.username : item.nickname }}</b>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-card">
      <div v-if="!hasShowFriend && !hasShowGroup"></div>
      <UserCard
        :user="currentItem"
        v-else-if="hasShowFriend && !hasShowGroup"
      />
      <GroupCard :group="currentItem" v-else />
    </div>
  </div>
</template>

<script>
import { loadGroups } from "@/JavaScript/load.js";
import UserCard from "../UserCard.vue";
import NewFriendDialog from "@/components/NewFriendDialog";
import NewGroupDialog from "@/components/NewGroupDialog";
import GroupCard from "../GroupCard.vue";
export default {
  name: "FriendsPanel",
  components: {
    NewGroupDialog,
    NewFriendDialog,
    UserCard,
    GroupCard,
  },
  data() {
    return {
      hasShowFriend: false,
      hasShowGroup: false,
      state: "",
      newFriendDialogVisible: false,
      newGroupDialogVisible: false,
      currentItem: {},
    };
  },
  mounted() {
    console.log("hao" + this.$store.state.user.access_token);
    // this.friends = [
    //   {
    //     id: "1",
    //     username: "老板",
    //     nickname: "",
    //     avatarUrl:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    //   {
    //     id: "2",
    //     username: "钢铁侠",
    //     nickname: "老大",
    //     avatarUrl:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    //   {
    //     id: "3",
    //     username: "Happy",
    //     nickname: "绿巨人",
    //     avatarUrl:
    //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //   },
    // ];
  },
  computed: {
    groups: {
      get: function() {
        return this.$store.state.groups;
      },
      set: function(val) {
        this.$store.commit("setGroups", JSON.parse(JSON.stringify(val)));
      },
    },
    friends: {
      get: function() {
        return this.$store.state.friends;
      },
      set: function(val) {
        this.$store.commit("setFriends", JSON.parse(JSON.stringify(val)));
      },
    },
    // currentFriend: {
    //   get: function() {
    //     return this.$store.state.currentFriend;
    //   },
    //   set: function(val) {
    //     this.$store.commit("setFriends", JSON.parse(JSON.stringify(val)));
    //   },
    // },
  },
  methods: {
    loadG() {
      loadGroups();
    },
    showFriend(item) {
      console.log("111");
      this.hasShowGroup = false;
      this.hasShowFriend = true;
      this.currentItem = item;
      // this.chatList[index] = this.$store.state.currentChat;
      // console.log(this.currentItem);
      // setMessageListByChatID
    },
    showGroup(item) {
      console.log("222");
      this.hadShowFriend = false;
      this.hasShowGroup = true;
      this.currentItem = item;
      // this.chatList[index] = this.$store.state.currentChat;
      // console.log(this.currentItem);
      // setMessageListByChatID
    },
    querySearch(queryString, cb) {
      var friends = this.friends;
      var results = queryString
        ? friends.filter(this.createFilter(queryString))
        : friends;
      cb(results);
    },
    handleCommand(command) {
      this[command] = true;
    },
    createFilter(queryString) {
      return (val) => {
        return val.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      console.log(item);
    },
  },
};
</script>

<style lang="scss">
.unseen {
  display: none;
}
#divider {
  margin: 0px;
}
.divider2 {
  margin-bottom: 20px;
  .el-divider__text {
    background-color: #d3d3d3;
    color: #808080;
  }
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
      top: 0px;
      z-index: 2;
      background-color: #d3d3d3;
      position: sticky;
      display: flex;
      flex-direction: row;
      width: 95%;
      padding-top: 2%;
      padding-left: 5%;
      .el-autocomplete {
        // position: fixed;
        // top: 0;
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
