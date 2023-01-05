<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
      width="80px">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="api_type"
        label="请求类型">
      </el-table-column>
      <el-table-column
        prop="stat_code"
        label="请求状态">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="removeLogs(scope.row.id)">清除缓存</el-button>
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
import {Message} from "element-ui";

export default {
  name: "tycRequestLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
    }
  },
  mounted() {
    this.getTycRequestList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getTycRequestList();
    },
    getTycRequestList: function (){
      var that = this;
      that.axios.post('/ald/logs/tyc_logs', {'page': that.localPage,}).then(res=>{
        if (res.data.code==='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    removeLogs: function (tycId){
      var that = this;
      that.axios.post('/ald/logs/remove_tyc_logs', {'tycId': tycId,}).then(res=>{
        if (res.data.code==='ok'){
          location.reload()
        } else {
          Message.warning('')
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
