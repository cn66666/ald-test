<template>
  <div>
    <el-page-header @back="goBack" content="销售单状态" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-table
      class="info_table"
      :data="orderInfoList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="order_code"
        label="销售单号" width="150%">
      </el-table-column>
      <el-table-column
        prop="fulfil_sum"
        label="履行单金额" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/fulfilInfo?orderId=" + scope.row.id'>
            <el-button type="text" >{{scope.row.fulfil_sum | moneyFormat}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_sum"
        label="开票金额" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/invoiceInfo?orderId=" + scope.row.id'>
            <el-button type="text" >{{scope.row.invoice_sum | moneyFormat}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_state"
        label="订单状态">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期">
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
export default {
  name: "inactiveOrderInfoList",
  components: {PushFunctionBtn},
  data() {
    return {
      orderInfoList: [],
      total: 1,
      localPage: 1,
      info: {
        orderType: '',
        dealerId: '',
        orderCode: '',
        isDelete: true
      }
    }
  },
  mounted() {
    var that = this;
    that.info.dealerId = this.$route.query.dealerId;
    that.getOrderInfoList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getOrderInfoList();
    },
    getOrderInfoList: function (){
      var that = this;
      that.axios.post('/ald/business/order_info_list', {'page': that.localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          if (that.info.orderCode === ''){
            that.orderInfoList = res.data.data.data_list;
            that.total = res.data.data.total
            that.localPage = that.localPage // 重新设置当前页码
          } else{
            that.orderInfoList = res.data.data
            that.total = 1
            that.localPage = 1 // 重新设置当前页码
          }
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
