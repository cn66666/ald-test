<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="margin: 1%">
    </el-page-header>
    <div style="margin: 20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="客户信息" name="客户信息">
          <el-descriptions :column="2" size="small" border style="margin: 1%;" :labelStyle="{'width': '10%'}"
                           :contentStyle="{'width': '10%'}">
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
              <span v-if="dealerInfo.is_delete === true">已注销</span>
              <span v-else-if="dealerInfo.state_code === 'active'">已激活</span>
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
              <span v-if="dealerInfo.special_quota !== 0">{{ dealerInfo.special_quota | moneyFormat }}</span>
              <span v-else>未进行额度特批</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                特批额度截止日期
              </template>
              <span v-if="dealerInfo.special_quota !== 0">{{ dealerInfo.special_date }}</span>
              <span v-else>未进行额度特批</span>
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
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                贸易类型
              </template>
              出口客户
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                成立时长
              </template>
              {{dealerInfo.export_info.create_year}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                国家
              </template>
              {{dealerInfo.export_info.country}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                支付方式
              </template>
              {{dealerInfo.export_info.pay_type}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                信用期限
              </template>
              {{dealerInfo.export_info.credit_day}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                拒收风险赔偿比例
              </template>
              {{dealerInfo.export_info.risk_rate}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                其他商业风险赔偿比例
              </template>
              {{dealerInfo.export_info.other_risk_rate}}
            </el-descriptions-item>
            <el-descriptions-item v-if="dealerInfo.is_export === true">
              <template slot="label">
                是否存在理赔记录
              </template>
              {{dealerInfo.export_info.pay_log}}
            </el-descriptions-item>
          </el-descriptions>
          <div v-if="dealerInfo.is_delete === false">
            <push-function-btn btn-name="进行额度特批" btn-type="function" size="mini"
                               check-btn="showSpecialQuota" check-role="quotaList" :check-function='showSpecialQuota'
                               params-key='dealerId' :params-value='{"dealerId" : dealerId,
                               "special_quota": dealerInfo.special_quota}'></push-function-btn>

            <push-function-btn btn-name="更改逾期特批" btn-type="replace" size="mini"
                               check-btn="checkOverdueSkip" check-role="quotaList" url="/admin/dealer/dealerOverdueSkip"
                               params-key='dealerId' :params-value='dealerId'></push-function-btn>


            <push-function-btn btn-name="进行账期调整" btn-type="replace" size="mini"
                               check-btn="changeQuotaDay" check-role="quotaList" url="/admin/dealer/changeQuotaDay"
                               params-key='dealerId' :params-value='dealerId'></push-function-btn>

          </div>

        </el-tab-pane>
        <el-tab-pane label="额度变更记录" name="额度变更记录">
          <span style="margin-left: 10px">近10条额度变更记录
          <push-function-btn btn-name="查看额度变更" btn-type="replace" size="mini"
                             check-btn="showQuotaLog" check-role="quotaList" url="/admin/dealer/quotaLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
          </span>
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
        </el-tab-pane>
        <el-tab-pane label="滞纳金变更记录" name="滞纳金变更记录">
          <span style="margin-left: 10px">近10条滞纳金变更记录
          <push-function-btn btn-name="查看滞纳金变更" btn-type="replace" size="mini"
                             check-btn="showOverdueLog" check-role="dealerOverdueList" url="/admin/business/overdueLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
    </span>
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
        </el-tab-pane>
        <el-tab-pane label="发票逾期记录" name="发票逾期记录">
          <span style="margin-left: 10px">
            近10条发票逾期记录
            <push-function-btn btn-name="查看发票逾期" btn-type="replace" size="mini"
                             check-btn="showInvoiceOverdueLog" check-role="dealerOverdueList" url="/admin/business/invoiceOverdueLogs"
                             params-key='dealerId' :params-value='dealerId'></push-function-btn>
          </span>
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
        </el-tab-pane>
        <el-tab-pane label="客户发货情况" name="客户发货情况">
          <span style="margin-left: 10px">
            近10条客户发货情况
            <el-button type="primary" size="mini" @click="showDealerOrderFulfil()">查看客户发货情况</el-button>
          </span>
          <el-table
            :data="dealerInfo.fulfil_info_list"
            border
            style="width: 98%; margin: 1%">
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
              prop="fulfil_sum"
              label="履行单总金额">
            </el-table-column>
            <el-table-column
              prop="fulfil_count"
              label="履行单总数">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="客户回款情况" name="客户回款情况">
          <span style="margin-left: 10px">
            近10条客户回款情况
            <el-button type="primary" size="mini" @click="showDealerOrderInvoice()">查看客户回款情况</el-button>
          </span>
          <el-table
            :data="dealerInfo.order_info_list"
            border
            style="width: 98%; margin: 1%">
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
              prop="invoice_count"
              label="发票总数">
            </el-table-column>
            <el-table-column
              prop="invoice_pay_money"
              label="已结金额">
            </el-table-column>
            <el-table-column
              prop="invoice_no_money"
              label="未结金额">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户操作日志" name="用户操作日志">
          <span style="margin-left: 10px">
            近10条用户操作日志
          <el-button type="primary" size="mini" @click="showDealerOperLogs()">查看用户操作日志</el-button>
          </span>
          <el-table
            :data="dealerInfo.oper_logs.data_list"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="user_name"
              label="操作人"
              width="200">
            </el-table-column>
            <el-table-column
              prop="func_name"
              label="操作功能"
              width="200">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="操作时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="content"
              label="变更内容">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
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
        <el-form-item label="备注信息" prop="info" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showForm=false">关闭</el-button>
        <push-function-btn btn-name="确认特批额度" btn-type="function" size="mini"
                           check-btn="addSpecialQuota" check-role="quotaList" :check-function='addSpecialQuota'
                           params-key='addInfo' :params-value='addForm'></push-function-btn>
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
      activeName: '客户信息',
      dealerId: null,
      dealerInfo: {
        oper_logs: {
          data_list: []
        }
      },
      showForm: false,
      showQuotaForm: false,
      formLabelWidth: '120px',
      addForm: {
        special_quota: 0,
        special_date: '',
        remark: ''
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
          Message.success('成功: 申请审批中')
          return
        }else {
          Message.warning('失败: ' + res.data.data)
          return
        }
      }).catch(res=>{
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showDealerOperLogs: function (){
      var that = this;
      that.$router.push('/admin/dealer/dealerOperLogs?dealerId=' + that.dealerId)
    },
    showDealerOrderInvoice: function () {
      var that = this;
      that.$router.push('/admin/business/orderInvoiceList?dealerId=' + that.dealerId)
    },
    showDealerOrderFulfil: function () {
      var that = this;
      that.$router.push('/admin/business/orderFulfilList?dealerId=' + that.dealerId)
    },
  }
}
</script>

<style scoped>

</style>
