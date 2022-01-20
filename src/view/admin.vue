<template>
  <div style="width: 100%; height: 100%">
    <div style="height: 80%">
      <div style="text-align:center;line-height:420px;border:1px;solid=#ddd;font-size:50px;color:#260D3E;font-weight:bold">伊莱特经销商信用评级系统</div>
    </div>
    <div style="height: 20%; font-weight:bold; color: #666666">
      <div style="width: 20%; float: left; padding: 0 0 0 20px">
        <p>服务邮箱</p >
        <p>zhangkai@xingyoucai.com</p>
        <p>fengfan@xingyoucai.com</p>
      </div>
      <div style="width: 25%; float: left; padding: 0 0 0 20px">
        <p>技术支持</p >
        <p>张凯：18610416374</p>
        <p>冯帆：13269970265</p>
      </div>
      <div style="width: 25%; float: left; padding: 0 0 0 20px">
        <p>政策及权限支持</p >
        <p>王亦凡：13821228425</p>
      </div>
      <div style="width: 25%; float: right; padding: 0 0 0 10px">
        <p style="padding-top: 10%">如您在使用中遇到问题，请发送出现问题截图至服务邮箱，或联系支持人员。</p>
      </div>
    </div>
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
