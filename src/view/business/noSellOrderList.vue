<template>
  <div>
    <el-table
      :data="orderList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号">
      </el-table-column>
      <el-table-column
        prop="order_count"
        label="含税金额">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态">
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
  name: "noSellOrderList",
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
      that.axios.post('/ald/business/order_list', {'page': that.localPage, 'orderType': '已审核',
        'isSell': false}).then(res=>{
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
