<template>
  <div data-v-13d5e90e="" style="text-align:center;line-height:420px;border:1px;solid: #ddd;font-size:30px;color:#260D3E;">
    伊莱特经销商信用评级系统
    <p>如您在使用中遇到问题，请发送出现问题截图至服务邮箱，或联系支持人员。</p>

    <p>服务邮箱：zhangkai@xingyoucai.com/fengfan@xingyoucai.com</p>

    <p>技术支持：张凯（微信号zk364722234） 冯帆（微信号294803277@qq.com 手机号13269970265）</p>

    <p>政策及权限支持：王亦凡（微信号if_ivan 手机号13821228425）</p>
  </div>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      datas: {
        job:{
          all:0,
          run:0,
          done:0,
          delete:0
        },
        exchange:{
          all:0,
          used:0,
          active:0,
          change:0
        }
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>

.calendar-item{
  font-size: 12px;
  color: #FFF;
  padding: 0 12px;
  border-radius: 4px;
  margin-top: 4px;
}

>>>.el-tabs--card>.el-tabs__header .el-tabs__item  {
  width: 100px;
}

>>>.v-charts-data-empty{
  position: absolute;
  top: 176px;
  left: 300px;
}
>>>.el-row {
  height: auto;
}
>>>.is-selected {
  background-color: #E6ECF0;
}
>>>.v-ring {
  height: 150px !important;
}
>>>.el-tabs__item {
  height: 24px;
  line-height: 24px;
}
>>>.el-calendar {
  border-radius: 8px;
  box-shadow: 0px 8px 10px 0px rgba(234, 243, 252, 0.8);
}
</style>
