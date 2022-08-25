<template>
  <div>
    <el-page-header @back="goBack" content="用户操作日志" style="margin: 1%">
    </el-page-header>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="user_name"
        label="操作人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="func_name"
        label="操作功能"
        width="200">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="操作时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="content"
        label="变更内容">
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "dealerOperLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      info: {'dealer_id': null},
      showInfo: false,
    }
  },
  mounted() {
    var that = this;
    that.info.dealer_id = this.$route.query.dealerId;
    this.getDealerOperLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerOperLogs();
    },
    getDealerOperLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/oper_logs', {'page': that.localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
