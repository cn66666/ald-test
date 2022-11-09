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
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.fulfilType" placeholder="请选择履行单状态" style="width: 200px">
          <el-option
            v-for="item in fulfilType"
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
                   placeholder="履行单号" v-model="queryType.fulfilCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left;width: 200px; "
                        type="date"
                        placeholder="销售单创建起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left;width: 200px; "
                        type="date"
                        placeholder="销售单创建截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小履行单金额" v-model="queryType.minFulfilMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大履行单金额" v-model="queryType.maxFulfilMoney" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.fulfilStartDate" style="float:left;width: 200px; "
                        type="date"
                        placeholder="履行单创建起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.fulfilEndDate" style="float:left;width: 200px; "
                        type="date"
                        placeholder="履行单创建截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="getOrderFulfilList()">查询</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="downloadOrderFulfilList()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :span-method="objectSpanMethod"
      :data="orderFulfilList"
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
        prop="fulfil_code"
        label="履行单号">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="履行单状态">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行单金额">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="履行单创建日期">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.fulfil_id" type="primary" size="mini" @click="queryGoodsInfo(scope.row.fulfil_id, scope.row.fulfil_code)">查看发货情况</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog :title="showTitle" :visible.sync="showForm">
      <el-form>
        <el-table
          class="info_table"
          :span-method="objectSpanMethod"
          :data="goodsList"
          style="width: 98%; margin: 0 1%">
          <el-table-column
            prop="goods_name"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="goods_money"
            label="商品金额">
          </el-table-column>
          <el-table-column
            prop="goods_count"
            label="商品总数">
          </el-table-column>
          <el-table-column
            prop="goods_state"
            label="商品状态">
          </el-table-column>
          <el-table-column
            prop="goods_send"
            label="商品已发货数量">
          </el-table-column>
          <el-table-column
            prop="goods_not_send"
            label="商品未发货数量">
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "orderFulfilList",
  data() {
    return {
      orderFulfilList: [],
      total: 1,
      localPage: 1,
      orderState: ['全部', '等待核准', '待履行', '待开票', '已开票', '已关闭', '已取消', '待开票/部分完成', '部分完成'],
      fulfilType: ['全部', '正在处理', '正在进行', '已履行,但出现异常', '已履行，但出现异常', '已取消', '已拒绝', '已完成'],
      queryType: {
        dealerId: '',
        orderType: '',
        orderCode: '',
        startDate: '',
        endDate: '',
        minFulfilMoney: '',
        maxFulfilMoney: '',
        fulfilCode: '',
        fulfilStartDate: '',
        fulfilEndDate: ''
      },
      spanArr: [],
      showForm: false,
      showTitle: '',
      goodsList: []
    }
  },
  mounted() {
    var that = this;
    var dealerId = that.$route.query.dealerId;
    if (dealerId === undefined){
      dealerId = that.$route.params.dealerId;
    }
    that.queryType.dealerId = dealerId;
    this.getOrderFulfilList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOrderFulfilList();
    },
    getOrderFulfilList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_goods_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.orderFulfilList = res.data.data.data_list;
          that.total = res.data.data.total
          that.spanArr = []
          let contactDot = 0;
          that.orderFulfilList.forEach( (item,index) => {
            //遍历tableData数据，给spanArr存入一个1，第二个item.id和前一个item.id是否相同，相同就给
            //spanArr前一位加1，spanArr再存入0，因为spanArr为n的项表示n项合并，为0的项表示该项不显示,后面有spanArr打印结果
            if(index===0){
              that.spanArr.push(1)
            }else{
              if(item.id === this.orderFulfilList[index-1].id){
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
    queryGoodsInfo: function (fulfilId, fulfilCode){
      var that = this;
      that.goodsList = []
      that.showTitle = '履行单' + fulfilCode + '的发货情况'
      that.axios.post('/ald/business/goods_list', {'fulfilId': fulfilId}).then(res=>{
        if (res.data.code=='ok'){
          that.goodsList = res.data.data
          that.showForm = true
        }
      }).catch(res=>{
      })
    },
    downloadOrderFulfilList: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      var now = that.$utils.getNowDate()
      var file_name = '客户发货情况' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/orderFulfilList?' + data,
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
