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
        <div>
          <el-checkbox v-model="autoLogin">30天内自动登录</el-checkbox>
        </div>
        <div class="btn">
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
import db from "../JavaScript/NedbConfig";
import getWebsocket from "../JavaScript/Websocket";

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
    submit: function() {
      //登陆时 与客户端建立websocket连接
      //todo 理应存userID
      this.initUserInfo();
      this.initLocalMessages();
      console.log(this);
      this.$store.commit("setUsername", this.loginInfo.username);
      getWebsocket(); //建立websocket连接

      this.$router.push("/index/chatpanel");
    },
    initLocalMessages() {
      //todo 离线聊天记录
    },
    initUserInfo() {
      //todo 使用ajax从后台获取token，friendList，userId,blackList等
      //在Vuex中存入信息
      this.initUserInfoInVuex();
      //在Nedb中存入信息
      this.initUserInfoInNedb();
    },
    initUserInfoInVuex() {
      this.$store.commit("setToken", 123); //todo 保存真正的token
      this.$store.commit("setUsername", this.loginInfo.username);
      this.$store.commit("setId", 1); //todo 保存真正的UserId
    },
    initUserInfoInNedb() {
      let name = this.loginInfo.username;
      db.userInfo.find({ username: name }, function(err, docs) {
        //todo 这里理应用userId在本地数据库中进行查询
        if (err !== null) {
          console.log(`err occurred:`);
          console.log(err);
        } else {
          if (docs.length === 0) {
            //之前从未在本机登陆过
            let newUserInfo = {
              username: name,
              token: undefined, //todo 需存入token 用于持久免密登录
              userId: undefined, //todo 需存入userId
              friendList: [
                {
                  ID: "1",
                  name: "老板",
                  nickname: "",
                  avatar:
                    "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                },
                {
                  ID: "2",
                  name: "钢铁侠",
                  nickname: "老大",
                  avatar:
                    "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                },
                {
                  ID: "3",
                  name: "Happy",
                  nickname: "绿巨人",
                  avatar:
                    "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                },
              ], //todo 需存入真正的friendList
              //todo 这里可能还要放一些其他的东西
            };
            db.userInfo.insert(newUserInfo, function(err, newDocs) {
              // newDoc is the newly inserted document, including its _id
              //_id是由Nedb定义的一个量
              if (err !== null) {
                console.log(`err occured:`);
                console.log(err);
              } else {
                console.log("初始化完成");
                console.log(newDocs);
              }
            });
          } else {
            //之前登陆过,则在本地数据库中存有数据，则仅刷新一些变动属性
            db.userInfo.update(
              { username: name },
              {
                //todo 这里理应使用userId进行查询 同line151
                $set: {
                  username: name, //刷新本地数据库中的username，
                  // 考虑到用户可能会在其他客户端更改username
                  token: undefined, //todo 需存入token
                  //friendList: undefined, //todo 需存入friendList
                  //todo 这里可能还需要放一些其他的东西
                },
              },
              {},
              function(err, numReplaced) {
                if (err !== null) {
                  console.log(`err occured:`);
                  console.log(err);
                } else if (numReplaced === 1) {
                  //仅有一个文档被更改
                  console.log("初始化完成");
                } else console.log("unexpected error"); //should not fall in here
              }
            );
          }
        }
      });
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
                this.$store.commit("setUser", userdata);
                console.log(this.$store.state.user);
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
                db.userInfo.find(query, function (err, docs) {
                  if(docs.length === 0){//没有登陆过
                    db.userInfo.insert(userdata)
                  }else {
                    db.update(query, {$set:userdata}), {}, function (err, numReplaced) {
                      console.log(numReplaced)
                    }
                  }
                })
                //更新系统信息
                db.systemInfo.remove({}, {multi: true})
                let updateSystemInfo = {
                  lastUserId: data.id,
                  token: data.access_token,
                  autoLogin: this.autoLogin,
                }
                db.systemInfo.insert(updateSystemInfo);

                //存入vuex
                this.$store.commit("setUser", userdata);

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
