<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="margin: 1%">
    </el-page-header>
    <el-descriptions :column="2" size="small" border style="margin: 1%;">
      <el-descriptions-item>
        <template slot="label">
          客户名称
        </template>
        {{ dealerInfo.company_name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          客户状态
        </template>
        <span v-if="dealerInfo.state_code === 'active'">已激活</span>
        <span v-else-if="dealerInfo.state_code === 'intercept'">已拦截</span>
        <span v-else-if="dealerInfo.state_code === 'apply'">申请中</span>
        <span v-else></span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          最新评级
        </template>
        {{ dealerInfo.score_level }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          账期天数
        </template>
        {{ dealerInfo.score_quota_day }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          额度类型
        </template>
        <span v-if="dealerInfo.quota_type === '新客户'">一年期额度</span>
        <span v-else-if="dealerInfo.quota_type === '老客户'">长期额度</span>
        <span v-else></span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          审批额度
        </template>
        {{ dealerInfo.quota_money | moneyFormat }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          已用额度
        </template>
        {{ dealerInfo.quota_used | moneyFormat }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          额度截止日期
        </template>
        {{ dealerInfo.quota_date }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          特批额度
        </template>
        <span style="margin-right: 30px">{{ dealerInfo.special_quota | moneyFormat }}</span>
        <push-function-btn btn-name="进行额度特批" btn-type="function" size="mini"
                           check-btn="showSpecialQuota" check-role="quotaList" :check-function='showSpecialQuota'
                           params-key='dealerId' :params-value='{"dealerId" : dealerId,
                             "special_quota": dealerInfo.special_quota}'></push-function-btn>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          特批额度截止日期
        </template>
        {{ dealerInfo.special_date }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          是否被拦截
        </template>
        <span v-if="dealerInfo.is_intercept === true">已拦截</span>
        <span v-else-if="dealerInfo.is_intercept === false">未拦截</span>
        <span v-else></span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          跳过发票逾期校验
        </template>
        <span v-if="dealerInfo.is_skip === true" style="margin-right: 30px">已跳过</span>
        <span v-else-if="dealerInfo.is_skip === false" style="margin-right: 30px">未跳过</span>
        <span v-else></span>
        <el-button type="primary" size="mini" @click="showQuotaForm=true">更改逾期特批</el-button>
      </el-descriptions-item>
    </el-descriptions>
    <br>
    <span style="margin-left: 10px">近20条额度变更记录
          <push-function-btn btn-name="查看额度变更" btn-type="replace" size="mini"
                             check-btn="showQuotaLog" check-role="quotaList" url="/admin/dealer/quotaLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
    </span>
    <br>
    <br>
    <el-table
      :data="dealerInfo.quota_log"
      border
      style="width: 98%; margin: 1%">
      <el-table-column
        prop="change_money"
        label="变更金额"
        width="300">
        <template slot-scope="scope">
          {{ scope.row.change_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="change_info"
        label="变更信息"
        width="300">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="变更时间">
      </el-table-column>
    </el-table>
    <span style="margin-left: 10px">近20条滞纳金变更记录
          <push-function-btn btn-name="查看滞纳金变更" btn-type="replace" size="mini"
                             check-btn="showOverdueLog" check-role="dealerOverdueList" url="/admin/business/overdueLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
    </span>
    <br>
    <br>
    <el-table
      :data="dealerInfo.overdue_log"
      border
      style="width: 98%; margin: 1%">
      <el-table-column
        prop="change_money"
        label="变更金额"
        width="300">
        <template slot-scope="scope">
          {{ scope.row.change_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="change_info"
        label="变更信息"
        width="300">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="变更时间">
      </el-table-column>
    </el-table>
    <span style="margin-left: 10px">近20条发票逾期记录
          <push-function-btn btn-name="查看发票逾期" btn-type="replace" size="mini"
                             check-btn="showInvoiceOverdueLog" check-role="dealerOverdueList" url="/admin/business/invoiceOverdueLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
    </span>
    <br>
    <br>
    <el-table
      :data="dealerInfo.invoice_log"
      border
      style="width: 98%; margin: 1%">
      <el-table-column
        prop="invoice_code"
        label="发票文件号码"
        width="300">
      </el-table-column>
      <el-table-column
        prop="invoice_date"
        label="开票日期"
        width="300">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="逾期天数">
      </el-table-column>
    </el-table>

    <el-dialog title="进行特批额度" :visible.sync="showForm">
      <el-form>
        <el-form-item label="特批额度" :label-width="formLabelWidth">
          <el-input v-model="addForm.special_quota">
            <template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="特批结束日期" prop="special_date" :label-width="formLabelWidth">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          v-model="addForm.special_date"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showForm=false">关闭</el-button>
        <push-function-btn btn-name="确认特批额度" btn-type="function" size="mini"
                           check-btn="addSpecialQuota" check-role="quotaList" :check-function='addSpecialQuota'
                           params-key='addInfo' :params-value='addForm'></push-function-btn>
      </div>
    </el-dialog>

    <el-dialog title="跳过发票逾期校验" :visible.sync="showQuotaForm">
      <el-form>
        <el-form-item label="" :label-width="formLabelWidth">
          <span v-if="dealerInfo.is_skip === true" style="margin-right: 30px">当前<span style="color: red">已允许</span>跳过发票逾期校验</span>
          <span v-else-if="dealerInfo.is_skip === false" style="margin-right: 30px">当前<span style="color: red">未允许</span>跳过发票逾期校验</span>
          <span v-else></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showForm=false">关闭</el-button>
        <push-function-btn btn-name="更改逾期特批" btn-type="reload" size="mini"
                           check-btn="checkOverdueSkip" check-role="quotaList" url="/ald/dealer/overdue_skip"
                           params-key='dealerId' :params-value='dealerId'></push-function-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import { Message } from 'element-ui';
export default {
  name: "dealerInfo",
  components: {PushFunctionBtn},
  data() {
    return {
      dealerId: null,
      dealerInfo: {},
      showForm: false,
      showQuotaForm: false,
      formLabelWidth: '120px',
      addForm: {
        special_quota: 0,
        special_date: ''
      }
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getDealerInfo()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDealerInfo: function (){
      var that = this;
      that.axios.post('/ald/dealer/dealer_info', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code==='ok'){
          that.dealerInfo = res.data.data
        }
      }).catch(res=>{
      })
    },
    showSpecialQuota: function (){
      var that = this;
      if (that.dealerInfo.state_code === 'active'){
        that.showForm = true
      }else {
        Message.warning('失败: 该客户未激活额度')
      }
    },
    addSpecialQuota: function (){
      var that = this;
      var special_quota = that.addForm.special_quota
      var special_date = that.addForm.special_date
      if (special_quota === '') {
        Message.warning('失败: 请填写正确的特批额度')
        return
      } else {
        if (special_quota !== '') {
          try {
            debugger
            var res = parseFloat(special_quota)
            if (isNaN(res)) {
              Message.warning('失败: 请填写正确的特批额度')
              return
            }
          } catch (err) {
            Message.warning('失败: 请填写正确的特批额度')
            return
          }
        }
      }
      if (special_date === '') {
        Message.warning('失败: 请填写正确的特批结束日期')
        return
      }
      that.axios.post('/ald/dealer/add_special_quota', {'addForm': that.addForm, 'dealerId': that.dealerId}).then(res=>{
        if (res.data.code=='ok'){
          location.reload()
          return
        }else {
          Message.warning('失败: ' + res.data.data)
          return
        }
      }).catch(res=>{
      })
    },

    showDealerQuotaCheck: function (){

    }
  }

}
</script>

<style scoped>

</style>
