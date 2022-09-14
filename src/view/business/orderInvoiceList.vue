<template>
  <div>
    <el-page-header @back="goBack" content="客户回款情况" style="margin: 1%">
    </el-page-header>
    <el-row class="filter_row">
      <div style="width: 240px; float:left; margin: 2px;">
        <el-select v-model="queryType.orderType" placeholder="请选择销售单状态">
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
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left;"
                        type="date"
                        placeholder="销售单创建起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left;"
                        type="date"
                        placeholder="销售单创建截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getOrderInvoiceList()">查询</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
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
        prop="order_date"
        label="销售单创建日期">
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
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
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
      orderState: ['全部', '等待核准', '待履行', '待开票', '已开票', '已关闭', '已取消', '待开票/部分完成', '部分完成'],
      queryType: {
        dealerId: '',
        orderType: '',
        orderCode: '',
        startDate: '',
        endDate: '',
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
          that.orderInvoiceList = res.data.data.invoice_list;
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
          console.log(this.spanArr)
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
        if(columnIndex === 0||columnIndex===1||columnIndex===2||columnIndex===3){
          const _row = this.spanArr[rowIndex]
          const _col = _row>0?1:0;
          //该形式为行合并
          return{
            rowspan:_row,
            colspan:_col
          }
        }
      },
    }
}
</script>

<style scoped>

</style>
