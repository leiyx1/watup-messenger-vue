<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="新建群聊" width="500px">
      <el-container>
        <el-container>
          <el-aside width="200px">
            <el-table
                    :data="filteredFriends"
                    style="width: 100%"
                    @row-click="handleRowClick">
              <el-table-column>
                <template slot="header">
                  <el-input v-model="search" size="mini" prefix-icon="el-icon-search"></el-input>
                </template>
                <template slot-scope="scope">
                  <div id="user-button">
                    <div id="user-info">
                      <el-avatar shape="square" size="medium" :src="scope.row.avatarUrl"></el-avatar>
                      <span style="margin-left: 10px"> {{scope.row.username}} </span>
                    </div>
                    <div id="check-icon">
                      <i class="el-icon-circle-check" v-if="selectedFriends.some(e => e.id === scope.row.id)"></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-aside>
          <el-main>
            <div id="selected-icons">
            <div v-for="selectedFriend in selectedFriends" :key="selectedFriend.id">
              <div id="selected-icon">
                <el-avatar  shape="square" size="medium" :src="selectedFriend.avatarUrl"></el-avatar>
                <span class="title">{{selectedFriend.username}}</span>
              </div>
            </div>
            </div>
          </el-main>
        </el-container>
        <el-footer>
          <el-button style="margin-top: 20px" @click="handleAddGroup"> 确认 </el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "NewGroupDialog",
        props: ['visible'],
        data() {
            return {
                dialogVisible: this.visible,
                search: "",
                friends: this.$store.state.friends,
                selectedFriends: []
            }
        },
        watch: {
            dialogVisible(val) {
                this.$emit('update:visible', val)
            },
            visible(val) {
                this.dialogVisible = val
            }
        },
        computed: {
            filteredFriends() {
                return this.friends.filter(data => data.username.toLowerCase().includes(this.search.toLowerCase()))
            }
        },
        methods: {
            handleRowClick(row) {
                if (this.selectedFriends.some(e => e.id === row.id)) {
                    this.selectedFriends = this.selectedFriends.filter(function(el) { return el.id !== row.id; });
                } else {
                    this.selectedFriends.push(row)
                }
            },
            handleAddGroup() {
                this.$prompt('请输入群聊名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({groupName}) => {
                    this.$axios
                        .post('/api/group}', null, {
                            params: {
                                access_token: this.$store.state.token,
                                name: groupName
                            }
                        }).then(res => {
                            let groupId = res.data;
                            let failedFriends = [];
                            for (let selectedFriend in this.selectedFriends) {
                                this.$axios
                                    .post('/api/request', {
                                        groupId: groupId,
                                        userId: selectedFriend.id
                                    }, {
                                        params: {
                                            access_token: this.$store.state.token
                                        }
                                    })
                                    .then(() => {})
                                    .catch(function (error) {
                                        console.log(error);
                                        failedFriends.push(selectedFriend.username)
                                    })
                            }
                            this.$message.success("添加成功");
                            this.$message.info(failedFriends.join(", ") + " 未成功邀请");
                            this.selectedFriends = [];
                            this.dialogVisible = false
                        }).catch(function(error) {
                            console.log(error);
                            this.$message.error("添加失败")
                        })
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>
  #user-button {
    display: flex;
    align-items: center
  }
  #user-info {
    display: flex;
    align-items: center;
  }
  #check-icon {
    margin-left:auto
  }
  #selected-icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  #selected-icon {
    display: flex;
    width: 30.333333%;
    margin: 1.5%;
    flex-direction: column;
    align-items: center;
  }
</style>