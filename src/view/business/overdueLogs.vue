<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="margin: 1%">
    </el-page-header>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="invoice_code"
        label="开票号码">
      </el-table-column>
      <el-table-column
        prop="change_money"
        label="发生金额">
      </el-table-column>
      <el-table-column
        prop="change_info"
        label="变更信息">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="发生时间">
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
  name: "overdueLogs",
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
    this.getOverdueLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getScoreLogs();
    },
    getOverdueLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/overdue_logs', {'page': that.localPage, 'info': that.info}).then(res=>{
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
