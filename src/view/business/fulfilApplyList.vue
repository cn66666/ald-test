<template>
  <div>
    <el-table
      :data="applyList"
      style="width: 100%">
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行金额" width="150%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="拦截原因">
        <template slot-scope="scope">
          <p v-for="item  in scope.row.intercept_info">
            {{ item }}
          </p>
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
  name: "fulfilApplyList",
  components: {PushFunctionBtn},
  data() {
    return {
      applyList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: []
    }
  },
  mounted() {
    this.getFulfilApplyList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getFulfilApplyList();
    },
    getFulfilApplyList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_apply', {'page': that.localPage, 'stateCode': '未通过'}).then(res=>{
        if (res.data.code=='ok'){
          that.applyList = res.data.data.data_list;
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
