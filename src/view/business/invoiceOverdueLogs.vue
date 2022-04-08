<template>
  <div>
    <el-page-header @back="goBack" content="发票逾期详情" style="margin: 1%">
    </el-page-header>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="order_code"
        label="销售单号" width="150%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/invoiceInfo?orderId=" + scope.row.order_id'>
            <el-button type="text" >{{scope.row.order_code}}</el-button>
          </router-link>
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
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
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
      info: {'dealer_id': null},
      showInfo: false,
    }
  },
  mounted() {
    var that = this;
    that.info.dealer_id = this.$route.query.dealerId;
    this.geInovicetOverdueLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.geInovicetOverdueLogs();
    },
    geInovicetOverdueLogs: function (){
      var that = this;
      that.axios.post('/ald/business/invoice_overdue_logs', {'page': that.localPage, 'info': that.info}).then(res=>{
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
