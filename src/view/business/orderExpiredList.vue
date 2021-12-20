<template>
  <div>
    <el-table
      :data="orderList"
      style="width: 100%"
      :default-sort = "{prop: 'intercept_date', order: 'descending'}" @selection-change="handleCheckedChange">
      <el-table-column type="selection" width="50%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售订单" width="200%">
      </el-table-column>
      <el-table-column
        prop="order_money"
        label="含税金额" width="150%">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期"  width="150%"
        sortable>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === ''"></span>
          <span v-else-if="scope.row.state_code === ''"></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === ''" btn-name="" btn-type="" size="mini"
                             check-btn="" check-role="" url=""
                             params-key='' :params-value='a'></push-function-btn>

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
  data() {
    return {
      orderList: [],
      components: {PushFunctionBtn},
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      multipleSelection: []
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
    handleCheckedChange(value) {
      this.multipleSelection = value;
    },
    getOrderList: function (){
      var that = this;
      that.axios.post('/ald/business/order_list', {'page': that.localPage, 'order_type': 'order'}).then(res=>{
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
