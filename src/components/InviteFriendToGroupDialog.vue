<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="邀请好友"
      width="600px"
      :center="true"
      :modal-append-to-body="false"
    >
      <div id="dialog">
        <div id="search-input">
          <el-input
            v-model="search"
            placeholder="搜索好友"
            size="mini"
            prefix-icon="el-icon-search"
          ></el-input>
        </div>
        <div id="friend-list">
          <el-table
            :data="
              friends.filter(
                (data) =>
                  data.username.toLowerCase().includes(search.toLowerCase()) &&
                  groupMembers.indexOf(data.id) === -1
              )
            "
            style="width: 100%"
            height="300px"
            :row-style="{ height: '60px' }"
            :cell-style="{ padding: '0 0' }"
            :show-header="false"
            @row-click="handleRowClick"
          >
            <el-table-column>
              <template slot-scope="scope">
                <div id="user-button">
                  <div id="user-info">
                    <el-avatar
                      style="margin-right: 10px"
                      shape="square"
                      size="medium"
                      :src="scope.row.avatarUrl"
                    ></el-avatar>
                    <span class="name1"> {{ scope.row.username }} </span>
                  </div>
                  <div id="check-icon">
                    <i
                      class="el-icon-circle-check"
                      v-if="selectedFriends.some((e) => e.id === scope.row.id)"
                    ></i>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div id="selected-icons">
          <div
            v-for="selectedFriend in selectedFriends"
            :key="selectedFriend.id"
          >
            <div id="selected-icon">
              <el-avatar
                shape="square"
                size="medium"
                :src="selectedFriend.avatarUrl"
              ></el-avatar>
              <span class="name2">{{ selectedFriend.username }}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="handleInviteToGroup"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InviteFriendToGroupDialog",
  props: ["visible", "groupId", "groupMembers"],
  data() {
    return {
      dialogVisible: this.visible,
      search: "",
      selectedFriends: [],
    };
  },
  watch: {
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    visible(val) {
      this.dialogVisible = val;
    },
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
    handleRowClick(row) {
      if (this.selectedFriends.some((e) => e.id === row.id)) {
        this.selectedFriends = this.selectedFriends.filter(function(el) {
          return el.id !== row.id;
        });
      } else {
        this.selectedFriends.push(row);
      }
    },
    handleInviteToGroup() {
      let groupId = this.groupId;
      let failedFriends = [];
      [].forEach.call(this.selectedFriends, (selectedFriend) => {
        console.log(selectedFriend);
        this.$axios
          .post(
            "/api/request",
            {
              groupId: groupId,
              userId: selectedFriend.id,
            },
            {
              params: {
                access_token: this.$store.state.user.access_token,
              },
            }
          )
          .then(() => {})
          .catch(function(error) {
            console.log(error);
            failedFriends.push(selectedFriend.username);
          });
      });
      this.$message.success("成功邀请");
      if (failedFriends.length > 0)
        this.$message.info(failedFriends.join(", ") + " 未成功邀请");
      this.selectedFriends = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
#dialog {
  display: grid;
  width: 500px;
  height: 360px;
  grid-template-columns: 4fr 1fr 5fr;
  grid-template-rows: 1fr 1fr 10fr;
  grid-auto-flow: column;
  align-items: center;
  justify-content: space-between;
}
#user-button {
  display: flex;
  align-items: center;
}
#search-input {
  grid-column: 1;
  grid-row: 1;
}
#friend-list {
  grid-column: 1;
  grid-row: 3;
  align-self: start;
}
#user-info {
  display: flex;
  align-items: center;
}
#check-icon {
  margin-left: auto;
}
#name-input {
  grid-column: 3;
  grid-row: 1;
}
#selected-icons {
  align-self: start;
  grid-column: 3;
  grid-row: 3;
  overflow: auto;
  display: grid;
  height: 300px;
  grid-template-columns: 60px 60px 60px 60px;
  grid-template-rows: 60px 60px;
  grid-auto-rows: 60px;
  align-items: center;
}
#selected-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.name1 {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name2 {
  text-align: center;
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
