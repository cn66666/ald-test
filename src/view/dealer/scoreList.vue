<template>
  <div>
    <el-row class="filter_row">
      <div style="width: 240px; float:left; margin: 2px;">
        <el-select v-model="queryType.dealerType" placeholder="请选择额度类型" @change="getScoreList()">
          <el-option
            v-for="item in dealerType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div style="width: 240px; float:left; margin: 2px;">
        <el-select v-model="queryType.levelType" placeholder="请选择评级" @change="getScoreList()">
          <el-option
            v-for="item in levelType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div style="width: 240px; float:left; margin: 2px;">
        <el-select v-model="queryType.scoreType" placeholder="请选择状态" @change="getScoreList()">
          <el-option
            v-for="item in scoreType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.oldStartDate" style="float:left;"
                        type="date"
                        placeholder="旧额度起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.oldEndDate" style="float:left;"
                        type="date"
                        placeholder="旧额度截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.newStartDate" style="float:left;"
                        type="date"
                        placeholder="新额度起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.newEndDate" style="float:left;"
                        type="date"
                        placeholder="新额度截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getScoreList()">查询</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="scoreList"
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
        prop=""
        label="客户类型" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_export === false">内销客户</span>
          <span v-else-if="scope.row.is_export === true">出口客户</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_type"
        label="当前额度类型" width="120%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === '新客户'">一年期额度</span>
          <span v-else-if="scope.row.quota_type === '老客户'">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="评级" width="70%">
      </el-table-column>
      <el-table-column
        prop="old_quota"
        label="旧赊销额度" width="100%">
        <template slot-scope="scope">
          {{ scope.row.old_quota | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="old_date"
        label="旧额度截止日期" width="140%">
      </el-table-column>
      <el-table-column
        prop="new_quota"
        label="新赊销额度" width="140%">
        <template slot-scope="scope">
          {{ scope.row.new_quota | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="new_date"
        label="新额度截止日期"  width="140%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="130%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'add'">待补充数据</span>
          <span v-else-if="scope.row.state_code === 'have'">已出评分及额度</span>
          <span v-else-if="scope.row.state_code === 'error'">评分卡计算失败</span>
          <span v-else-if="scope.row.state_code === 'unactive'">待激活</span>
          <span v-else-if="scope.row.state_code === 'reckon'">额度计算中</span>
          <span v-else-if="scope.row.state_code === 'activeing'">激活中</span>
          <span v-else-if="scope.row.state_code === 'active_error'">激活失败</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === 'add'" btn-name="补充数据" btn-type="replace" size="mini"
                             check-btn="addScoreApply" check-role="scoreList" url="/admin/dealer/addScoreApply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'have'" btn-name="审批通过" btn-type="reload" size="mini"
                             check-btn="scoreActive" check-role="scoreList" url="/ald/dealer/score_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'error'" btn-name="重新生成" btn-type="reload" size="mini"
                             check-btn="againScore" check-role="scoreList" url="/ald/dealer/again_score"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'add' && scope.row.back === true" btn-name="退回" btn-type="reload" size="mini"
                             check-btn="resetScore" check-role="scoreList" url="/ald/dealer/reset_score"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'active_error'" btn-name="重新激活" btn-type="reload" size="mini"
                             check-btn="resetActive" check-role="scoreList" url="/ald/dealer/reset_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <el-button type="primary" size="mini" v-if="scope.row.quota_type === '老客户' && user==='张凯'" @click="resetScore(scope.row.dealer_id)">强制退回</el-button>

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

export default {
  name: "scoreList",
  components: {PushFunctionBtn},
  data() {
    return {
      scoreList: [
        {'id': 2, 'dealer_id': 11, 'company_code': 'C000524', 'company_name': 'C000524 天津市华明宇功商贸有限公司', 'quota_type': '老客户', 'old_quota': '', 'new_quota': '', 'level': '', 'new_date': '', 'old_date': '', 'state_code': 'add', 'is_export': false, 'back': true}, {'id': 1, 'dealer_id': 9, 'company_code': 'C000515', 'company_name': 'C000515 苏九精料零售', 'quota_type': '老客户', 'old_quota': '', 'new_quota': '', 'level': '', 'new_date': '', 'old_date': '', 'state_code': 'add', 'is_export': false, 'back': true}],
      total: 1,
      localPage: 1,
      showIntercept: false,
      formLabelWidth: '120px',
      applyInterceptId: null,
      user: localStorage.getItem('userName'),
      queryType: {},
      dealerType: [
        {'type': '全部', 'query': ''},
        {'type': '一年期额度', 'query': '新客户'},
        {'type': '长期额度', 'query': '老客户'},
      ],
      scoreType: [
        {'type': '全部', 'query': ''},
        {'type': '待补充数据', 'query': 'add'},
        {'type': '已出评分及额度', 'query': 'have'},
        {'type': '评分卡计算失败', 'query': 'error'},
        {'type': '待激活', 'query': 'unactive'},
        {'type': '额度计算中', 'query': 'reckon'},
        {'type': '激活中', 'query': 'activeing'},
        {'type': '激活失败', 'query': 'active_error'},
      ],
      levelType: [
        {'type': '全部', 'query': ''},
        {'type': 'A', 'query': 'A'},
        {'type': 'B', 'query': 'B'},
        {'type': 'C', 'query': 'C'},
        {'type': 'D', 'query': 'D'},
        {'type': 'E', 'query': 'E'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getScoreList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getScoreList();
    },

    getScoreList: function (){
      var that = this;
      that.axios.post('/ald/dealer/score_apply', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.scoreList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },

    resetScore: function (dealerId){
      var that = this;
      that.axios.post('/ald/dealer/force_reset_score', {'dealerId': dealerId,}).then(res=>{
        this.getScoreList();
      }).catch(res=>{
      })
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      console.log(data)
      that.axios({
        method: "get",
        url: '/ald/downloads/scoreList?' + data + '&timestamp=' + new Date().getTime(),
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '客户评分卡申请.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
