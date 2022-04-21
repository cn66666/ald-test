<template>
  <div>
    <el-table
      :data="quotaList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="350%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="注销日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="80%">
        <span>已注销</span>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="查看额度变更" btn-type="replace" size="mini"
                             check-btn="showQuotaLog" check-role="quotaList" url="/admin/dealer/quotaLogs"
                             params-key='dealerId' :params-value='scope.row.id'></push-function-btn>

          <push-function-btn btn-name="查看滞纳金变更" btn-type="replace" size="mini"
                             check-btn="showOverdueLog" check-role="dealerOverdueList" url="/admin/business/overdueLogs"
                             params-key='dealerId' :params-value='scope.row.id'></push-function-btn>

          <push-function-btn btn-name="查看发票逾期" btn-type="replace" size="mini"
                             check-btn="showInvoiceOverdueLog" check-role="dealerOverdueList" url="/admin/business/invoiceOverdueLogs"
                             params-key='dealerId' :params-value='scope.row.id'></push-function-btn>
        </template>
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
import {Message} from "element-ui";
export default {
  name: "quotaList",
  components: {PushFunctionBtn},
  data() {
    return {
      quotaList: [],
      total: 1,
      localPage: 1,
      showInterceptRemark: false,
      interceptRemark:  '',
      formLabelWidth: '120px',
      interceptDealerId: null,
      showChangeDate: false,
      dealerId: null,
      changeDate: ''
    }
  },
  mounted() {
    this.getQuotaList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getQuotaList();
    },
    getQuotaList: function (){
      var that = this;
      that.axios.post('/ald/dealer/inactive_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.quotaList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
