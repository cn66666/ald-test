<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
      >
      </el-table-column>
      <el-table-column
        prop="job_id"
        label="任务id">
      </el-table-column>
      <el-table-column
        prop="job_log"
        label="任务日志">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.job_log">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
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
  name: "userList",
  data() {
    return {
      tableData: [],
      jobId: null,
      total: 0,
      localPage: 1,
    }
  },
  created() {
    this.jobId = this.$route.query.jobId;
  },
  mounted() {
    this.getJobList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getJobList();
    },
    getJobList: function (){
      var that = this;
      that.axios.post('/ald/timer/job_log', {'jobId': that.jobId,'localPage': that.localPage,}).then(res=>{
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
