<template>
  <div>
    <el-table
      :data="orderInfoList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="300%">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="150%">
      </el-table-column>
      <el-table-column
        prop="fulfil_sum"
        label="履行单金额" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/fulfilInfo?orderId=" + scope.row.id'>
            <el-button type="text" >{{scope.row.fulfil_sum}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_sum"
        label="开票金额" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/invoiceInfo?orderId=" + scope.row.id'>
            <el-button type="text" >{{scope.row.invoice_sum}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期">
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
  name: "orderInfoList",
  components: {PushFunctionBtn},
  data() {
    return {
      orderInfoList: [],
      total: 1,
      localPage: 1,
    }
  },
  mounted() {
    this.getOrderInfoList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOrderInfoList();
    },
    getOrderInfoList: function (){
      var that = this;
      that.axios.post('/ald/business/order_info_list', {'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.orderInfoList = res.data.data.data_list;
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
