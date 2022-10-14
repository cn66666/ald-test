<template>
  <div style="background-color: white; width: 98%; height: 96%; margin: 1%">
    <div>
      <el-header>
        <div>
          <p style="line-height: 50px; font-size: 30px">{{title}}</p>
        </div>
        <div>
          
        </div>
      </el-header>
    </div>

  </div>
</template>

<script>
export default {
  name: "report",
  data() {
    return {
      report: {},
      title: '日报'
    }
  },
  mounted() {
    var that = this;
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
