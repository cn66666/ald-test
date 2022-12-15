<template>

  <div style="width: 100%;height: 100%;background: linear-gradient(135deg, #58D6FE 0%, #1D74DE 100%);">
    <el-row  style="width: 100%; height: 100%;" type="flex" justify="center" align="middle">
      <el-col :span="8"/>
      <el-col :span="12" >
        <div class="login_form" style="">
          <img src="/static/login.png" style="height: 350px; width: 600px; "/>
          <div style="width: 45%; position: relative; left: 300px; top: -320px;">
            <img src="/static/logo2x.png" style="width: 70px; height: 70px;">
            <h3 class="login_title">伊莱特客户信用评级系统
              <span v-if="version === 'test'" style="color: #ff0000; font-size: 10px">测试</span>
            </h3>
            <el-input v-model="userName" prefix-icon="el-icon-user" style="margin-top: 20px;" placeholder="输入用户名" @input="userNameChange($event)"></el-input>
            <el-input v-model="password" prefix-icon="el-icon-lock"  placeholder="输入密码" show-password @input="pwdChange($event)"></el-input>
            <el-button class="login_btn" size="small" :disabled="loginBtn" @click="login" type="primary" @keyup.enter.native="login()">
              {{loginBtntext}}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="6"/>
    </el-row>
  </div>
</template>
<script>
import { Message } from 'element-ui';

export default {
  name: "login",
  data() {
    return {
      userName: "",
      password: "",
      errorMsg: "",
      loginBtn: false,
      loginBtntext: '登录',
      logo: '/static/logo.png',
      version: 'online'
    }
  },
  mounted() {
    var that = this;
    var host = window.location.href;
    if (host.search('ssl-ald') !== -1){
      that.version = 'test'
    }
  },
  methods: {
    login() {
      var that = this;
      that.loginBtn = true;
      that.loginBtntext = "登录中..."
      var loginDTO = {
        "user": that.userName,
        "pwd": that.password,
      }
      that.axios.post('/ald/login', loginDTO).then(res=>{
        if (res.data.code=='ok'){
          that.loginBtn = false;
            that.loginBtntext = "登录";
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userName", res.data.name)
            localStorage.setItem("userPhone", res.data.phone)
            localStorage.setItem("userRole", res.data.role)
            localStorage.setItem("userCode", res.data.user_code)
            localStorage.setItem("menuList", JSON.stringify(res.data.menuList))
            localStorage.setItem("btnList", JSON.stringify(res.data.btnList))
            that.$router.push('/admin')
        }else {
          that.loginBtn = false;
          that.loginBtntext = "登录";
          Message.warning('登录失败:' + res.data.msg)
        }
      }).catch(res=>{
        that.loginBtn = false;
        that.loginBtntext = "登录";
        Message.warning('登录失败:请求错误')
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
  height: 350px;
  width: 600px;
  text-align: center;
}

>>>.el-input__inner {
  border:none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0px;
}

>>>.el-input__inner:focus {
  border-bottom: 1px solid #1D74DE;
}

.login_btn {
  width: 100%;
  margin-top: 20px;
  font-size: 20px;
}
</style>
