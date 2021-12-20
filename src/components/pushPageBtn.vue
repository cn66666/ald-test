<template>
  <div>
    <el-button type="primary" size="mini" @click="click()">{{ btnName }}</el-button>
  </div>
</template>

<script>
export default {
  name: "pushPageBtn",
  data(){
    return {
      role: localStorage.getItem("userRole")
    }
  },
  props:{
    routerUrl: String,
    btnName: String,
    checkRole: String,
  },
  mounted() {
  },
  methods: {
    click: function (){
      var that = this
      if (that.role){
        if (that.checkRole === 'L1'){
          if (that.role === '普通用户'){
            this.$message({
              message: '失败: 无当前权限',
              type: 'warning'
            });
            return
          } else {
            that.$router.push(that.routerUrl)
          }
        }
        if (that.checkRole === 'L2'){
          if (that.role === '普通用户' || that.role === 'L1审批员'){
            this.$message({
              message: '失败: 无当前权限',
              type: 'warning'
            });
            return
          } else {
            that.$router.push(that.routerUrl)
          }
        }
        if (that.checkRole === 'L3'){
          if (that.role === '普通用户' || that.role === 'L1审批员' || that.role === 'L2审批员'){
            this.$message({
              message: '失败: 无当前权限',
              type: 'warning'
            });
            return
          } else {
            that.$router.push(that.routerUrl)
          }
        }
        if (that.checkRole === 'admin'){
          if (that.role === '管理员'){
            that.$router.push(that.routerUrl)
          }else {
            this.$message({
              message: '失败: 无当前权限',
              type: 'warning'
            });
            return
          }
        }
      }else {
        this.$message({
          message: '失败: 请重新登录,刷新权限',
          type: 'warning'
        });
      }
    }

  }
}
</script>

<style scoped>

</style>
