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
        prop="permission_id"
        label="permission_id"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="api_url"
        label="请求地址"
        width="170%">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.api_url">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="请求参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.api_parames">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="api_headers"
        label="返回参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.api_headers">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="返回参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.api_result">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next, jumper" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "oaApiLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
    }
  },
  mounted() {
    this.getOaApiList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOaApiList();
    },
    getOaApiList: function (){
      var that = this;
      that.axios.post('/ald/logs/oa_api', {'page': that.localPage,}).then(res=>{
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
