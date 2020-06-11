<template>
    <div class="card">
        <div class="level-1">
            <div class="level-1-word">
                <span>{{ user.username }}</span>
                <!-- <el-button class="btn" type="text">修改备注</el-button> -->
            </div>
            <img :src="user.avatarUrl"/>
        </div>
        <el-divider class="divider1"/>
        <div class="level-2">
            <ul>
                <li>用户名：{{user.id}}</li>
                <li>签 &nbsp;名: Coolo(*￣▽￣*)ブ</li>
                <li>来 &nbsp;源: 通过搜索ID添加</li>
            </ul>
        </div>
        <el-divider class="divider1"/>
        <div class="level-3">
            <el-col :span="12">
                <el-button @click="dialogVisible = true"><span>修改备注</span></el-button>
            </el-col>
            <el-col :span="12">
                <el-button @click="goChat"><span>发起聊天</span></el-button>
            </el-col>
        </div>
        <div>
            <el-dialog
                    :visible.sync="dialogVisible"
                    :modal="false"
                    width="20%"
            >
                <el-input
                        placeholder="请输入备注"
                        v-model="input"
                        clearable>
                </el-input>
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyRemark"
            >确 定</el-button
            >
          </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserCard",
        props: ["user"],
        data() {
            return {
                dialogVisible: false,
                input: "",
                id: "CastJo",
            };
        },
        methods: {
            goChat() {
                this.$router.push("/index/chatpanel");
            },
            modifyRemark() {
                console.log(this.id)
                console.log(this.user.id)
                console.log(this.input)
                this.$axios
                    .put("friend/nickname", {
                        id: this.id,
                        friendID: this.user.id,
                        nickname: this.input,
                    })
                    .then((successResponse) => {
                        console.log(successResponse.data);
                        if (successResponse.status === 200) {
                            this.$notify({
                                title: "成功",
                                message: "修改成功！",
                                type: "success",
                            });
                        } else {
                            this.$notify.error({
                                title: "错误",
                                message: "错误",
                            });
                        }
                    })
                    .catch((failResponse) => {
                        console.log(failResponse);
                    });
            }
        },
    };
</script>

<style lang="scss">
    .divider1 {
        margin: 0;
        width: 77%;
        margin: auto;
    }

    .card {
        height: 100%;

        .level-1 {
            display: flex;
            flex-direction: row;
            height: 23%;
            padding-top: 10%;

            .level-1-word {
                // width: 30%;
                display: flex;
                flex-direction: column;
                padding-left: 20%;
                padding-right: 10%;

                span {
                    font-size: 40px;
                }
            }

            img {
                // padding-right: 10%;
                position: absolute;
                right: 10%;
                float: right;
                width: 100px;
                height: 100px;
            }
        }

        .level-2 {
            height: 23%;

            ul {
                padding-left: 0;
                list-style: none;

                li {
                    padding-left: 20%;
                    padding-top: 2%;
                    text-align: left;
                }
            }
        }

        .level-3 {
            .el-button {
                margin-top: 10%;
            }
        }
    }
</style>
