<template>
  <div class="home">
    <img id="bg" src="../assets/pic1.jpg" />
    <!-- <div id="bg" /> -->
    <div id="op">
      <el-card
        v-if="index === true"
        style="margin-top:10%; margin-left:10%; width: 400px"
      >
        <div slot="header" class="clearfix">
          <span class="text">登录 Watup</span>
        </div>
        <el-form
          status-icon
          :hide-required-asterisk="true"
          label-width="80px"
          :model="loginInfo"
          ref="loginInfo"
          :rules="rule1"
          label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginInfo.password"
              @keyup.enter.native="submit1('loginInfo')"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div></div>
        <div class="btn">
          <el-checkbox v-model="autoLogin" style="padding-right: 10px"
            >30天内自动登录</el-checkbox
          >
          <el-button class="enter" type="primary" @click="submit1('loginInfo')"
            >登录</el-button
          >
          <el-button @click="index = !index">注册</el-button>
        </div>
      </el-card>
      <!-- `diff` -->
      <el-card v-else style="margin-top:6%; margin-left:10%; width: 400px">
        <div slot="header" class="clearfix">
          <span class="text">注册 Watup</span>
        </div>
        <el-form
          status-icon
          :hide-required-asterisk="true"
          label-width="100px"
          :model="registerInfo"
          ref="registerInfo"
          :rules="rule2"
          label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerInfo.password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input
              v-model="registerInfo.password2"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="watup号(id)" prop="id">
            <el-input v-model="registerInfo.id"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <div style="display: flex">
              <el-input v-model="registerInfo.code"></el-input>
              <el-button
                :disabled="inputed"
                @click="sendPin"
                type="primary"
                plain
                ><span v-if="inputed">{{ this.auth_time }}</span>
                <span v-else>获取验证码</span></el-button
              >
            </div>
          </el-form-item>
        </el-form>

        <div class="btn">
          <el-button
            type="primary"
            class="enter"
            @click="submit2('registerInfo')"
            >提交</el-button
          ><el-button @click="index = !index">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import getNedb from "../JavaScript/NedbConfig";
import getWebsocket from "../JavaScript/Websocket";
import { loadGroups, loadFriends } from "../JavaScript/load";
export default {
  name: "Home",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      autoLogin: false,
      index: true,
      inputed: false,
      auth_time: "",
      valid_time: "",
      code: "",
      loginInfo: {
        username: "",
        password: "",
      },
      registerInfo: {
        id: "",
        username: "",
        password: "",
        password2: "",
        email: "",
        code: "",
      },
      rule1: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
      },
      rule2: {
        id: [
          { required: true, message: "请设置你的watup号" },
          { min: 3, max: 12, message: "长度在3-12之间" },
        ],
        username: [
          { required: true, message: "请设置你的用户名" },
          { min: 3, max: 12, message: "长度在3-12之间" },
        ],
        password: [
          { required: true, message: "请设置你的密码" },
          { min: 6, max: 18, message: "长度在6-18之间" },
        ],
        password2: [{ validator: validatePass }],
        email: [
          { required: true, message: "请输入邮箱地址" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
          },
        ],
      },
    };
  },
  methods: {
    initLocalMessages() {
      //获取离线聊天 记录
      //获取离线私聊记录
      this.$axios
        .get(
          "/api/message?access_token=" +
            this.$store.state.user.access_token +
            "&sort=asc&drop=false"
        )
        .then((res) => {
          if (res.status === 200) {

            //逐个解析每个字段
            for(let p in res.data){
              //找到离线的messages
              let messages = res.data[p];
              //解析这个键值
              let p1 = p;
              p1 = p1.substring(1,p1.length - 1);//掐头去尾
              let keys = p1.split(", ")//分成两个
              //此时keys[0]为chatId，keys[1]为type
              let chatId = keys[0], type = keys[1];
              let query = {
                chatId: chatId,
                type: type,
              }

              //根据type，分别去friendList和groupList里面找到name和avatarUrl
              let name, avatarUrl
              if(type === "UNICAST"){
                let obj = this.$store.state.friends.find(
                  (obj) => obj.id === chatId
                )
                name = obj.nickname.length === 0 ? obj.username : obj.nickname;
                avatarUrl = obj.avatarUrl;
              }else {
                let obj = this.$store.state.groups.find(
                  (obj) => obj.id = chatId
                )
                name = obj.name;
                avatarUrl = "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2121061596,2871071478&fm=26&gp=0.jpg";
                //todo 放入真正的群头像
              }

              let self = this
              //先把Nedb更新一遍
              getNedb().localMessage.find(query,function (err, docs) {
                console.log("find " + chatId + " + " + type + " in nedb")
                console.log(docs)
                console.log(111111111)
                //现在找的是当前要更新的chat
                if(docs.length === 0){//若是本来没有
                  let newChat = {
                    chatId: chatId,
                    type: type,
                    name: name,
                    avatarUrl: avatarUrl,
                    sign: messages[messages.length - 1].content,
                    timestamp: messages[messages.length - 1].timestamp,
                    unReadCount: messages.length,
                    messageList: messages,
                  };
                  getNedb().localMessage.insert(newChat, function (err, docs) {
                    console.log(docs)
                    console.log(2222222)

                  });
                  self.updateVuexWithNedb();
                }else {//若是本来就有
                  let updateChat = docs[0];//虽然是复数形式 但是理应只有一个
                  updateChat.unReadCount += messages.length;
                  updateChat.messageList.push(messages);
                  updateChat.avatarUrl = avatarUrl;
                  updateChat.name = name;
                  updateChat.sign = messages[messages.length - 1].content;
                  getNedb().localMessage.update({query}, {$set: updateChat}, function (err, numupdated) {
                    console.log(numupdated + "条数据被更新")
                    console.log(2222222)
                  })
                  self.updateVuexWithNedb();
                }
              })
            }

          } else console.log("error occurred");
        });
    },
    updateVuexWithNedb(){
      let self = this
      getNedb().localMessage.find({}).sort({timestamp: 1}).exec(function (err, docs) {
        console.log(docs)
        self.$store.commit("setChatList", docs)
        console.log(33333333333)
      })
    },
    submit1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/oauth/login?id=" +
                this.loginInfo.username +
                "&password=" +
                this.loginInfo.password
            )
            .then((successResponse) => {
              if (successResponse.data.code === 200) {
                var data = successResponse.data.data;
                var userdata = {
                  id: data.id,
                  username: data.username,
                  email: data.email,
                  area: data.area,
                  sign: data.sign,
                  avatarUrl: data.avatarUrl,
                  access_token: data.access_token,
                };
                //用户信息存入Vuex
                this.$store.commit("setUser", userdata);
                // var tokendata = {
                //   access_token: data.access_token,
                //   token_type: data.token_type,
                //   bearer: data.bearer,
                //   refresh_token: data.refresh_token,
                //   expires_in: data.expires_in,
                //   scope: data.scope,
                // }
                // ***
                // NeDB setToken
                //存入Nedb
                let query = {id: data.id}
                getNedb().userInfo.find(query, function (err, docs) {
                  console.log(1111111111111111)
                  console.log(docs)
                  if(docs.length === 0){//没有登陆过
                    getNedb().userInfo.insert(userdata, function (err, newDocs) {
                      console.log("new user info inserted")
                      console.log(newDocs)
                    })
                  }else {
                    getNedb().userInfo.update(query, {$set:userdata}), {}, function (err, numReplaced) {
                      console.log(numReplaced)
                    }
                  }
                });
                //加载好友和群聊
                this.loadG();
                this.loadF();
                //更新系统信息
                getNedb().systemInfo.remove({}, { multi: true });
                let updateSystemInfo = {
                  lastUserId: data.id,
                  token: data.access_token,
                  autoLogin: this.autoLogin,
                };
                getNedb().systemInfo.insert(updateSystemInfo);
                //初始化本地聊天记录
                let self = this;
                setTimeout(function() {
                  self.initLocalMessages();
                }, 500);

                //建立websocket连接
                getWebsocket();
                this.$router.push("/index/chatpanel");
                this.$notify({
                  title: "成功",
                  message: "登录成功！",
                  type: "success",
                });
              } else if (successResponse.data.code === 400) {
                this.$notify.error({
                  title: "错误",
                  message: "密码输入错误",
                });
              } else {
                this.$notify.error({
                  title: "Error",
                  message: "unknown error found in login",
                });
              }
            })
            .catch((failResponse) => {
              console.log(failResponse);
            });
        } else {
          this.$notify.error({
            title: "Error",
            message: "非法登录",
          });
          return false;
        }
      });
    },
    submit2(formName) {
      console.log("submit2");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.registerInfo);
          this.$axios
            .post(
              "/oauth/register?id=" +
                this.registerInfo.id +
                "&username=" +
                this.registerInfo.username +
                "&password=" +
                this.registerInfo.password +
                "&email=" +
                this.registerInfo.email +
                "&code=" +
                this.registerInfo.code
            )
            .then((successResponse) => {
              // var responseResult = JSON.stringify(successResponse.data);
              if (successResponse.data.code === 200) {
                this.index = true;
                this.$notify({
                  title: "成功",
                  message: "注册成功！",
                  type: "success",
                });
              } else if (successResponse.data.code === 400) {
                this.$notify.error({
                  title: "错误",
                  message: successResponse.data.message,
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "unknown error found in register.",
                });
              }
            })
            .catch((failResponse) => {
              console.log(failResponse);
            });
        } else {
          this.$notify.error({
            title: "Error",
            message: "非法注册",
          });
          return false;
        }
      });
    },
    sendPin: function() {
      // ctrl c ctrl v
      this.$axios
        .post("oauth/sendCode?email=" + this.registerInfo.email)
        .then((response) => {
          if (this.registerInfo.email === "") {
            this.$notify.error({
              title: "错误",
              message: "请输入邮箱",
            });
          } else if (response.data.code === 400) {
            this.$notify.error({
              title: "错误",
              message: "邮箱已被注册",
            });
          } else if (response.data.code === 200) {
            // this.emailAddress = this.registerInfo.email;
            this.inputed = true;
            this.$notify({
              title: "成功",
              message: "验证码已发送",
              type: "success",
            });
            this.auth_time = 60;
            this.valid_time = 300;
            var auth_timetimer = setInterval(() => {
              this.auth_time--;
              this.valid_time--;
              if (this.auth_time <= 0) {
                this.inputed = false;
              }
              if (this.valid_time <= 0) {
                clearInterval(auth_timetimer);
              }
            }, 1000);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    loadF() {
      loadFriends();
    },
    loadG() {
      loadGroups();
    },
  },
  mounted() {
    //todo 免密码登录
  },
};
</script>

<style>
#bg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-image: url("../assets/pic1.jpg");
  background-repeat: repeat;
}
#op {
  /* filter: alpha(opacity=92.5);
  -moz-opacity: 0.925; */
  opacity: 0.925;
}

.clearfix {
  text-align: left;
  font-size: 20px;
}

.btn {
  float: right;
  margin-top: 5px;
  margin-bottom: 10px;
}
.enter span {
  padding-left: 10px;
  padding-right: 2px;
  transition: 0.5s;
}
.enter span:after {
  content: " »";
  opacity: 0;
  transition: 0.5s;
}
.enter:hover span {
  padding-left: 6px;
  padding-right: 6px;
}
.enter:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
