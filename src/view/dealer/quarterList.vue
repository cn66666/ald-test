<template>
  <div>
    <el-table
      :data="quarterList"
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
        prop="old_quota"
        label="旧赊销额度" width="150%">
        <template slot-scope="scope">
          {{ scope.row.old_quota | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="新赊销额度" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.busy_quota !== 0">{{scope.row.busy_quota | moneyFormat}}</span>
          <span v-else>{{scope.row.new_quota | moneyFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quarter_date"
        label="生效日期" width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'approval'">季度调额待审批</span>
          <span v-else-if="scope.row.state_code === 'unactive'">待激活</span>
          <span v-else-if="scope.row.state_code === 'reckon'">季度额度计算中</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === 'approval' && scope.row.busy_quota === 0" btn-name="通过审批" btn-type="reload" size="mini"
                             check-btn="quotaActive" check-role="quarterList" url="/ald/dealer/quarter_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'approval' && scope.row.busy_quota !== 0" btn-name="通过淡旺季审批" btn-type="reload" size="mini"
                             check-btn="busyQuotaActive" check-role="quarterList" url="/ald/dealer/quarter_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'approval' && scope.row.busy_quota !== 0" btn-name="拒绝淡旺季审批" btn-type="reload" size="mini"
                             check-btn="busyQuotaUnactive" check-role="quarterList" url="/ald/dealer/quarter_unactive"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
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
  name: "quarterList",
  components: {PushFunctionBtn},
  data() {
    return {
      quarterList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
      applyInterceptId: null,
      showChangeDate: false,
      dealerId: null,
      changeDate: ''
    }
  },
  mounted() {
    this.getQuarterList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getQuarterList();
    },
    getQuarterList: function (){
      var that = this;
      that.axios.post('/ald/dealer/quarter_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.quarterList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    showChangeDateFunc: function (delaerId) {
      var that = this;
      that.showChangeDate = true
      that.dealerId = delaerId
    },
    changeDateFunc: function (){
      var that = this;
      that.axios.post('/ald/dealer/change_quarter_date', {'dealerId': that.dealerId, 'changeDate': that.changeDate}).then(res=>{
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
