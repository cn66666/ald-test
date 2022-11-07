<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.companyType" style="width: 200px;" placeholder="请选择额度类型" @change="getQuotaList()">
          <el-option
            v-for="item in dealerType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小总额度" v-model="queryType.minQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大总额度" v-model="queryType.maxQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小已用额度" v-model="queryType.minUsedQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大已用额度" v-model="queryType.maxUsedQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小剩余额度" v-model="queryType.minLastQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大剩余额度" v-model="queryType.maxLastQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="额度截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="额度截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小逾期天数" v-model="queryType.minDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大逾期天数" v-model="queryType.maxDay" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getQuotaList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="quotaList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="客户类型" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_export === false">内销客户</span>
          <span v-else-if="scope.row.is_export === true">出口客户</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="limit_type"
        label="额度类型" width="90%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === '新客户'">一年期额度</span>
          <span v-else-if="scope.row.quota_type === '老客户'">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="总额度(万元)" width="120%">
        <template slot-scope="scope">
          {{ scope.row.quota_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_used"
        label="已用额度(万元)" width="120%">
        <template slot-scope="scope">
          {{ scope.row.quota_used | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_balance"
        label="剩余额度(万元)" width="120%">
        <template slot-scope="scope">
          {{ scope.row.quota_balance | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="额度截止日期"  width="100%">
      </el-table-column>
      <el-table-column
        prop="late_day"
        label="累计逾期"  width="90%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="80%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'active'">已激活</span>
          <span v-else-if="scope.row.state_code === 'intercept'">已拦截</span>
          <span v-else-if="scope.row.state_code === 'unactive'">待激活</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <noPermissionBtn v-if="scope.row.state_code === 'active'" btn-name="拉入拦截清单" btn-type="function" size="mini"
                           :check-function='showAddIntercept' params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
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
        <noPermissionBtn btn-name="确认拦截" btn-type="function" size="mini" :check-function='activeInterceptDealer'
                           params-key='dealerId' :params-value='interceptDealerId'></noPermissionBtn>
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
import noPermissionBtn from "../../components/noPermissionBtn";
import {Message} from "element-ui";
export default {
  name: "quotaList",
  components: {noPermissionBtn},
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
      changeDate: '',
      queryType: {},
      dealerType: [
        {'type': '全部', 'query': ''},
        {'type': '一年期额度', 'query': '新客户'},
        {'type': '长期额度', 'query': '老客户'},
      ],
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
      that.axios.post('/ald/dealer/quota_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
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
          Message.warning('错误: 请填写拦截原因')
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
    },
    numberInput:function (e) {
      e.returnValue=/\d/.test(e.key)
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '客户额度清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/quotaList?' + data + '&timestamp=' + new Date().getTime(),
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
>>> .el-input__inner{
  height: 36px;
}
</style>
