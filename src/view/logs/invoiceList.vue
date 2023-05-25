<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="erp发票id" v-model="queryType.erpId">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="发票号码" v-model="queryType.invoiceCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.invoiceState" style="float:left;width: 200px;" placeholder="请选择发票状态">
          <el-option
            v-for="item in invoiceState"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceDateStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票创建日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceDateEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票创建截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceDueStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票到期日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceDueEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票到期截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceSettledStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票结算日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceSettledEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发票结算截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.invoiceCreateStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="ald发票创建日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.invoiceCreateEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="ald发票创建截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getInvoiceList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
        width="80px">
      </el-table-column>
      <el-table-column
        prop="erp_id"
        label="erp_id">
      </el-table-column>
      <el-table-column
        prop="invoice_code"
        label="发票号码">
      </el-table-column>
      <el-table-column
        prop="invoice_date"
        label="发票时间">
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
        prop="pay_money"
        label="发票支付金额">
      </el-table-column>
      <el-table-column
        prop="no_money"
        label="发票未支付金额">
      </el-table-column>
      <el-table-column
        prop="due_date"
        label="到期时间">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数">
      </el-table-column>
      <el-table-column
        prop="settled_date"
        label="结算时间">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间"
        width="170%">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next, jumper" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "invoiceList",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {},
      invoiceState: [
        {'type': '全部', 'query': '全部'},
        {'type': '未结', 'query': '未结'},
        {'type': '全额付款', 'query': '全额付款'},
        {'type': '已删除', 'query': '已删除'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getInvoiceList()
  },
  methods: {
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getInvoiceList();
    },
    getInvoiceList: function (){
      var that = this;
      that.axios.post('/ald/business/invoice_page', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      var now = that.$utils.getNowDate()
      var file_name = '发票数据详情' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/invoiceList?' + data,
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
  }
}
</script>

<style scoped>

</style>
