<template>

  <div class="login_form">
    <el-image
      style="width: 100%; height: 100%"
      :src="logo"></el-image>
    <h2 class="login_title">阿拉丁系统</h2>
    <el-input v-model="userName" class="qxs-icon" placeholder="用户名" @input="userNameChange($event)"></el-input>
    <el-input v-model="password" class="qxs-icon" placeholder="密码" show-password @input="pwdChange($event)"></el-input>
    <el-button class="login_btn" :disabled="loginBtn" @click="login" type="primary" @keyup.enter.native="login()">
      {{loginBtntext}}
    </el-button>
    <span class="error_msg">{{errorMsg}}</span>
  </div>
</template>
<script>

export default {
  name: "login",
  data() {
    return {
      userName: "",
      password: "",
      errorMsg: "",
      loginBtn: false,
      loginBtntext: '登录',
      logo: ''
    }
  },
  methods: {
    login() {
      var that = this;
      that.loginBtn = true;
      that.loginBtntext = "登录中..."
      var loginDTO = {
        "phone": that.userName,
        "pwd": that.password,
      }
      that.axios.post('/ald/login', loginDTO).then(res=>{
        if (res.data.code=='ok'){
          that.loginBtn = false;
            that.loginBtntext = "登录";
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userName", res.data.name)
            localStorage.setItem("userPhone", that.userName)
            localStorage.setItem("userRole", res.data.role)
            localStorage.setItem("menuList", JSON.stringify(res.data.menuList))
            localStorage.setItem("btnList", JSON.stringify(res.data.btnList))
            that.$router.push('/admin')
        }else {
          that.loginBtn = false;
          that.loginBtntext = "登录";
          that.errorMsg = res.data.msg
        }
      }).catch(res=>{
        that.loginBtn = false;
        that.loginBtntext = "登录";
        that.errorMsg = "错误的用户名或密码！"
      })
    },

    userNameChange() {
      this.errorMsg = '';
    },
    pwdChange() {
      this.errorMsg = '';
    }
  },
  created() {
    var that = this;
    document.onkeydown = function (e) {
      if (window.event == undefined) {
        var key = e.keyCode;
      } else {
        var key = window.event.keyCode;
      }
      if (key == 13) {
        that.login()
      }
    }
  }
}
</script>

<style scoped>
.login_form {
  padding-top: 10%;
  padding-left: 40%;
  padding-right: 40%;
}

.login_btn {
  width: 100%;
  margin-top: 20px;
  font-size: 20px;
}

.qxs-icon {
  margin-top: 20px;
}

.login_title {
  text-align: center;
}

.error_msg {
  color: red;
  font-size: 14px;
}
</style>
