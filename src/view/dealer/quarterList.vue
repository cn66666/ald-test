<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.stateType" style="width: 200px;" placeholder="请选择状态">
          <el-option
            v-for="item in stateType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小旧额度" v-model="queryType.minOldQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大旧额度" v-model="queryType.maxOldQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小新额度" v-model="queryType.minNewQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大新额度" v-model="queryType.maxNewQuota" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="起始生效日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="截止生效日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getQuarterList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
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
          <span v-else-if="scope.row.state_code === 'unactive'">季度调额待激活</span>
          <span v-else-if="scope.row.state_code === 'reckon'">季度调额计算中</span>
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
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
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
      changeDate: '',
      queryType: {
      },
      stateType: [
        {'type': '全部', 'query': ''},
        {'type': '季度调额待审批', 'query': 'approval'},
        {'type': '季度调额待激活', 'query': 'unactive'},
        {'type': '季度调额计算中', 'query': 'reckon'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getQuarterList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getQuarterList();
    },
    getQuarterList: function (){
      var that = this;
      that.axios.post('/ald/dealer/quarter_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
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
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '客户季度调额' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/quarterList?' + data + '&timestamp=' + new Date().getTime(),
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
