<template>
  <div>
    <el-row class="filter_row">
      <push-function-btn btn-name="手动获取新订单" btn-type="reload" size="mini"
                         check-btn="refreshOrder" check-role="orderInfoList" url="/ald/business/refresh_order"></push-function-btn>
      <push-function-btn btn-name="手动更新旧订单" btn-type="reload" size="mini"
                         check-btn="uploadOrder" check-role="orderInfoList" url="/ald/business/upload_order"></push-function-btn>
      <el-select v-model="info.companyName" placeholder="请选择变更类型" @change="getOrderInfoList">
        <el-option
          v-for="item in companyList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="info.orderType" placeholder="请选择单据类型" @change="getOrderInfoList">
        <el-option
          v-for="item in orderState"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-row>
    <el-table
      class="info_table"
      :data="orderInfoList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="300%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
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
  name: "orderInfoList",
  components: {PushFunctionBtn},
  data() {
    return {
      orderInfoList: [],
      total: 1,
      localPage: 1,
      companyList: [],
      orderState: ['全部', '等待核准', '待履行', '待开票', '已开票', '已关闭', '已取消', '待开票/部分完成', '部分完成'],
      info: {
        orderType: '',
        companyName: ''
      }
    }
  },
  mounted() {
    var that = this;
    that.getDealerNmaeList()
    that.getOrderInfoList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getOrderInfoList();
    },
    getOrderInfoList: function (){
      var that = this;
      that.axios.post('/ald/business/order_info_list', {'page': that.localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          that.orderInfoList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    getDealerNmaeList: function (){
      var that = this;
      that.axios.post('/ald/dealer/dealer_name_list', {}).then(res=>{
        if (res.data.code=='ok'){
          that.companyList = res.data.data;
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
