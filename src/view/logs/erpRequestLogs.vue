<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="api_url"
        label="请求地址">
      </el-table-column>
      <el-table-column
        prop="api_parames"
        label="请求参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="3"
            :value="scope.row.api_parames">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="请求状态"
        width="70%">
      </el-table-column>
      <el-table-column
        prop="api_result"
        label="请求结果">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="3"
            :value="scope.row.api_result">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
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
  name: "erpRequestLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
    }
  },
  mounted() {
    this.getErpReuquestLogs()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getErpReuquestLogs();
    },
    getErpReuquestLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/erp_logs', {'page': that.localPage,}).then(res=>{
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
