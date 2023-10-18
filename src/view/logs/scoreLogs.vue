<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="公司名称">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'  target="_blank">
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        label="分值">
      </el-table-column>
      <el-table-column
        prop="score_type"
        label="类型">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showData(scope.row.id)">查询详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next, jumper" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="查看评分数据" :visible.sync="showInfo">
      <el-form>
        <el-form-item label="评分数据">
          <p>{{ info }}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "scoreLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      info: '',
      showInfo: false,
    }
  },
  mounted() {
    this.getScoreLogs()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getScoreLogs();
    },
    getScoreLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/score_logs', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    showData: function (row_id){
      var that = this;
      for (var index in that.tableData){
        if (that.tableData[index].id === row_id){
          that.info = that.tableData[index].score_data
          that.showInfo = true
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
