<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.stateType" placeholder="请选择开票状态" style="width: 200px">
          <el-option
            v-for="item in stateType"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input v-model="queryType.orderCode" placeholder="请输入销售单号" style="width: 200px"></el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input v-model="queryType.invoiceCode" placeholder="请输入发票号" style="width: 200px"></el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="开票起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="开票截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.dueStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="开票到期起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.dueEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="开票到期截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小开票金额" v-model="queryType.minInvoiceMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大开票金额" v-model="queryType.maxInvoiceMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小已付金额" v-model="queryType.minPayMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大已付金额" v-model="queryType.maxPayMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小未付金额" v-model="queryType.minNoMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大未付金额" v-model="queryType.maxNoMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小逾期天数" v-model="queryType.minLateDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大逾期天数" v-model="queryType.maxLateDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-button style="width: 100px;height: 36px" type="primary" @click="getInovicetOverdueLogs(1)">查询</el-button>
        <el-button style="height: 36px;width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;width: 130px" type="primary" @click="downloadOverdueLogs()">下载excel</el-button>
      </div>
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
      queryType: {'dealer_id': null, 'startDate': '', 'endDate': '', 'stateType': '', 'orderCode': null,
        'invoiceCode': null, 'dueStartDate': '', 'dueEndDate': '', 'minInvoiceMoney': null, 'maxInvoiceMoney': null,
        'minPayMoney': null, 'maxPayMoney': null, 'minNoMoney': null, 'maxNoMoney': null, 'minLateDay': null,
        'maxLateDay': null},
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
      var now = that.$utils.getNowDate()
      var file_name = '发票逾期详情' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/invoiceOverdueLogs?' + data,
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
