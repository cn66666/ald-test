<template>
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
    var that = this;
    that.axios.post('/ald/check', {}).then(res => {
    }).catch(res => {
    })
  },
}
</script>

<style scoped lang="stylus">
@import "./admin.styl";
</style>
