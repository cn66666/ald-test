<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="project_name"
        label="模块名称">
      </el-table-column>
      <el-table-column
        prop="title"
        label="邮件标题">
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
  name: "userList",
  data() {
    return {
      tableData: [],
      userPhone: localStorage.getItem('userPhone'),
      jobId: null,
      total: 1,
      localPage: 1,
    }
  },
  mounted() {
    this.getEmailLogList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getEmailLogList();
    },
    getEmailLogList: function (){
      var that = this;
      that.axios.post('/sed/email/email_log', {'page': that.localPage,}).then(res=>{
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
