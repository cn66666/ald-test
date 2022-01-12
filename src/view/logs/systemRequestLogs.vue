<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="req_phone"
        label="手机号"
      width="100%">
      </el-table-column>
      <el-table-column
        prop="req_path"
        label="请求地址"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="req_data"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="res_data"
        label="返回参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="2"
            :value="scope.row.res_data">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 23px;margin-right: 79px;">
      <el-pagination
        @current-change="handleCurrentChange" :current-page.sync="localPage"
        layout="prev, pager, next"
        :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "systemRequestLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
    }
  },
  mounted() {
    this.getSysLogs()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getSysLogs();
    },
    getSysLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/sys_logs', {'page': that.localPage,}).then(res=>{
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
