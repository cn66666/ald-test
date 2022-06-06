<template>
  <div>
    <el-row class="btn_row">
      监控状态:
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
      width="80px">
      </el-table-column>
      <el-table-column
        prop="control_type"
        label="监控类型"
        width="270%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态"
        width="170%">
      </el-table-column>
      <el-table-column
        prop=""
        label="监控日志">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.control_log">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="170%">
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
  name: "controlLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      value: false
    }
  },
  mounted() {
    var that = this;
    that.getControlList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getControlList();
    },
    getControlList: function (){
      var that = this;
      that.axios.post('/ald/logs/control_logs', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total;
          var data = res.data.data.check
          if (data === 'ok'){
            that.value = true;
          }
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
