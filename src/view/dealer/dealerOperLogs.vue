<template>
  <div>
    <el-page-header @back="goBack" content="用户操作日志" style="margin: 1%">
    </el-page-header>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left;"
                        type="date"
                        placeholder="操作起始日期" value-format="yyyy-MM-dd" @change="getDealerOperLogs()">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left;"
                        type="date"
                        placeholder="操作截止日期" value-format="yyyy-MM-dd" @change="getDealerOperLogs()">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="downloadDealerOperLogs()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="user_name"
        label="操作人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="func_name"
        label="操作功能"
        width="200">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="操作时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="content"
        label="变更内容">
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
  name: "dealerOperLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {dealer_id: null, startDate: null, endDate: null},
      showInfo: false,
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealer_id = this.$route.query.dealerId;
    this.getDealerOperLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerOperLogs();
    },
    getDealerOperLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/oper_logs', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    downloadDealerOperLogs: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      that.axios({
        method: "get",
        url: '/ald/downloads/dealerOperLogs?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '用户操作日志.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
