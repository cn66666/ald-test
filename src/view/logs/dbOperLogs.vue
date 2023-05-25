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
        prop="table_name"
        label="表名称"
        width="170%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.oper_parm">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="oper_type"
        label="操作类型"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="func_name"
        label="函数名称"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="170%">
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
  name: "dbOperLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
    }
  },
  mounted() {
    this.getOpenApiList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOpenApiList();
    },
    getOpenApiList: function (){
      var that = this;
      that.axios.post('/ald/logs/db_logs', {'page': that.localPage,}).then(res=>{
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
