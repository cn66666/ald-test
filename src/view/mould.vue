<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="200px">
      <el-menu :default-openeds="openeds" style="height: 100%" :router="true" :unique-opened="true" :default-active="onRoutes">
        <p style="height: 40px; font-size: 15px; text-align:center; padding: 10px">伊莱特信用评级系统</p>
<!--        <p v-if="version==='test'" style="text-align:center;">测试环境</p>-->
        <el-menu-item index="/admin">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu v-for="(menu, index) in menuList" :index="menu.id + ''" :key="index">
          <span slot="title"><i :class="menu.menuIcon"></i>{{ menu.name }}</span>
          <el-menu-item v-for="(submenu, s_index) in menu.submenu" :index="submenu.url" :key="s_index">
            {{ submenu.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 20px; background-color: white; height: 5%">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 10px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="font-size: 14px"><i class="el-icon-s-custom"></i>{{userRole}}-{{ userName }}</span>
      </el-header>
      <el-main>
        <bread></bread>
        <div class="info" style="height: 95%; background-color: white; overflow: auto; border-radius: 5px">
          <router-view/>
        </div>
      </el-main>
<!--      <el-footer style="height: 5%"><div data-v-29a933e9="" style="height: 30px; line-height: 30px; text-align: center;"><span data-v-29a933e9="" style="font-size: 12px;"> Copyright <span data-v-29a933e9="">2022</span>北京微星优财网络科技有限公司 &nbsp;&nbsp;&nbsp; 京ICP备15011399号</span></div></el-footer>-->
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
      version: ''
    }
  },
  mounted() {
    var that = this;
    var host = window.location.href;
    if (host.indexOf('ssl-ald') !== -1){
      that.version = 'test'
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
<style scoped>
>>>.info, .remark{
  font-weight: normal;
}
>>>.el-main{
  padding: 20px 20px 10px 20px;
}

.btn_row button{
  margin: 25px;
}
</style>
