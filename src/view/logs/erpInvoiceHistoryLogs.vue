<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}" v-loading="loading">
      <el-table-column
        prop="request_date"
        label="请求日期">
      </el-table-column>
      <el-table-column
        prop="start_date"
        label="起始日期">
      </el-table-column>
      <el-table-column
        prop="end_date"
        label="结束日期">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showData(scope.row.id)">查询详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="查看请求数据" :visible.sync="showInfo" :lock-scroll="false">
      <el-form>
        <el-form-item label="评分数据">
          <p>{{ info }}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "erpInvoiceHistoryLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      showInfo: false,
      info: '',
      loading: false
    }
  },
  mounted() {
    this.getInvoiceHistoryLogs()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getInvoiceHistoryLogs();
    },
    getInvoiceHistoryLogs: function (){
      var that = this;
      that.loading = true;
      that.axios.post('/ald/logs/invoice_history', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      }).finally(function (){
        that.loading = false;
      })
    },
    showData: function (row_id){
      var that = this;
      that.axios.post('/ald/logs/invoice_data', {'rowId': row_id,}).then(res=>{
        if (res.data.code=='ok'){
          that.info = res.data.data;
          that.showInfo = true
        }
      }).catch(res=>{
      })
    }
  }
}
</script>

<style scoped>

</style>
