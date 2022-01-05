<template>
  <div>
    <el-table
      :data="quarterList"
      style="width: 100%">
      <el-table-column
        prop="company_name"
        label="客户名称" width="300%">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="old_quota"
        label="旧赊销额度" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="新赊销额度" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.busy_quota !== 0">{{scope.row.busy_quota}}</span>
          <span v-else>{{scope.row.new_quota}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === '季度调额待审批' && scope.row.busy_quota === 0" btn-name="通过审批" btn-type="reload" size="mini"
                             check-btn="quotaActive" check-role="quarterList" url="/ald/dealer/quarter_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '季度调额待审批' && scope.row.busy_quota !== 0" btn-name="通过淡旺季审批" btn-type="reload" size="mini"
                             check-btn="busyQuotaActive" check-role="quarterList" url="/ald/dealer/quarter_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === '季度调额待审批' && scope.row.busy_quota !== 0" btn-name="拒绝淡旺季审批" btn-type="reload" size="mini"
                             check-btn="busyQuotaUnactive" check-role="quarterList" url="/ald/dealer/quarter_unactive"
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
  name: "quarterList",
  components: {PushFunctionBtn},
  data() {
    return {
      quarterList: [],
      total: 1,
      localPage: 1,
      showIntercept: false,
      formLabelWidth: '120px',
      applyInterceptId: null
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
  }
}
</script>

<style scoped>

</style>
