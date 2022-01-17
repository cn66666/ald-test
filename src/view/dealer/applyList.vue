<template>
  <div>
    <el-row class="btn_row">
      <push-function-btn btn-name="手动更新客户" btn-type="reload" size="mini"
                         check-btn="refreshDealer" check-role="applyList" url="/ald/dealer/refresh_dealer"></push-function-btn>
    </el-row>
    <el-table
      class="info_table"
      :data="dealerList"
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
        prop="quota_type"
        label="额度类型" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === '新客户'">一年期额度</span>
          <span v-else-if="scope.row.quota_type === '老客户'">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="赊销额度" width="150%">
        <template slot-scope="scope">
          {{ scope.row.quota_money | moneyFormat}}
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
          <push-function-btn v-if="scope.row.state_code === '待录入'" btn-name="补充数据" btn-type="replace" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '暂存'" btn-name="修改" btn-type="replace" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '暂存'" btn-name="提交申请" btn-type="reload" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/ald/dealer/dealer_apply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '暂存'" btn-name="特殊审批" btn-type="replace" size="mini"
                             check-btn="specialApply" check-role="applyList" url="/admin/dealer/specialApply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '已拦截'" btn-name="查询拦截原因" btn-type="function" size="mini"
                             check-btn="showApplyIntercept" check-role="applyList" :check-function='showApplyIntercept'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '额度计算失败'" btn-name="重新计算" btn-type="function" size="mini"
                             check-btn="quotaReckonAgain" check-role="applyList" url="/admin/dealer/quota_reckon_again"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '待补充数据'" btn-name="前往数据采集页面" btn-type="replace_new"
                             check-btn="getDealerData" url="/xingyun/upload"
                             params-key='code' :params-value='scope.row.code' check-role="applyList"></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '待激活'" btn-name="确认激活" btn-type="reload" size="mini"
                             check-btn="doneDealerQuota" check-role="applyList" url="/ald/dealer/done_quota"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '待激活' && scope.row.quota_type === '新客户'" btn-name="重新录入" btn-type="reload" size="mini"
                             check-btn="deleteDealerQuota" check-role="applyList" url="/ald/dealer/delete_quota"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="查看拦截原因" :visible.sync="showIntercept">
      <el-form>
        <el-form-item label="拦截原因" :label-width="formLabelWidth">
          <p v-for="(item)  in interceptList" :key="item">{{ item }};</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showIntercept=false">关闭</el-button>
        <push-function-btn btn-name="跳过拦截" btn-type="reload" size="mini"
                           check-btn="skipApplyIntercept" check-role="applyList" url="/ald/dealer/skip_apply_intercept"
                           params-key='dealerId' :params-value='applyInterceptId'></push-function-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";

export default {
  name: "applyList",
  components: {PushFunctionBtn},
  data() {
    return {
      dealerList: [],
      total: 1,
      localPage: 1,
      showIntercept: false,
      formLabelWidth: '120px',
      interceptList:[],
      applyInterceptId: null
    }
  },
  mounted() {
    this.getDealerList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerList();
    },

    getDealerList: function (){
      var that = this;
      that.axios.post('/ald/dealer/apply_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.dealerList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },

    showApplyIntercept: function (dealerId){
      var that = this;
      that.interceptList = []
      that.applyInterceptId=dealerId
      that.showIntercept=true;
      that.axios.post('/ald/dealer/show_apply_intercept', {'dealerId': dealerId,}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data
        }else {
          this.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
