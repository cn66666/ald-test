<template>
  <div>
    <el-page-header @back="goBack" content="票据详情" style="margin: 1%">
    </el-page-header>
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
      <el-table-column
        prop="settled_date"
        label="结算日期">
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
import PushFunctionBtn from "../../components/pushFunctionBtn";
import router from "../../router";
export default {
  name: "invoiceinfo",
  components: {PushFunctionBtn},
  data() {
    return {
      invoiceList: [],
      total: 1,
      localPage: 1,
      orderId: null,
      dealerId: '',
      orderType: '',
      orderCode: '',
      pageNum: '',
      name: ''
    }
  },
  mounted() {
    var that = this;
    that.dealerId = that.$route.params.dealerId;
    that.orderType = that.$route.params.orderType;
    that.orderCode = that.$route.params.orderCode;
    that.pageNum = that.$route.params.pageNum;
    that.orderId = that.$route.params.orderId;
    that.name = that.$route.params.name;
    that.getOrderInvoiceListList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getOrderInvoiceListList();
    },
    getOrderInvoiceListList: function (){
      var that = this;
      that.axios.post('/ald/business/invoice_list', {'orderId': that.orderId, 'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.invoiceList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    goBack() {
      var that = this;
      that.$router.push({name: that.name, params:{dealerId: that.dealerId, orderType: that.orderType,
          orderCode: that.orderCode, pageNum: that.pageNum}})
    },
  }
}
</script>

<style scoped>

</style>
