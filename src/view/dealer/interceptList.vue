<template>
  <div>
    <el-table
      :data="interceptList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
            <el-button type="text" >{{scope.row.company_name}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="拦截原因" width="500%">
        <template slot-scope="scope">
          <span v-if="scope.row.intercept_reason['manual'] === true">存在手动拦截:{{scope.row.intercept_reason['manual_info']}}</span>
          <span v-if="scope.row.intercept_reason['law'] === true">存在司法诉讼拦截</span>
          <span v-if="scope.row.intercept_reason['overdue_30'] !== 0">逾期30天以上存在{{scope.row.intercept_reason['overdue_30']}}次</span>
          <span v-if="scope.row.intercept_reason['overdue_90'] !== 0">逾期90天以上存在{{scope.row.intercept_reason['overdue_90']}}次</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="拦截状态" width="100%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="普通移出" btn-type="reload" size="mini"
                             check-btn="removeIntercept" check-role="interceptList" url="/ald/dealer/remove_intercept"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn btn-name="特殊移出" btn-type="reload" size="mini"
                             check-btn="removeSpecialIntercept" check-role="interceptList" url="/ald/dealer/special_remove_intercept"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";

export default {
  name: "interceptList",
  components: {PushFunctionBtn},
  data() {
    return {
      interceptList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
    }
  },
  mounted() {
    this.getInterceptList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getInterceptList();
    },
    getInterceptList: function (){
      var that = this;
      that.axios.post('/ald/dealer/intercept_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data.data_list;
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
