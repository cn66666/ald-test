<template>
  <div>
    <el-table
      :data="quotaList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="经销商名称" width="200%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="limit_type"
        label="额度类型" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === '新客户'">一年期额度</span>
          <span v-else-if="scope.row.quota_type === '老客户'">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_used"
        label="已用额度" width="150%">
        <template slot-scope="scope">
          {{ scope.row.quota_used | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_balance"
        label="剩余额度" width="150%">
        <template slot-scope="scope">
          {{ scope.row.quota_balance | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="额度截止日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === '已激活'" btn-name="拉入拦截清单" btn-type="function" size="mini"
                             check-btn="addIntercept" check-role="quotaList" :check-function='showAddIntercept'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
          <el-button type="primary" size="mini" @click="showChangeDateFunc(scope.row.dealer_id)">便捷修改截止日期</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="填写拦截原因" :visible.sync="showInterceptRemark">
      <el-form>
        <el-form-item label="拦截原因" :label-width="formLabelWidth">
          <el-input v-model="interceptRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showInterceptRemark=false">关闭</el-button>
        <push-function-btn btn-name="确认拦截" btn-type="function" size="mini"
                           check-btn="activeIntercept" check-role="quotaList" :check-function='activeInterceptDealer'
                           params-key='dealerId' :params-value='interceptDealerId'></push-function-btn>
      </div>
    </el-dialog>
    <el-dialog title="填写截止日期" :visible.sync="showChangeDate">
      <el-form>
        <el-form-item label="截止日期" :label-width="formLabelWidth">
          <el-input v-model="changeDate"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showChangeDate=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="changeDateFunc()">便捷修改截止日期</el-button>
      </div>
    </el-dialog>
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
      that.axios.post('/ald/dealer/quota_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.quotaList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    showAddIntercept: function (dealerId){
      var that = this;
      that.showInterceptRemark = true
      that.interceptDealerId = dealerId
      that.interceptRemark = ''
    },
    activeInterceptDealer: function (dealerId){
      var that = this;
      if (that.interceptRemark !== ''){
        that.axios.post('/ald/dealer/active_intercept', {'dealerId': dealerId, 'interceptRemark': that.interceptRemark}).then(res=>{
          if (res.data.code=='ok'){
            location.reload()
          }else{
            Message.warning(res.data.msg + ':' + res.data.data)
            that.showInterceptRemark = false
          }
        }).catch(res=>{
          Message.warning('错误: 请联系管理员')
        })
      }else {
        Message.warning('错误: 请联系管理员')
      }
    },
    showChangeDateFunc: function (delaerId) {
      var that = this;
      that.showChangeDate = true
      that.dealerId = delaerId
    },
    changeDateFunc: function (){
      var that = this;
      that.axios.post('/ald/dealer/change_quota_date', {'dealerId': that.dealerId, 'changeDate': that.changeDate}).then(res=>{
        if (res.data.code=='ok'){
          location.reload()
        }else{
          Message.warning(res.data.msg + ':' + res.data.data)
          that.showChangeDate = false
        }
      }).catch(res=>{
        Message.warning('错误: 请联系管理员')
      })
    }
  }
}
</script>

<style scoped>

</style>
