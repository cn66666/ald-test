<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 130px; float:left;"
                   placeholder="最小累计滞纳金" v-model="queryType.minOverdue" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 130px; float:left;"
                   placeholder="最大累计滞纳金" v-model="queryType.maxOverdue" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 130px; float:left;"
                   placeholder="最小未缴滞纳金" v-model="queryType.minUnpaid" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 130px; float:left;"
                   placeholder="最大未缴滞纳金" v-model="queryType.maxUnpaid" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 130px; float:left;"
                   placeholder="最小已缴滞纳金" v-model="queryType.minPaid" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 130px; float:left;"
                   placeholder="最大已缴滞纳金" v-model="queryType.maxPaid" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 130px; float:left;"
                   placeholder="最小已免除纳金" v-model="queryType.minFree" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 130px; float:left;"
                   placeholder="最大已免除纳金" v-model="queryType.maxFree" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getDealerOverdueList()">查询</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="overdueList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="overdue_money"
        label="累计滞纳金" width="200%">
        <template slot-scope="scope">
          {{ scope.row.overdue_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="unpaid_money"
        label="未缴滞纳金" width="150%">
        <template slot-scope="scope">
          {{ scope.row.unpaid_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="paid_money"
        label="已缴滞纳金" width="200%">
        <template slot-scope="scope">
          {{ scope.row.paid_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="free_money"
        label="已免除滞纳金" width="150%">
        <template slot-scope="scope">
          {{ scope.row.free_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="逾期明细" btn-type="replace" size="mini"
                             check-btn="invoiceOverdue" check-role="dealerOverdueList" url="/admin/business/invoiceOverdueList"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
        </template>
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
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "overdueList",
  components: {PushFunctionBtn},
  data() {
    return {
      overdueList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      queryType: {},
    }
  },
  mounted() {
    var that = this;
    that.getDealerOverdueList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getDealerOverdueList();
    },
    getDealerOverdueList: function (){
      var that = this;
      that.axios.post('/ald/business/overdue_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.overdueList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      console.log(data)
      that.axios({
        method: "get",
        url: '/ald/downloads/dealerOverdueList?' + data + '&timestamp=' + new Date().getTime(),
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '滞纳金管理.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
