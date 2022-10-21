<template>
    <el-container class="home-page">
      <el-aside class="left-aside" width="200px">
        <img :src="logo" alt="" class="logo" @click="toIndex()">
         <el-col :span="24">
            <el-menu class="el-menu-vertical-demo">
              <el-submenu v-for="(menu, index) in menuList" :index="menu.id + ''" :key="index">
                <template slot="title">
                  <div class="menu">
                    <i :class="menu.menuIcon"></i>
                    <span slot="title">{{ menu.name }}</span>
                  </div>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(submenu, s_index) in menu.submenu" :index="submenu.url" :key="s_index" @click="toPage(submenu.url)">
                    {{ submenu.name }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
         </el-col>
      </el-aside>
      <el-container class="container">
        <el-header class="header">
          <span class="name">信用评级系统{{version}}</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-avatar :src="userImg"></el-avatar>
              <span class="text">{{userRole}}<br>{{ userName }}</span>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="showChangePwd=true">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <div class="main">
            <bread></bread>
            <div class="page"><router-view/></div>
            <el-footer style="height: 5%"><div data-v-29a933e9="" style="height: 30px; line-height: 30px; text-align: center;"><span data-v-29a933e9="" style="font-size: 12px;"> Copyright <span data-v-29a933e9="">2022</span>北京微星优财网络科技有限公司 &nbsp;&nbsp;&nbsp; 京ICP备15011399号</span></div></el-footer>
          </div>
        </el-main>
        <el-dialog title="修改密码" :visible.sync="showChangePwd">
          <el-form>
            <el-form-item label="工号" :label-width="showChangeWidth">
              <el-input v-model="userCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="showChangeWidth">
              <el-input v-model="userPhone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="原密码" :label-width="showChangeWidth">
              <el-input v-model="changePwdForm.oldPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" :label-width="showChangeWidth">
              <el-input v-model="changePwdForm.newPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" :label-width="showChangeWidth">
              <el-input v-model="changePwdForm.againNewPwd" show-password></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="showChangePwd=false">关闭</el-button>
            <el-button type="primary" size="mini" @click="changeUserPwd()">确认修改</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
</template>

<script>
import bread from '@/view/Breadcrumb'
import {Message} from "element-ui";

export default {
  name: "index",
  components: {
    bread
  },
  data() {
    return {
      userName: localStorage.getItem('userName'),
      userPhone: localStorage.getItem('userPhone'),
      userRole: localStorage.getItem('userRole'),
      userCode: localStorage.getItem('userCode'),
      menuList: JSON.parse(localStorage.getItem('menuList')),
      openeds: [],
      version: '',
      logo: '/static/logo-index.png',
      userImg: '/static/user.png',
      showChangePwd: false,
      showChangeWidth: '100px',
      changePwdForm: {
        oldPwd: '',
        newPwd: '',
        againNewPwd: '',
      }
    }
  },
  mounted() {
    var that = this;
    var host = window.location.href;
    if (host.search('ssl-ald') !== -1){
      that.version = '测试环境'
    }

  },
  watch: {
    $route(to, from) {// 监听路由
      if (to.path !== "/login" && to.path !== '/main') {
        localStorage.setItem('lastPage', to.fullPath);
      }
    }
  },
  created() {
    var that = this;
    that.checkLogin()
  },
  methods: {
    logout: function () {
      var that = this;
      var logoutData = {
        "phone": that.userPhone,
        "name": that.userName,
      }
      that.axios.post('/ald/logout', logoutData).then(res=>{
        if (res.data.code==='ok'){
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userPhone');
          that.$router.push('/login')
        }else {

        }
      }).catch(res=>{
      })
      return {}
    },
    checkLogin: function (){
      var that = this;
      var userName = localStorage.getItem('userName');
      var userPhone = localStorage.getItem('userPhone');
      var token = localStorage.getItem('token');
      if (userName == null || userPhone == null || token == null){
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userCode');
        localStorage.removeItem('menuList');
        localStorage.removeItem('btnList');
        that.$router.push('/login')
      }
    },
    toPage:function (url){
      var that = this;
      that.$router.push(url)

    },
    changeUserPwd: function () {
      var that = this;
      if (that.changePwdForm.newPwd !== that.changePwdForm.againNewPwd){
        Message.warning('失败: 两次新密码不一致,请重新填写')
        return
      }
      if (that.changePwdForm.newPwd === that.changePwdForm.oldPwd){
        Message.warning('失败: 新旧密码重复,请重新填写')
        return
      }
      that.axios.post('/ald/user/change_pwd', {'userName': that.userName, 'userPhone': that.userPhone,
        'data': that.changePwdForm}).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 修改成功,请重新登录')
          setTimeout(()=>{
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userCode');
            localStorage.removeItem('menuList');
            localStorage.removeItem('btnList');
            that.$router.push('/login')
          }, 3000)
        } else {
          Message.warning('失败: ' + res.data.data)
          return
        }
      }).catch(res=>{
      })
    },
    toIndex: function (){
      var that = this;
      that.$router.push('/admin')

    }
  }
}
</script>

<style scoped lang="stylus">
@import "./mould.styl";
</style>
