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
          <span class="text">欢迎前端世界</span>
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
            <el-input v-model="loginInfo.password" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="enter" type="primary" @click="submit1('loginInfo')"
            >登录</el-button
          ><el-button @click="index = !index">注册</el-button>
        </div>
      </el-card>
      <!-- `diff` -->
      <el-card v-else style="margin-top:10%; margin-left:10%; width: 400px">
        <div slot="header" class="clearfix">
          <span class="text">注册前端世界</span>
        </div>
        <el-form
          status-icon
          :hide-required-asterisk="true"
          label-width="80px"
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
          <el-button type="primary" class="enter" @click="submit2(registerInfo)"
            >提交</el-button
          ><el-button @click="index = !index">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
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
      index: true,
      inputed: false,
      loginInfo: {
        username: "",
        password: "",
      },
      registerInfo: {
        username: "",
        password: "",
        password2: "",
        email: "",
        code: "",
      },
      rule1: {
        username: [{ message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
      },
      rule2: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 3, max: 12, message: "长度在3-12之间" },
        ],
        password: [
          { required: true, message: "请输入密码" },
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
    submit() {
      this.$router.push("/index");
    },
    submit1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .get("usercenter/login", {
              params: {
                username: this.loginInfo.username,
                password: this.loginInfo.password,
              },
            })
            .then((successResponse) => {
              // var responseResult = JSON.stringify(successResponse.data);
              if (successResponse.data.code === 200) {
                this.$axios
                  .get(`usercenter/getUser`, {
                    params: {
                      username: this.loginInfoVo.username,
                    },
                  })
                  .then((response) => {
                    this.$store.commit("setUser", response.data);
                    this.$router.push("index");
                  });
                this.$notify({
                  title: "成功",
                  message: "登录成功！",
                  type: "success",
                });
              } else if (successResponse.data.code === 300) {
                this.$notify.error({
                  title: "错误",
                  message: "该用户不存在",
                });
              } else if (successResponse.data.code === 402) {
                this.$notify.error({
                  title: "错误",
                  message: "密码输入错误",
                });
              }
            })
            .catch((failResponse) => {
              console.log(failResponse);
            });
        } else {
          console.log("error submit!!");
          this.$notify({
            title: "Error",
            message: "非法登录",
            type: "error",
          });
          return false;
        }
      });
    },
    signin: function() {
      this.$notify({
        title: "Success",
        message: "登录成功",
        type: "success",
      });
      console.log(document.cookie);
      this.$router.push("/index");
    },
    signup: function() {
      this.index = 2;
    },
    sendPin: function() {
      alert("发送成功");
    },
  },
  mounted() {},
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
