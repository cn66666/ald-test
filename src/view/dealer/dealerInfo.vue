<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="padding-left: 15px; padding-top: 15px">
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
            <el-descriptions-item>
              <template slot="label">
                质保金
              </template>
              <span>{{dealerInfo.warranty}}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                质保金结算条款
              </template>
              <span>{{dealerInfo.memo}}</span>
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
            <el-button v-if="dealerInfo.state_code !== 'apply'" type="primary" size="mini" @click="showSpecialForm = true" :disabled="dealerInfo.oa_apply">进行额度特批</el-button>

            <el-button v-if="dealerInfo.state_code !== 'apply'" type="primary" size="mini" @click="showOverdueForm = true" :disabled="dealerInfo.oa_apply">更改逾期特批</el-button>

            <el-button v-if="dealerInfo.quota_type === '老客户' && dealerInfo.state_code !== 'apply'" type="primary" size="mini" @click="getQuotaDay()" :disabled="dealerInfo.oa_apply">进行账期调整</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="额度变更记录" name="额度变更记录">
          <span style="margin-left: 10px">共{{dealerInfo.quota_log_count}}条额度变更记录
          <no-permission-btn btn-name="查看额度变更" btn-type="replace_new" size="mini"
                             check-role="quotaList" url="/admin/dealer/quotaLogs"
                             params-key='dealerId' :params-value='dealerId'></no-permission-btn>
          </span>
          <el-table
            :data="dealerInfo.quota_log"
            style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
            <el-table-column
              prop="change_quota" width="150%"
              label="剩余金额">
            </el-table-column>
            <el-table-column
              prop="change_money" width="150%"
              label="发生金额">
              <template slot-scope="scope">
                <span v-if="scope.row.state_code === '+'">+{{ scope.row.change_money }}</span>
                <span v-else-if="scope.row.state_code === '-'">-{{ scope.row.change_money }}</span>
                <span v-else>{{ scope.row.change_money }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="state_code" width="100%"
              label="变更类型">
              <template slot-scope="scope">
                <span v-if="scope.row.state_code === '+'">返还</span>
                <span v-else-if="scope.row.state_code === '-'">占用</span>
                <span v-else>调整</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="发生时间">
            </el-table-column>
            <el-table-column
              prop="change_type"
              label="单据类型">
            </el-table-column>
            <el-table-column
              prop="change_code"
              label="单据号">
            </el-table-column>
            <el-table-column
              prop="change_info"
              label="变更信息">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="滞纳金变更记录" name="滞纳金变更记录">
          <span style="margin-left: 10px">共{{dealerInfo.overdue_log_count}}条滞纳金变更记录
            <no-permission-btn btn-name="查看滞纳金变更" btn-type="replace_new" size="mini"
                               check-role="dealerOverdueList" url="/admin/business/overdueLogs"
                               params-key='dealerId' :params-value='dealerId'></no-permission-btn>
          </span>
          <el-table
            :data="dealerInfo.overdue_log"
            style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
            <el-table-column
              prop="invoice_code"
              label="开票号码">
            </el-table-column>
            <el-table-column
              prop="change_money"
              label="发生金额">
            </el-table-column>
            <el-table-column
              prop="change_info"
              label="变更信息">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="发生时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="发票逾期记录" name="发票逾期记录">
          <span style="margin-left: 10px">
            共{{dealerInfo.invoice_log_count}}条发票逾期记录
            <no-permission-btn btn-name="查看发票逾期" btn-type="replace_new" size="mini" check-role="dealerOverdueList"
                               url="/admin/business/invoiceOverdueLogs"
                             params-key='dealerId' :params-value='dealerId'></no-permission-btn>
          </span>

          <el-table
            :data="dealerInfo.invoice_log"
            style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
            <el-table-column
              prop="order_code"
              label="销售单号" width="150%">
            </el-table-column>
            <el-table-column
              prop="invoice_code"
              label="发票文件号码">
            </el-table-column>
            <el-table-column
              prop="invoice_date"
              label="开票日期">
            </el-table-column>
            <el-table-column
              prop="invoice_state"
              label="开票状态">
            </el-table-column>
            <el-table-column
              prop="invoice_money"
              label="开票金额">
              <template slot-scope="scope">
                {{ scope.row.invoice_money | moneyFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pay_money"
              label="已付金额">
              <template slot-scope="scope">
                {{ scope.row.pay_money | moneyFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="no_money"
              label="未付金额">
              <template slot-scope="scope">
                {{ scope.row.no_money | moneyFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="due_date"
              label="到期日期">
            </el-table-column>
            <el-table-column
              prop="late_day"
              label="逾期天数">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="客户发货情况" name="客户发货情况">
          <span style="margin-left: 10px">
            共{{dealerInfo.fulfil_info_count}}条客户发货情况
          <no-permission-btn btn-name="查看客户发货情况" btn-type="replace_new" size="mini" check-role="quotaList"
                             url="/admin/business/orderFulfilList"
                             params-key='dealerId' :params-value='dealerId'></no-permission-btn>
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
            共{{dealerInfo.order_info_count}}条客户回款情况
          <no-permission-btn btn-name="查看客户回款情况" btn-type="replace_new" size="mini" check-role="quotaList"
                             url="/admin/business/orderInvoiceList"
                             params-key='dealerId' :params-value='dealerId'></no-permission-btn>
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
        <el-tab-pane label="最新评分卡解析" name="最新评分卡解析">
          <el-table
            class="info_table"
            :span-method="objectSpanMethod"
            :data="dealerInfo.analysis_score"
            style="width: 98%; margin: 0 1%" :empty-text="scoreText">
            <el-table-column
              prop="class"
              label="分类"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="type"
              label="项目"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="analysis"
              label="评价"
              width="200px">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="用户操作日志" name="用户操作日志">
          <span style="margin-left: 10px">
            共{{dealerInfo.oper_logs_count}}条用户操作日志
          <no-permission-btn btn-name="查看用户操作日志" btn-type="replace_new" size="mini" check-role="quotaList"
                             url="/admin/dealer/dealerOperLogs"
                             params-key='dealerId' :params-value='dealerId'></no-permission-btn>
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
    <el-dialog title="进行特批额度" :visible.sync="showSpecialForm" width="30%">
      <el-form>
        <el-form-item label="特批额度" label-width="150px">
          <el-input v-model="addSpecialForm.special_quota" style="width: 70%">
            <template slot="append">万元</template></el-input>
        </el-form-item>
        <el-form-item label="特批结束日期" prop="special_date" label-width="150px">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 70%"
                          v-model="addSpecialForm.special_date"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注信息" prop="info" label-width="150px">
          <el-input v-model="addSpecialForm.remark" style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showSpecialForm=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="addSpecialQuota()">确认提交申请</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更改逾期特批" :visible.sync="showOverdueForm" width="30%">
      <el-form>
        <el-form-item label="发票逾期校验" label-width="150px">
          <el-select v-model="addOverdueForm.isSkip" placeholder="请选择" style="width: 70%" @change="chooseisSkipFunction()">
            <el-option label="不跳过" value='0'></el-option>
            <el-option label="跳过" value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最长逾期天数" label-width="150px">
          <el-input v-model="addOverdueForm.maxDay" type="number" min="0"  style="width: 70%" :disabled="isSkipDisabled"></el-input>
        </el-form-item>
        <el-form-item label="小额逾期豁免" label-width="150px">
          <el-select v-model="addOverdueForm.isClose" placeholder="请选择" style="width: 70%" @change="chooseisCloseFunction()" :disabled="isSkipDisabled">
            <el-option label="关闭" value='0'></el-option>
            <el-option label="开启" value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期金额下限" label-width="150px">
          <el-input v-model="addOverdueForm.minMoney" type="number" min="1"  style="width: 70%" :disabled="isCloseDisabled"><template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="逾期金额门槛比例" label-width="150px">
          <el-input v-model="addOverdueForm.minMoneyRate" type="number" min="0" max="100" style="width: 70%" :disabled="isCloseDisabled"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="150px">
          <el-input v-model="addOverdueForm.remark"  style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showOverdueForm=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="defaultSetting()">默认配置</el-button>
        <el-button type="primary" size="mini" @click="saveSetting()">确认提交申请</el-button>
      </div>
    </el-dialog>
    <el-dialog title="进行账期调整" :visible.sync="showQuotaDayForm" width="30%">
      <el-form>
        <el-form-item label="ERP账期" label-width="150px">
          <el-input v-model="quotaDayInfo.erpDay" :disabled="change" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="ALD推荐账期" label-width="150px">
          <el-input v-model="quotaDayInfo.aldDay" :disabled="change" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="客户当前额度" label-width="150px">
          <el-input v-model="quotaDayInfo.quota" :disabled="change" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="调整账期" label-width="150px">
          <el-input v-model="quotaDayInfo.reckonDay" type="number" min="1"  style="width: 70%">
            <template slot="append">天</template></el-input>
        </el-form-item>
        <el-form-item label="试算额度结果" label-width="150px">
          <el-input v-model="quotaDayInfo.reckonQuota" :disabled="change" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="150px">
          <el-input v-model="quotaDayInfo.remark"  style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showQuotaDayForm=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="reckonQuotaDay()">额度试算</el-button>
        <el-button type="primary" size="mini" @click="changeQuotaDay()">确认提交申请</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import noPermissionBtn from "../../components/noPermissionBtn";
import { Message } from 'element-ui';
export default {
  name: "dealerInfo",
  components: {noPermissionBtn},
  data() {
    return {
      activeName: '客户信息',
      dealerId: null,
      dealerInfo: {
        oper_logs: {
          data_list: []
        }
      },
      showOverdueForm: false,
      showSpecialForm: false,
      showQuotaDayForm: false,
      formLabelWidth: '120px',
      addSpecialForm: {
        special_quota: 0,
        special_date: '',
        remark: ''
      },
      spanArr: [],
      scoreText: '',
      addOverdueForm: {
        isSkip: '0',
        maxDay: 30,
        isClose: '1',
        minMoney: 100000,
        minMoneyRate: 5,
        remark: ''
      },
      isSkipDisabled: false,
      isCloseDisabled: false,
      quotaDayInfo: {
        erpDay: '-',
        aldDay: '-',
        quota: '-',
        reckonDay: 1,
        reckonQuota: '-',
        remark: ''
      },
      change: true,
      reckon: false,
      update: false
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getDealerInfo('客户信息')
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDealerInfo: function (tab_name){
      var that = this;
      that.axios.post('/ald/dealer/dealer_info', {'dealerId': that.dealerId, 'tabName': tab_name}).then(res=>{
        if (res.data.code==='ok'){
          that.dealerInfo = res.data.data
          if (tab_name === '最新评分卡解析'){
            that.spanArr = []
            let contactDot = 0;
            that.dealerInfo.analysis_score.forEach( (item,index) => {
              //遍历tableData数据，给spanArr存入一个1，第二个item.id和前一个item.id是否相同，相同就给
              //spanArr前一位加1，spanArr再存入0，因为spanArr为n的项表示n项合并，为0的项表示该项不显示,后面有spanArr打印结果
              if(index===0){
                that.spanArr.push(1)
              }else{
                if(item.class === this.dealerInfo.analysis_score[index-1].class){
                  that.spanArr[contactDot] += 1;
                  that.spanArr.push(0)
                }else{
                  contactDot = index
                  that.spanArr.push(1)
                }
              }
            })
          }
          if (tab_name === '客户信息'){
            if (that.dealerInfo.is_delete === true){
              that.scoreText = '已注销客户无评分卡'
            } else if (that.dealerInfo.quota_type === '新客户'){
              that.scoreText = '一年期客户无评分卡'
            } else {
              that.scoreText = '无最新评分卡数据'
            }
            that.getSetting()
          }
        }
      }).catch(res=>{
      })
    },
    addSpecialQuota: function (){
      var that = this;
      var special_quota = that.addSpecialForm.special_quota
      var special_date = that.addSpecialForm.special_date
      if (special_quota === '') {
        Message.warning('失败: 请填写正确的特批额度')
        return
      } else {
        if (special_quota !== '') {
          try {
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
      that.axios.post('/ald/dealer/add_special_quota', {'addForm': that.addSpecialForm, 'dealerId': that.dealerId}).then(res=>{
        that.showSpecialForm = false
        if (res.data.code==='ok'){
          that.open('申请已发送至OA系统，请等待OA系统审批', '申请成功')
        }else {
          that.open('失败: ' + res.data.data, '申请失败')
        }
      }).catch(res=>{
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if(columnIndex === 0){
        const _row = this.spanArr[rowIndex]
        const _col = _row>0?1:0;
        //该形式为行合并
        return{
          rowspan:_row,
          colspan:_col
        }
      }
    },
    handleClick(tab, event) {
      var that = this;
      that.getDealerInfo(tab.name)
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
    toDealerOverdueSkip: function (){
      var that = this;
      that.$router.push('/admin/dealer/dealerOverdueSkip?dealerId=' + that.dealerId)
    },
    toChangeQuotaDay: function (){
      var that = this;
      that.$router.push('/admin/dealer/changeQuotaDay?dealerId=' + that.dealerId)
    },

    defaultSetting: function (){
      var that = this;
      that.addOverdueForm = {
        isSkip: '0',
        maxDay: 30,
        isClose: '1',
        minMoney: 100000,
        minMoneyRate: 5,
        remark: ''
      }
    },
    getSetting: function (){
      var that = this;
      that.axios.post('/ald/dealer/get_overdue_setting', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code==='ok'){
          var settings = res.data.data
          if (settings['isSkip'] === false){
            settings['isSkip'] = '0'
            that.isCloseDisabled = false
          } else {
            settings['isSkip'] = '1'
            that.isCloseDisabled = true
          }
          if (settings['isClose'] === false){
            settings['isClose'] = '0'
            that.isSkipDisabled = true
          } else {
            settings['isClose'] = '1'
            that.isSkipDisabled = false
          }
          that.addOverdueForm = settings
        }else {
          that.defaultSetting()
          that.chooseisSkipFunction()
          that.chooseisCloseFunction()
        }
      }).catch(res=>{
      })
    },
    saveSetting: function (){
      var that = this;
      var settings = {
        isSkip: that.addOverdueForm.isSkip,
        maxDay: that.addOverdueForm.maxDay,
        isClose: that.addOverdueForm.isSkip,
        minMoney: that.addOverdueForm.minMoney,
        minMoneyRate: that.addOverdueForm.minMoneyRate,
        remark: that.addOverdueForm.remark
      }
      if (that.addOverdueForm.isSkip === '0'){
        settings.isSkip = false
      } else {
        settings.isSkip = true
      }
      if (that.addOverdueForm.isClose === '0'){
        settings.isClose = false
      } else {
        settings.isClose = true
      }
      that.axios.post('/ald/dealer/save_overdue_setting', {'dealerId': that.dealerId,
        'setting': settings}).then(res=>{
        that.showOverdueForm = false
        if (res.data.code==='ok'){
          that.open('申请已发送至OA系统，请等待OA系统审批', '申请成功')
        }else {
          that.open('失败: ' + res.data.data, '申请失败')
        }
      }).catch(res=>{
      })
    },
    chooseisSkipFunction: function () {
      var that = this;
      if (that.addOverdueForm.isSkip === '0'){
        that.isSkipDisabled = false
      }else {
        that.isSkipDisabled = true
        that.addOverdueForm.isClose = '0'
        that.chooseisCloseFunction()
      }
    },
    chooseisCloseFunction: function () {
      var that = this;
      if (that.addOverdueForm.isClose === '0'){
        that.isCloseDisabled = true
      }else {
        that.isCloseDisabled = false
      }
    },
    getQuotaDay: function (){
      var that = this;
      that.axios.post('/ald/dealer/get_quota_day', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code==='ok'){
          that.quotaDayInfo.erpDay = res.data.data.erp_day
          that.quotaDayInfo.aldDay = res.data.data.ald_day
          that.quotaDayInfo.quota = res.data.data.quota
          that.reckon = true
          that.showQuotaDayForm = true
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },
    reckonQuotaDay: function (){
      var that = this;
      if (that.reckon === true){
        that.axios.post('/ald/dealer/reckon_quota_day', {'dealerId': that.dealerId, 'reckonDay': that.quotaDayInfo.reckonDay}).then(res=>{
          if (res.data.code==='ok'){
            that.quotaDayInfo.reckonQuota = res.data.data
            that.update = true
          }else {
            Message.warning('失败: ' + res.data.data)
          }
        }).catch(res=>{
        })
      }
    },
    changeQuotaDay: function () {
      var that = this;
      if (that.update === true){
        that.axios.post('/ald/dealer/change_quota_day', {'dealerId': that.dealerId, 'reckonDay': that.quotaDayInfo.reckonDay,
          'remark': that.quotaDayInfo.remark}).then(res=>{
          that.showQuotaDayForm = false
          if (res.data.code==='ok'){
            that.update = false
            that.open('申请已发送至OA系统，请等待OA系统审批', '申请成功')
          }else {
            that.open('失败: ' + res.data.data, '申请失败')
          }
        }).catch(res=>{
        })
      } else {
        Message.warning('失败: 请先进行试算')
      }
    },
    open(message, title) {
      this.$alert(message, title, {
        confirmButtonText: '关闭',
        callback: action => {
          location.reload()
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
