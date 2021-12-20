<template>
  <div>
    <el-table
      :data="orderList"
      style="width: 100%"
      :default-sort = "{prop: 'intercept_date', order: 'descending'}" @selection-change="handleCheckedChange">
      <el-table-column
        prop="company_name"
        label="客户名称">
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号">
      </el-table-column>
      <el-table-column
        prop="order_money"
        label="含税金额">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期" sortable>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态">
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
      that.axios.post('/ald/business/order_list', {'page': that.localPage, 'order_type': '已发货'}).then(res=>{
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
