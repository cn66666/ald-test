<template>
  <div>
    <el-table
      :data="fulfilList"
      style="width: 100%">
      <el-table-column
        prop="apply_id"
        label="fid" width="50%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
      </el-table-column>
      <el-table-column
        prop="fulfil_code"
        label="履行单号" width="200%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="履行单状态" width="100%">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行金额" width="150%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期">
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
  name: "fulfilList",
  components: {PushFunctionBtn},
  data() {
    return {
      fulfilList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: []
    }
  },
  mounted() {
    this.getFulfilList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getFulfilList();
    },
    handleCheckedChange(value) {
      this.selectList = value;
    },
    getFulfilList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.fulfilList = res.data.data.data_list;
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
