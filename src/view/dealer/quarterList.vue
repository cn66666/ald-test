<template>
  <div>
    <el-table
      :data="quarterList"
      style="width: 100%"
      :default-sort = "{prop: 'intercept_date', order: 'descending'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
      </el-table-column>
      <el-table-column
        prop="quota_type"
        label="当前额度类型" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === false">一年期额度</span>
          <span v-else-if="scope.row.quota_type === true">长期额度</span>
          <span v-else>-</span>
        </template>
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
        prop="state_code"
        label="状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === ''"></span>
          <span v-else-if="scope.row.state_code === ''"></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === ''" btn-name="" btn-type="" size="mini"
                             check-btn="" check-role="" url=""
                             params-key='' :params-value='a'></push-function-btn>

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
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerList();
    },
  }
}
</script>

<style scoped>

</style>
