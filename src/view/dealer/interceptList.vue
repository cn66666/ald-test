<template>
  <div>
    <el-table
      :data="interceptList"
      style="width: 100%"
      :default-sort = "{prop: 'intercept_date', order: 'descending'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
      </el-table-column>
      <el-table-column
        prop="intercept_date"
        label="拦截日期"  width="150%"
        sortable>
      </el-table-column>
      <el-table-column
        prop="intercept_cause"
        label="拦截原因" width="300%">
        <template slot-scope="scope">
          <span v-for="item in scope.row.intercept_cause" :key="item">item</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="拦截状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'lose'">拦截原因失效</span>
          <span v-else-if="scope.row.state_code === 'stop'">拦截中</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === 'lose'" btn-name="普通移出" btn-type="" size="mini"
                             check-btn="" check-role="" url=""
                             params-key='' :params-value='a'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'lose' || scope.row.state_code === 'stop'" btn-name="特殊移出" btn-type="" size="mini"
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
