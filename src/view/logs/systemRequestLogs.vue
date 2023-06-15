<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input v-model="queryType.path" placeholder="请求地址"></el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.createStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="ald请求日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.createEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="ald请求截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getSysLogs()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
      </div>
    </el-row>
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
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination
        @current-change="handleCurrentChange" :current-page.sync="localPage"
        layout="prev, pager, next, jumper"
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
      queryType: {}
    }
  },
  mounted() {
    this.getSysLogs()
  },
  methods: {
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getSysLogs();
    },
    getSysLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/sys_logs', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
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
