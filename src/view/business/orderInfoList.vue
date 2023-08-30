<template>
  <div>
    <el-row class="filter_row">
      <el-select v-model="info.dealerId" placeholder="请选择客户名称" @change="getOrderInfoList(1)" style="width: 200px; ">
        <el-option
          v-for="item in companyList"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="info.orderType" placeholder="请选择单据类型" @change="getOrderInfoList(1)" style="width: 200px; ">
        <el-option
          v-for="item in orderState"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="info.moneyType" placeholder="请选择金额过滤" @change="getOrderInfoList(1)" style="width: 200px; ">
        <el-option
          v-for="item in moneyState"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <div style="width: 200px; float:right;">
        <el-input placeholder="请输入销售单号" v-model="info.orderCode" class="input-with-select" @change="getOrderInfoList(1)">
          <el-button slot="append" icon="el-icon-search" @click="getOrderInfoList"></el-button>
        </el-input>
      </div>
      <el-button style="width: 170px;height: 36px" type="primary" :loading="loading" @click="queryNewOrder()">手动获取新订单</el-button>
      <el-button style="width: 170px;height: 36px" type="primary" :loading="loading" @click="queryOldOrder()">手动更新旧订单</el-button>
      <el-button style="width: 100px;height: 36px" type="primary" @click="download()">下载excel</el-button>
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
        label="销售单号/退货授权单号" width="150%">
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
        prop="use_money"
        label="占用金额" width="200%">
        <template slot-scope="scope">{{scope.row.use_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="return_money"
        label="退货金额" width="200%">
        <template slot-scope="scope">{{scope.row.return_money | moneyFormat}}
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
import NoPermissionBtn from "../../components/noPermissionBtn";
export default {
  name: "orderInfoList",
  components: {NoPermissionBtn},
  data() {
    return {
      orderInfoList: [],
      total: 1,
      localPage: 1,
      companyList: [],
      orderState: ['全部', '待审批', '待履行', '待开票', '已开票', '已关闭', '已取消', '待开票/部分履行', '部分完成'],
      moneyState: ['全部', '履行单及开票不为0'],
      info: {
        orderType: '',
        moneyType: '',
        dealerId: '',
        orderCode: '',
        isDelete: false
      },
      loading: false
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
    download: function (){
    var that = this;
    var data = 'data=' + JSON.stringify(that.info);
    var now = that.$utils.getNowDate()
    var file_name = '销售单状态' + now + '.xls'
    that.axios({
      method: "get",
      url: '/ald/downloads/orderInfoList?' + data + '&timestamp=' + new Date().getTime(),
      responseType: 'blob'
    }).then((res) => {
      let blob = new Blob([res.data])
      let objectUrl = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = objectUrl;
      link.setAttribute("download", file_name);
      document.body.appendChild(link);
      link.click();
    })
    },
    queryNewOrder: function () {
      var that = this;
      that.loading = true;
      that.axios.post('/ald/business/refresh_order', {}).then(res=>{
        location.reload()
      }).catch(res=>{
      })
    },
    queryOldOrder: function () {
      var that = this;
      that.loading = true;
      that.axios.post('/ald/business/upload_order', {}).then(res=>{
        location.reload()
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}
</style>
