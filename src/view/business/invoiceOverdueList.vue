<template>
  <div>
    <el-page-header @back="goBack" content="开票逾期明细" style="margin: 1%">
    </el-page-header>
    <el-table
      :data="invoiceOverdueList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="erp_id"
        label="发票id" width="150%">
      </el-table-column>
      <el-table-column
        prop="invoice_code"
        label="发票号码" width="200%">
      </el-table-column>
      <el-table-column
        prop="invoice_date"
        label="开票日期" width="150%">
      </el-table-column>
      <el-table-column
        prop="invoice_money"
        label="开票金额" width="150%">
        <template slot-scope="scope">
          {{ scope.row.invoice_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="unpaid_money"
        label="剩余滞纳金" width="200%">
        <template slot-scope="scope">
          {{ scope.row.unpaid_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数" width="200%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="确认缴纳" btn-type="function" size="mini" float="left"
                             check-btn="addPayOverdue" check-role="dealerOverdueList" :check-function='showAddPayOverdue'
                             params-key='overdueInfo' :params-value='{"invoiceId" : scope.row.invoice_id,
                             "unpaidMoney": scope.row.unpaid_money}'></push-function-btn>

          <push-function-btn btn-name="确认免除" btn-type="function" size="mini" float="left"
                             check-btn="addFreeOverdue" check-role="dealerOverdueList" :check-function='showAddFreeOverdue'
                             params-key='overdueInfo' :params-value='{"invoiceId" : scope.row.invoice_id,
                             "unpaidMoney": scope.row.unpaid_money}'></push-function-btn>

        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="确认缴纳" :visible.sync="showAddPay">
      <el-form>
        <el-form-item label="剩余滞纳金" :label-width="formLabelWidth">
          <el-input v-model="addFrom.unpaidMoney" :disabled="true">
            <template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="已缴滞纳金" prop="paidMoney" :label-width="formLabelWidth">
          <el-input v-model="addFrom.paidMoney">
            <template slot="append">元</template></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showAddPay=false">关闭</el-button>
        <push-function-btn btn-name="确认缴纳滞纳金" btn-type="function" size="mini"
                           check-btn="payOverdue" check-role="dealerOverdueList" :check-function='PayOverdue'
                           params-key='addInfo' :params-value='addFrom'></push-function-btn>
      </div>
    </el-dialog>
    <el-dialog title="确认免除" :visible.sync="showAddFree">
      <el-form>
        <el-form-item label="剩余滞纳金" :label-width="formLabelWidth">
          <el-input v-model="addFrom.unpaidMoney" :disabled="true">
            <template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="免除金额" prop="freeMoney" :label-width="formLabelWidth">
          <el-input v-model="addFrom.freeMoney">
            <template slot="append">元</template></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showAddFree=false">关闭</el-button>
        <push-function-btn btn-name="确认免除滞纳金" btn-type="function" size="mini"
                           check-btn="freeOverdue" check-role="dealerOverdueList" :check-function='FreeOverdue'
                           params-key='addInfo' :params-value='addFrom'></push-function-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";
export default {
  name: "invoiceOverdueList",
  components: {PushFunctionBtn},
  data() {
    return {
      invoiceOverdueList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
      dealerId: null,
      showAddPay: false,
      addFrom: {
        invoiceId: null,
        unpaidMoney: 0,
        paidMoney: 0,
        freeMoney: 0,
      },
      showAddFree: false,
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    this.getInvoiceOverdueList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getInvoiceOverdueList();
    },
    getInvoiceOverdueList: function (){
      var that = this;
      that.axios.post('/ald/business/invoice_overdue_list', {'page': that.localPage, 'dealerId': that.dealerId}).then(res=>{
        if (res.data.code=='ok'){
          that.invoiceOverdueList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },

    showAddPayOverdue: function (overdueInfo){
      var that = this;
      that.addFrom.invoiceId = overdueInfo['invoiceId']
      that.addFrom.unpaidMoney = overdueInfo['unpaidMoney']
      that.addFrom.paidMoney = 0
      that.addFrom.freeMoney = 0
      that.showAddPay = true
    },
    PayOverdue: function (){
      var that = this;
      that.axios.post('/ald/business/pay_overdue', {'addForm': that.addFrom, 'dealerId': that.dealerId}).then(res=>{
        if (res.data.code=='ok'){
          location.reload()
        }
      }).catch(res=>{
        Message.warning('失败:' + res.data.msg)
      })
    },
    showAddFreeOverdue: function (overdueInfo){
      var that = this;
      that.addFrom.invoiceId = overdueInfo['invoiceId']
      that.addFrom.unpaidMoney = overdueInfo['unpaidMoney']
      that.addFrom.paidMoney = 0
      that.addFrom.freeMoney = 0
      that.showAddFree = true
    },
    FreeOverdue: function (){
      var that = this;
      that.axios.post('/ald/business/free_overdue', {'addForm': that.addFrom, 'dealerId': that.dealerId}).then(res=>{
        if (res.data.code=='ok'){
          location.reload()
        }
      }).catch(res=>{
        Message.warning('失败:' + res.data.msg)
      })
    },
    goBack() {
      this.$router.go(-1)
    },
  }
}
</script>

<style scoped>

</style>
