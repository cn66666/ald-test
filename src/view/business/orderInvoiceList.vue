<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.orderType" placeholder="请选择销售单状态" style="width: 200px">
          <el-option
            v-for="item in orderState"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="销售单号" v-model="queryType.orderCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="发票号码" v-model="queryType.InvoiceCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceStartDate" style="float:left;width: 200px;"
                        type="date"
                        placeholder="发票日期起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceEndDate" style="float:left;width: 200px;"
                        type="date"
                        placeholder="发票日期截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceDueStartDate" style="float:left;width: 200px;"
                        type="date"
                        placeholder="发票到期起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceDueEndDate" style="float:left;width: 200px;"
                        type="date"
                        placeholder="发票到期截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小发票金额" v-model="queryType.minInvoiceMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大发票金额" v-model="queryType.maxInvoiceMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小发票回款金额" v-model="queryType.minInvoicePayMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大发票回款金额" v-model="queryType.maxInvoicePayMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小逾期天数" v-model="queryType.minLateDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大逾期天数" v-model="queryType.maxLateDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="getOrderInvoiceList()">查询</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="downloadOrderInvoiceList()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :span-method="objectSpanMethod"
      :data="orderInvoiceList"
      style="width: 98%; margin: 0 1%">
      <el-table-column
        prop="order_code"
        label="销售单号">
      </el-table-column>
      <el-table-column
        prop="order_state"
        label="销售单状态">
      </el-table-column>
      <el-table-column
        prop="invoice_sum"
        label="发票总金额">
      </el-table-column>
      <el-table-column
        prop="invoice_code"
        label="发票号码">
      </el-table-column>
      <el-table-column
        prop="invoice_state"
        label="发票状态">
      </el-table-column>
      <el-table-column
        prop="invoice_money"
        label="发票金额">
      </el-table-column>
      <el-table-column
        prop="invoice_date"
        label="发票日期">
      </el-table-column>
      <el-table-column
        prop="due_date"
        label="到期日">
      </el-table-column>
      <el-table-column
        prop="pay_money"
        label="回款金额">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数">
      </el-table-column>
      <el-table-column
        prop="unpaid_money"
        label="滞纳金">
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
export default {
  name: "orderInvoiceList",
  data() {
    return {
      orderInvoiceList: [],
      total: 1,
      localPage: 1,
      orderState: ['全部', '待审批', '待履行', '待开票', '已开票', '已关闭', '已取消', '待开票/部分履行', '部分完成'],
      queryType: {
        dealerId: '',
        orderType: '',
        orderCode: '',
        InvoiceCode: '',
        invoiceStartDate: '',
        invoiceEndDate: '',
        invoiceDueStartDate: '',
        invoiceDueEndDate: '',
        minInvoiceMoney: '',
        maxInvoiceMoney: '',
        minInvoicePayMoney: '',
        maxInvoicePayMoney: '',
        minLateDay: '',
        maxLateDay: '',
      },
      spanArr: []
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealerId = this.$route.query.dealerId;
    this.getOrderInvoiceList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOrderInvoiceList();
    },
    getOrderInvoiceList: function (){
      var that = this;
      that.axios.post('/ald/business/order_invoice_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.orderInvoiceList = res.data.data.data_list;
          that.total = res.data.data.total
          that.spanArr = []
          let contactDot = 0;
          that.orderInvoiceList.forEach( (item,index) => {
            //遍历tableData数据，给spanArr存入一个1，第二个item.id和前一个item.id是否相同，相同就给
            //spanArr前一位加1，spanArr再存入0，因为spanArr为n的项表示n项合并，为0的项表示该项不显示,后面有spanArr打印结果
            if(index===0){
              that.spanArr.push(1)
            }else{
              if(item.id === this.orderInvoiceList[index-1].id){
                that.spanArr[contactDot] += 1;
                that.spanArr.push(0)
              }else{
                contactDot = index
                that.spanArr.push(1)
              }
            }
          })
        }
      }).catch(res=>{
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    reset: function () {
      location.reload()
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if(columnIndex === 0||columnIndex===1||columnIndex===2){
          const _row = this.spanArr[rowIndex]
          const _col = _row>0?1:0;
          //该形式为行合并
          return{
            rowspan:_row,
            colspan:_col
          }
        }
      },
    downloadOrderInvoiceList: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      that.axios({
        method: "get",
        url: '/ald/downloads/orderInvoiceList?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '客户发货情况.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
    queryInvoiceInfo: function (orderId){
      var that = this;
      that.$router.push({name: 'invoiceInfo', params:{pageNum: that.localPage, dealerId: that.queryType.dealer_id, orderId: orderId,
          name: 'invoiceOverdueLogs'}})
    },
    }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}
</style>
