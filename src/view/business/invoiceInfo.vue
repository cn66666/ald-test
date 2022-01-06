<template>
  <div>
    <el-table
      :data="invoiceList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
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
      </el-table-column>
      <el-table-column
        prop="pay_money"
        label="已付金额">
      </el-table-column>
      <el-table-column
        prop="no_money"
        label="未付金额">
      </el-table-column>
      <el-table-column
        prop="due_date"
        label="到期日期">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数">
      </el-table-column>
      <el-table-column
        prop="settled_date"
        label="结算日期">
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 23px;margin-right: 79px;">
      <el-pagination
        @current-change="handleCurrentChange" :current-page.sync="localPage"
        layout="prev, pager, next"
        :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "invoiceinfo",
  components: {PushFunctionBtn},
  data() {
    return {
      invoiceList: [],
      total: 1,
      localPage: 1,
      orderId: null
    }
  },
  mounted() {
    var that = this;
    that.orderId = this.$route.query.orderId;
    that.getOrderInvoiceListList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOrderInvoiceListList();
    },
    getOrderInvoiceListList: function (){
      var that = this;
      that.axios.post('/ald/business/order_invoice_list', {'orderId': that.orderId, 'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.invoiceList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    }
  }
}
</script>

<style scoped>

</style>
