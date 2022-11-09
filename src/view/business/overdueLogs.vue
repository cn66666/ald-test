<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.changeInfo" placeholder="请选择变更信息">
          <el-option
            v-for="item in changeInfoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" style="width: 200px">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input v-model="queryType.invoiceCode" placeholder="请输入发票号" style="width: 200px"></el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="额度起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="额度截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="width: 100px;height: 36px" type="primary" @click="getOverdueLogs()">查询</el-button>
        <el-button style="height: 36px;width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;width: 130px" type="primary" @click="downloadOverdueLogs()">下载excel</el-button>
      </div>
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
      queryType: {'dealer_id': null, 'startDate': null, 'endDate': null, 'invoiceCode': null, 'changeInfo': null},
      showInfo: false,
      changeInfoOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '支付滞纳金',
        label: '支付滞纳金'
      }, {
        value: '免除滞纳金',
        label: '免除滞纳金'
      }, {
        value: '新增滞纳金',
        label: '新增滞纳金'
      }],
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
    reset: function () {
      location.reload()
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
      var now = that.$utils.getNowDate()
      var file_name = '滞纳金变更详情' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/overdueLogs?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", file_name);
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}
</style>
