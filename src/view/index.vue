<template>
  <div class="login_form">
    <h2 class="login_title">伊莱特客户信用评级系统</h2>
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
  mounted() {
    this.$router.push('/admin')
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
