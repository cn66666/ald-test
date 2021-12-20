<template>
  <div class="login_form">
    <el-image
      style="width: 100%; height: 100%"
      :src="logo"></el-image>
    <h2 class="login_title">阿拉丁系统</h2>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      logo: ''
    }
  },
}
</script>

<style scoped>
.login_form {
  padding-top: 10%;
  padding-left: 40%;
  padding-right: 40%;
}

.login_title {
  text-align: center;
}


</style>
