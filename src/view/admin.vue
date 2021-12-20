<template>
  <div>
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
