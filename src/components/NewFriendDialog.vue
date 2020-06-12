<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="添加好友">
      <el-input placeholder="watup code" prefix-icon="el-icon-search" v-model="userId" @change="searchUser"></el-input>
      <el-card v-for="user in users" :key="user.id" @click.native="handleAddFriend(user.id)">
        <span><img :src="user.avatarUrl" alt="头像"></span>
        <span>{{user.username}}</span>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "NewFriendDialog",
        props: ['visible'],
        data() {
            return {
                dialogVisible: this.visible,
                userId: "",
                users: []
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
        methods: {
            searchUser() {
                this.$axios
                    .get('/api/friend/user', {
                        params: {
                            access_token: this.$store.state.token,
                            keyword: this.userId
                        }
                    })
                    .then(res => {
                        this.users = [res.data]
                    }).catch(function(error) {
                        console.log(error)
                    })
            },
            handleAddFriend(userId) {
                if (this.$store.state.friendsID.includes(userId)) {
                    this.$message.error('该用户已经是你的好友')
                } else {
                    this.$prompt('请输入验证信息', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({message}) => {
                        this.$axios
                            .post('/api/friend/request', {
                                params: {
                                    access_token: this.$store.state.token,
                                    friendId: userId,
                                    remark: message
                                }
                            }).then(() => {
                                this.$message.success("好友申请发送成功")
                            }).catch(function(error) {
                                console.log(error);
                                this.$message.error("好友申请发送失败")
                            });
                        this.dialogVisible = false;
                    }).catch(() => {});
                }
            }
        }
    }
</script>

<style scoped>

</style>