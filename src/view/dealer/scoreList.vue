<template>
  <div>
    <el-table
      :data="scoreList"
      style="width: 100%">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
      </el-table-column>
      <el-table-column
        prop="quota_type"
        label="当前客户类型" width="150%">
      </el-table-column>
      <el-table-column
        prop="level"
        label="评级" width="150%">
      </el-table-column>
      <el-table-column
        prop="old_quota_money"
        label="旧赊销额度" width="150%">
      </el-table-column>
      <el-table-column
        prop="new_quota_money"
        label="新赊销额度" width="150%">
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="额度日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === '待补充数据'" btn-name="补充数据" btn-type="replace" size="mini"
                             check-btn="addScoreApply" check-role="scoreList" url="/admin/dealer/addScoreApply"
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
