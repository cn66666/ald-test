<template>
  <div>
    <el-table
      :data="dealerList"
      style="width: 100%"
      :default-sort = "{prop: 'limit_date', order: 'descending'}">
      <el-table-column
        prop="company_name"
        label="经销商名称" width="200%">
      </el-table-column>
      <el-table-column
        prop="limit_type"
        label="额度类型" width="150%">
        <template slot-scope="scope">
          <span v-if="scope.row.quota_type === false">一年期额度</span>
          <span v-else-if="scope.row.quota_type === true">长期额度</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_used"
        label="已用额度" width="150%">
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="赊销额度" width="150%">
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="额度截止日期"  width="150%"
        sortable>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.state_code === 'activate'">额度已激活</span>-->
<!--          <span v-else-if="scope.row.state_code === 'reckon'">额度升级中</span>-->
<!--          <span v-else-if="scope.row.state_code === 'stop'">额度已禁用</span>-->
<!--          <span v-else>-</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state_code === 'activate'" size="mini" round @click="">拉入拦截清单</el-button>
          <el-button v-if="scope.row.state_code === 'stop'" size="mini" round @click="">查询禁用原因</el-button>
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
export default {
  name: "quotaList",
  data() {
    return {
      dealerList: [],
      total: 1,
      localPage: 1,
    }
  },
  mounted() {
    this.getQuotaList()
  },
  methods: {
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerList();
    },
    getQuotaList: function (){
      var that = this;
      that.axios.post('/ald/dealer/quota_list', {'page': that.localPage,}).then(res=>{
        if (res.data.code=='ok'){
          that.dealerList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    changeDealerInfo: function (dealerId){
      var that = this;
      that.$router.push('/admin/dealer/addDealer?dealerId=' + dealerId)
    },
    dealerInfoApply: function (dealerId){
      var that = this;
      that.axios.post('/ald/dealer/dealer_apply', {'dealerId': dealerId,}).then(res=>{
        if (res.data.code=='ok'){
          this.getDealerList()
        }else {
          this.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    specialApply:function (dealerId){
      var that = this;
      that.$router.push('/admin/dealer/specialApply?dealerId=' + dealerId)
    }
  }
}
</script>

<style scoped>

</style>
