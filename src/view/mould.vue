<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="openeds" style="height: 100%" :router="true" :unique-opened="true" :default-active="onRoutes">
        <el-image
          style="width: 80%; height: 80px;margin: 0 10%"
          :src="logo"></el-image>
        <el-menu-item index="/admin">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu v-for="(menu, index) in menuList" :index="menu.id + ''" :key="index">
          <span slot="title"><i :class="menu.menuIcon"></i>{{ menu.name }}</span>
          <el-menu-item v-for="(submenu, index) in menu.submenu" :index="submenu.url" :key="index">
            {{ submenu.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 20px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 10px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="font-size: 15px"><i class="el-icon-s-custom"></i>{{userRole}}-{{ userName }}</span>
      </el-header>
      <el-main>
        <bread></bread>
        <router-view/>
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
      logo: '',
      userName: localStorage.getItem('userName'),
      userPhone: localStorage.getItem('userPhone'),
      userRole: localStorage.getItem('userRole'),
      menuList: JSON.parse(localStorage.getItem('menuList')),
      openeds: [],
    }
  },
  computed: {
    onRoutes() {
      let page = this.$route.path;
      localStorage.setItem("lastPage", page);
      return page;
    }
  },
  watch: {
    $route(to, from) {// 监听路由
      if (to.path != "/login" && to.path != '/main') {
        localStorage.setItem('lastPage', to.fullPath);
      }
    }
  },
  created() {
    var that = this;
    this.checkLogin()
  },
  methods: {
    logout: function () {
      var that = this;
      var logoutData = {
        "phone": that.userPhone,
        "name": that.userName,
      }
      that.axios.post('/ald/logout', logoutData).then(res=>{
        if (res.data.code=='ok'){
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

  }
}
</script>
<style>
>>>.el-menu-item{
  padding: 0 !important;
}
.a{
  text-decoration: none;
  color: black;
}
</style>
