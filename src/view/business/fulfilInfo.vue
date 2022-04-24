<template>
  <div>
    <el-page-header @back="goBack" content="履行单详情" style="margin: 1%">
    </el-page-header>
    <el-table
      :data="fulfilList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="fulfil_code"
        label="履行单号" width="150%">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行单金额" width="200%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="refuse_money"
        label="退款金额" width="200%">
        <template slot-scope="scope">
          {{ scope.row.refuse_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="履行单状态" width="200%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期">
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
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "fulfilInfo",
  components: {PushFunctionBtn},
  data() {
    return {
      fulfilList: [],
      total: 1,
      localPage: 1,
      orderId: null,
      dealerId: '',
      orderType: '',
      orderCode: '',
      pageNum: ''
    }
  },
  mounted() {
    var that = this;
    that.dealerId = that.$route.params.dealerId;
    that.orderType = that.$route.params.orderType;
    that.orderCode = that.$route.params.orderCode;
    that.pageNum = that.$route.params.pageNum;
    that.orderId = this.$route.params.orderId;
    that.getOrderFulfilList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getOrderFulfilList();
    },
    getOrderFulfilList: function (){
      var that = this;
      that.axios.post('/ald/business/order_fulfil_list', {'orderId': that.orderId, 'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.fulfilList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    goBack() {
      var that = this;
      that.$router.push({name: 'orderInfoList', params:{dealerId: that.dealerId, orderType: that.orderType,
          orderCode: that.orderCode, pageNum: that.pageNum}})
    },
  }
}
</script>

<style scoped>

</style>
