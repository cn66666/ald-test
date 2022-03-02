<template>
  <div>
    <el-table
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
        prop="quota_type"
        label="当前客户类型" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === '新客户'">一年期额度</span>
          <span v-else-if="scope.row.quota_type === '老客户'">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="评级" width="50%">
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
        label="旧额度截止日期"  width="130%">
      </el-table-column>
      <el-table-column
        prop="new_quota"
        label="新赊销额度" width="100%">
        <template slot-scope="scope">
          {{ scope.row.new_quota | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="new_date"
        label="新额度截止日期"  width="130%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'add'">待补充数据</span>
          <span v-else-if="scope.row.state_code === 'have'">已出评分及额度</span>
          <span v-else-if="scope.row.state_code === 'error'">工商数据查询失败</span>
          <span v-else-if="scope.row.state_code === 'unactive'">待激活</span>
          <span v-else-if="scope.row.state_code === 'reckon'">额度计算中</span>
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
      scoreList: [],
      total: 1,
      localPage: 1,
      showIntercept: false,
      formLabelWidth: '120px',
      applyInterceptId: null
    }
  },
  mounted() {
    this.getScoreList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getScoreList();
    },

    getScoreList: function (){
      var that = this;
      that.axios.post('/ald/dealer/score_apply', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.scoreList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
