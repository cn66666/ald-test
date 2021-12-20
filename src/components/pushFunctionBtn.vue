<template>
    <el-button type="primary" size="mini" @click="click()">{{ btnName }}</el-button>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: "pushFunctionBtn",
  data(){
    return {
      btnList: JSON.parse(localStorage.getItem('btnList'))
    }
  },
  props:{
    size: String,
    checkFunction: Function,
    btnName: String,
    checkRole: String,
    checkBtn: String,
    paramsKey: [String, Number, Object],
    paramsValue: [String, Number, Object],
    btnType: String,
    url: String,
  },
  mounted() {
  },
  methods: {
    click: function (){
      var that = this;
      var role = false;
      for (var i = 0; i < that.btnList.length; i++) {
        if (that.checkRole === that.btnList[i]['func'] && that.checkBtn === that.btnList[i]['btn']){
          role = true
          break
        }
      }
      if (role === true){
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
        }else if (that.btnType === 'reload') {
          // 请求后台后页面刷新
          var data = {}
          data[that.paramsKey] = that.paramsValue
          that.axios.post(that.url, data).then(res=>{
            if (res.data.code==='ok'){
              location.reload()
            }else {
              Message.warning(res.data.msg + ':' + res.data.data)
            }
          }).catch(res=>{
          })
        }

      }else {
        Message.warning('失败: 无该功能权限')
      }
    }

  }
}
</script>

<style scoped>

</style>
