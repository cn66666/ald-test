<template>
  <div>
    <el-table
      :data="quotaList"
      style="width: 100%">
      <el-table-column
        prop="company_name"
        label="经销商名称" width="200%">
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
      </el-table-column>
      <el-table-column
        prop="quota_balance"
        label="剩余额度" width="150%">
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
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination
        @current-change="handleCurrentChange" :current-page.sync="localPage"
        layout="prev, pager, next"
        :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="填写拦截原因" :visible.sync="showInterceptRemark">
      <el-form>
        <el-form-item label="拦截原因" :label-width="formLabelWidth">
          <el-input v-model="interceptRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showIntercept=false">关闭</el-button>
        <push-function-btn btn-name="确认拦截" btn-type="function" size="mini"
                           check-btn="activeIntercept" check-role="quotaList" :check-function='activeInterceptDealer'
                           params-key='dealerId' :params-value='interceptDealerId'></push-function-btn>
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
      interceptDealerId: null
    }
  },
  mounted() {
    this.getQuotaList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerList();
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


    }

  }
}
</script>

<style scoped>

</style>
