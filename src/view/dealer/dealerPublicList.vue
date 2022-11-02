<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getPublicInfo()">查询</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="publicList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="查询时间">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'query'">查询中</span>
          <span v-else-if="scope.row.state_code === 'error'">查询失败</span>
          <span v-else-if="scope.row.state_code === 'ok'">成功</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state_code === 'ok'" type="primary" size="mini" @click="toPublicReport(scope.row.id)">查看</el-button>
          <el-button v-if="scope.row.state_code === 'error'" type="primary" size="mini" @click="open()">查看失败原因</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "dealerPublicList",
  data() {
    return {
      publicList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
      queryType: {
      },
    }
  },
  mounted() {
    var that = this;
    that.getPublicList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getPublicList();
    },
    getPublicList: function (){
      var that = this;
      that.axios.post('/ald/dealer/public_list', {'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.publicList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    getPublicInfo: function (){
      var that = this;
      that.axios.post('/ald/dealer/public_info', {'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          location.reload()
        } else {
          that.$message({
            message: '失败: ' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    toPublicReport: function (reportId){
      var that = this;
      that.$router.push('/admin/dealer/dealerPublicReport?id=' + reportId)
    },
    open() {
      var that = this;
      var message = '客户不存在';
      var title = '公开信息查询失败'
      that.$alert(message, title, {
        confirmButtonText: '关闭',
        callback: action => {
          location.reload()
        }
      });
    }
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}
</style>
