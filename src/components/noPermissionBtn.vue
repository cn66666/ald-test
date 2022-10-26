<template>
  <el-button type="primary" :size="size" @click="click()" :loading="loading">{{ btnName }}</el-button>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: "noPermissionBtn",
  data(){
    return {
      loading: false
    }
  },
  props:{
    size: String,
    checkFunction: Function,
    paramsKey: [String, Number, Object],
    paramsValue: [String, Number, Object],
    btnName: String,
    btnType: String,
    url: String,
  },
  mounted() {
  },
  methods: {
    click: function (){
      var that = this;
       //  进行按钮行为判断
      if (that.btnType === 'function'){
        // 存在特殊操作
        if (that.paramsKey !== undefined){
          // 存在参数
          that.checkFunction(that.paramsValue)
        }else {
          that.checkFunction()
        }
      }else if (that.btnType === 'replace'){
        // 页面跳转
        if (that.paramsKey !== undefined){
          // 存在参数
          that.$router.push(that.url + '?' + that.paramsKey + '=' + that.paramsValue)
        }else {
          that.$router.push(that.url)
        }
      }else if (that.btnType === 'replace_new'){
        // 页面跳转
        if (that.paramsKey !== undefined){
          // 存在参数
          let route = this.$router.resolve({path: that.url + '?' + that.paramsKey + '=' + that.paramsValue});
          window.open(route.href, '_blank');
        }else {
          window.open(route.href, '_blank');
        }
      }else if (that.btnType === 'reload') {
        // 请求后台后页面刷新
        that.loading = true
        var data = {}
        data[that.paramsKey] = that.paramsValue
        that.axios.post(that.url, data).then(res=>{
          if (res.data.code==='ok'){
            location.reload()
          }else {
            that.loading = false
            Message.warning(res.data.msg + ':' + res.data.data)
          }
        }).catch(res=>{
          that.loading = false
          Message.warning('错误: 请联系管理员')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
