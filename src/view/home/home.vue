<template>
    <el-container class="home-page">
      <el-aside class="left-aside" width="180px">
        <img :src="logo" alt="" class="logo">
         <el-col :span="24">
            <el-menu
              class="el-menu-vertical-demo">
              <el-submenu index="1">
                <template slot="title">
                  <div class="menu">
                    <i class="icon icon01"></i>
                    <span slot="title">系统首页</span>
                  </div>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">资产管理</el-menu-item>
                  <el-menu-item index="1-2">资产管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="2">
                <div class="menu">
                  <i class="icon icon02"></i>
                  <span slot="title">资产管理</span>
                </div>
              </el-menu-item>
              <el-menu-item index="3">
                <div class="menu">
                  <i class="icon icon03"></i>
                  <span slot="title">资金管理</span>
                </div>
              </el-menu-item>
              <el-menu-item index="4">
                <div class="menu">
                  <i class="icon icon04"></i>
                  <span slot="title">资金统计</span>
                </div>
              </el-menu-item>
              <el-menu-item index="5">
                <div class="menu">
                  <i class="icon icon05"></i>
                  <span slot="title">系统管理</span>
                </div>
              </el-menu-item>
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
        <el-main class="main">
          <div class="title">
            <div class="icon"></div>
            <span class="text">首页&nbsp;&nbsp;-&nbsp;&nbsp;资产列表</span>
          </div>
          <div class="block">
              <img src="../../../static/bg.png" class="bg" alt="">
              <div class="content">
                <div class="text-group">
                  <h1>伊莱特客户评级系统</h1>
                  <p>版本号：1.0.1</p>
                </div>
                <ul>
                  <li>
                    <span class="tag">服务邮箱</span>
                    <p>zhangkai@xingyoucai.com<br>
                    fengfan@xingyuoucai.com</p>
                  </li>
                  <li>
                    <span class="tag">技术支持</span>
                    <p>张凯：18610416374<br>
                    冯帆：13269970265</p>
                  </li>
                  <li>
                    <span class="tag">政策及权限支持</span>
                    <p>王一凡：13821228425</p>
                  </li>
                </ul>
                <p>如果您在使用中遇到问题，请发送出现问题截图至服务邮箱，或联系支持人员。</p>
              </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      logo: '/static/logo-index.png',
      userImg: '/static/user.png',
    }
  },
  mounted() {
  },
}
</script>

<style scoped lang="stylus">
@import "./home.styl";
</style>
