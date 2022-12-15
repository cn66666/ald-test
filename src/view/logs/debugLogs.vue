<template>
  <div>
    <el-row class="btn_row">
      debug功能:
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949" @change="updateDebugSetting">
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
        prop="file_name"
        label="文件名称"
        width="270%">
      </el-table-column>
      <el-table-column
        prop="func_name"
        label="函数名称"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="row_num"
        label="行数"
        width="100%">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="日志描述"
        width="170%">
      </el-table-column>
      <el-table-column
        prop=""
        label="debug日志">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.debug_logs">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="170%">
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
  name: "debugLogs",
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
    that.getDebugList()
    that.getDebugSetting()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getDebugList();
    },
    getDebugList: function (){
      var that = this;
      that.axios.post('/ald/logs/debug_logs', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    getDebugSetting: function (){
      var that = this;
      that.axios.post('/ald/logs/debug_setting', {}).then(res=>{
        if (res.data.code=='ok'){
          that.value = res.data.data;
        }
      }).catch(res=>{
      })
    },
    updateDebugSetting: function (){
      var that = this;
      that.axios.post('/ald/logs/update_debug_setting', {'value': that.value}).then(res=>{
        if (res.data.code=='ok'){
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
