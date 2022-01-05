<template>
  <div>
    <el-row>
      <el-button type="primary" size="mini">批量标记赊销订单</el-button>
      <el-button type="primary" size="mini">批量标记非赊销订单</el-button>
      <push-function-btn btn-name="手动刷新订单" btn-type="reload" size="mini"
                         check-btn="refreshOrder" check-role="orderList" url="/ald/business/refresh_order"></push-function-btn>
    </el-row>
    <el-table
      :data="orderList"
      style="width: 100%" @selection-change="handleCheckedChange">
      <el-table-column type="selection" width="50%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
      </el-table-column>
      <el-table-column
        prop="order_count"
        label="含税金额" width="150%">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="标记赊销订单" btn-type="reload" size="mini"
                             check-btn="checkOneOrderQuota" check-role="orderList" url="/ald/business/check_quota_order"
                             params-key='orderId' :params-value='scope.row.id'></push-function-btn>
          <push-function-btn btn-name="直接发货" btn-type="reload" size="mini"
                             check-btn="checkOneOrderDone" check-role="orderList" url="/ald/business/order_done"
                             params-key='orderId' :params-value='scope.row.id'></push-function-btn>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float: right;margin-top: 23px;margin-right: 79px;">
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
  name: "orderList",
  components: {PushFunctionBtn},
  data() {
    return {
      orderList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: []
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOrderList();
    },
    getOrderList: function (){
      var that = this;
      that.axios.post('/ald/business/order_list', {'page': that.localPage, 'orderType': '待审核',
      'isSell': null}).then(res=>{
        if (res.data.code=='ok'){
          that.orderList = res.data.data.data_list;
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
