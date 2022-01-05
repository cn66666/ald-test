<template>
  <div>
    <el-table
      :data="overdueList"
      style="width: 100%">
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
        prop="overdue_money"
        label="累计滞纳金" width="200%">
      </el-table-column>
      <el-table-column
        prop="unpaid_money"
        label="未缴滞纳金" width="150%">
      </el-table-column>
      <el-table-column
        prop="paid_money"
        label="已缴滞纳金" width="200%">
      </el-table-column>
      <el-table-column
        prop="free_money"
        label="已免除滞纳金" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="逾期明细" btn-type="replace" size="mini"
                             check-btn="invoiceOverdue" check-role="dealerOverdueList" url="/admin/business/invoiceOverdueList"
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
  name: "overdueList",
  components: {PushFunctionBtn},
  data() {
    return {
      overdueList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
    }
  },
  mounted() {
    this.getDealerOverdueList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerOverdueList();
    },
    getDealerOverdueList: function (){
      var that = this;
      that.axios.post('/ald/business/overdue_list', {'page': that.localPage}).then(res=>{
        if (res.data.code=='ok'){
          that.overdueList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    }
  }
}
</script>

<style scoped>

</style>
