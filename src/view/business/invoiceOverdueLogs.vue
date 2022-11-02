<template>
  <div>
    <el-page-header @back="goBack" content="发票逾期详情" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-row class="filter_row">
      <el-select v-model="queryType.stateType" placeholder="请选择开票状态" @change="getInovicetOverdueLogs(1)" style="width: 200px">
        <el-option
          v-for="item in stateType"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-date-picker v-model="queryType.startDate"
                      type="date"
                      placeholder="开票起始日期" value-format="yyyy-MM-dd"  @change="getInovicetOverdueLogs(1)" style="width: 200px">
      </el-date-picker>
      <span style="height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
      <el-date-picker v-model="queryType.endDate"
                      type="date"
                      placeholder="开票截止日期" value-format="yyyy-MM-dd" @change="getInovicetOverdueLogs(1)" style="width: 200px">
      </el-date-picker>
      <el-button style="height: 36px;width: 100px" type="primary" @click="reset()">重置</el-button>
      <el-button style="height: 36px;width: 130px" type="primary" @click="downloadOverdueLogs()">下载excel</el-button>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="order_code"
        label="销售单号" width="150%">
        <template slot-scope="scope">
          <el-button type="text" @click="queryInvoiceInfo(scope.row.order_id)">{{scope.row.order_code}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_code"
        label="发票文件号码">
      </el-table-column>
      <el-table-column
        prop="invoice_date"
        label="开票日期">
      </el-table-column>
      <el-table-column
        prop="invoice_state"
        label="开票状态">
      </el-table-column>
      <el-table-column
        prop="invoice_money"
        label="开票金额">
        <template slot-scope="scope">
          {{ scope.row.invoice_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_money"
        label="已付金额">
        <template slot-scope="scope">
          {{ scope.row.pay_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="no_money"
        label="未付金额">
        <template slot-scope="scope">
          {{ scope.row.no_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="due_date"
        label="到期日期">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数">
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
  name: "invoiceOverdueLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {'dealer_id': null, 'startDate': '', 'endDate': '', 'stateType': '全部'},
      showInfo: false,
      stateType: ['全部', '未结', '全部未付款', '部分付款']
    }
  },
  mounted() {
    var that = this;
    var localPage = that.$route.params.pageNum;
    if (localPage === undefined){
      localPage = 1
    }
    var dealerId = that.$route.query.dealerId;
    if (dealerId === undefined){
      dealerId = that.$route.params.dealerId;
    }
    that.queryType.dealer_id = dealerId;
    this.getInovicetOverdueLogs(localPage)
  },
  methods: {
    goBack() {
      var that = this;
      that.$router.push({path: '/admin/dealer/dealerInfo?dealerId=' + that.queryType.dealer_id})
    },
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      var that = this;
      that.getInovicetOverdueLogs(val);
    },
    getInovicetOverdueLogs: function (localPage){
      var that = this;
      that.axios.post('/ald/business/invoice_overdue_logs', {'page': localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
          that.localPage = localPage // 重新设置当前页码
        }
      }).catch(res=>{
      })
    },
    queryInvoiceInfo: function (orderId){
      var that = this;
      that.$router.push({name: 'invoiceInfo', params:{pageNum: that.localPage, dealerId: that.queryType.dealer_id, orderId: orderId,
          name: 'invoiceOverdueLogs'}})
    },
    downloadOverdueLogs: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      that.axios({
        method: "get",
        url: '/ald/downloads/invoiceOverdueLogs?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '发票逾期详情.xls');
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
