<template>
  <div>
    <el-page-header @back="goBack" content="滞纳金变更详情" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-row class="filter_row">
      <el-date-picker v-model="queryType.startDate"
                      type="date" style="width: 200px"
                      placeholder="发生起始日期" value-format="yyyy-MM-dd"  @change="getOverdueLogs">
      </el-date-picker>
      <span style="height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
      <el-date-picker v-model="queryType.endDate"
                      type="date" style="width: 200px"
                      placeholder="发生截止日期" value-format="yyyy-MM-dd" @change="getOverdueLogs">
      </el-date-picker>
      <el-button type="primary" @click="downloadOverdueLogs()">下载excel</el-button>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="invoice_code"
        label="开票号码">
      </el-table-column>
      <el-table-column
        prop="change_money"
        label="发生金额">
      </el-table-column>
      <el-table-column
        prop="change_info"
        label="变更信息">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="发生时间">
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
  name: "overdueLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {'dealer_id': null, 'startDate': null, 'endDate': null},
      showInfo: false,
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealer_id = this.$route.query.dealerId;
    this.getOverdueLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOverdueLogs();
    },
    getOverdueLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/overdue_logs', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    downloadOverdueLogs: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      that.axios({
        method: "get",
        url: '/ald/downloads/overdueLogs?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '滞纳金变更详情.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
