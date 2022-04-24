<template>
  <div>
    <el-row class="filter_row">
      <push-function-btn btn-name="手动获取新订单" btn-type="reload" size="mini"
                         check-btn="refreshOrder" check-role="orderInfoList" url="/ald/business/refresh_order"></push-function-btn>
      <push-function-btn btn-name="手动更新旧订单" btn-type="reload" size="mini"
                         check-btn="uploadOrder" check-role="orderInfoList" url="/ald/business/upload_order"></push-function-btn>
      <el-select v-model="info.dealerId" placeholder="请选择变更类型" @change="getOrderInfoList(1)">
        <el-option
          v-for="item in companyList"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="info.orderType" placeholder="请选择单据类型" @change="getOrderInfoList(1)">
        <el-option
          v-for="item in orderState"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <div style="width: 250px; float:right;">
        <el-input placeholder="请输入销售单号" v-model="info.orderCode" class="input-with-select" @change="getOrderInfoList(1)">
          <el-button slot="append" icon="el-icon-search" @click="getOrderInfoList"></el-button>
        </el-input>
      </div>
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
          <el-button type="text" @click="queryFulfilInfo(scope.row.id)">{{scope.row.fulfil_sum | moneyFormat}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_sum"
        label="开票金额" width="200%">
        <template slot-scope="scope">
          <el-button type="text" @click="queryInvoiceInfo(scope.row.id)">{{scope.row.invoice_sum | moneyFormat}}</el-button>
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
        dealerId: '',
        orderCode: '',
        isDelete: false
      }
    }
  },

  created() {
    var that = this;
    var dealerId = that.$route.params.dealerId;
    var orderType = that.$route.params.orderType;
    var orderCode = that.$route.params.orderCode;
    var localPage = that.$route.params.pageNum;
    if (orderType){
      that.info.orderType = orderType
    }
    if (orderCode){
      that.info.orderCode = orderCode
    }
    if (localPage === undefined){
      localPage = 1
    }
    that.getDealerNmaeList()
    if (dealerId){
      that.info.dealerId = dealerId
    }
    that.getOrderInfoList(localPage)
  },
  // watch: {    // 监听
  //   localPage (val){
  //     console.log(val)
  //   }
  // },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.getOrderInfoList(val);
    },
    getOrderInfoList: function (localPage){
      var that = this;
      that.axios.post('/ald/business/order_info_list', {'page': localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          if (that.info.orderCode === ''){
            that.orderInfoList = res.data.data.data_list;
            that.total = res.data.data.total
            that.localPage = localPage // 重新设置当前页码
          } else{
            that.orderInfoList = res.data.data
            that.total = 1
            that.localPage = 1 // 重新设置当前页码
          }
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
    queryInvoiceInfo: function (orderId){
      var that = this;
      that.$router.push({name: 'invoiceInfo', params:{orderId: orderId, dealerId: that.info.dealerId, orderType: that.info.orderType,
          orderCode: that.info.orderCode, pageNum: that.localPage, name: 'orderInfoList'}})
    },
    queryFulfilInfo: function (orderId){
      var that = this;
      that.$router.push({name: 'fulfilInfo', params:{orderId: orderId, dealerId: that.info.dealerId, orderType: that.info.orderType,
          orderCode: that.info.orderCode, pageNum: that.localPage}})
    },
  }
}
</script>

<style scoped>

</style>
