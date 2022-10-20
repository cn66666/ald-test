<template>
    <el-container class="home-page">
      <el-aside class="left-aside" width="200px">
        <img :src="logo" alt="" class="logo">
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
          <span class="name">信用评级系统</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-avatar :src="userImg"></el-avatar>
              <span class="text">欢迎您<br>超级管理员</span>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <div class="main">
            <bread></bread>
            <router-view/>
            <el-footer style="height: 5%"><div data-v-29a933e9="" style="height: 30px; line-height: 30px; text-align: center;"><span data-v-29a933e9="" style="font-size: 12px;"> Copyright <span data-v-29a933e9="">2022</span>北京微星优财网络科技有限公司 &nbsp;&nbsp;&nbsp; 京ICP备15011399号</span></div></el-footer>
          </div>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import bread from '@/view/Breadcrumb'

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
      menuList: JSON.parse(localStorage.getItem('menuList')),
      openeds: [],
      version: '',
      logo: '/static/logo-index.png',
      userImg: '/static/user.png',
    }
  },
  mounted() {
    var that = this;
    var host = window.location.href;
    if (host.search('ssl-ald') !== -1){
      that.version = 'test'
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
        that.$router.push('/login')
      }
    },
    toPage:function (url){
      var that = this;
      that.$router.push(url)

    }
  }
}
</script>

<style scoped lang="stylus">
@import "./mould.styl";
</style>
