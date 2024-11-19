<template>
  <div class="chart">
    <div :id="id" :option="option"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  // 验证类型
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  mounted() {
    Object.defineProperty(document.getElementById(this.id), 'clientWidth', {get:function (){return 1000;}})
    Object.defineProperty(document.getElementById(this.id), 'clientHeight', {get:function (){return 600;}})
    var mychart = echarts.init(document.getElementById(this.id))
    mychart.setOption(this.option)
  }
}
</script>
