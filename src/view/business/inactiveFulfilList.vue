<template>
  <div>
    <el-page-header @back="goBack" content="履行单通过清单" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-table
      :data="fulfilList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="apply_id"
        label="fid" width="50%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id' target="_blank">
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
        <template slot-scope="scope">
          <router-link :to='"/admin/business/fulfilInfo?orderId=" + scope.row.order_id'>
            <el-button type="text" >{{scope.row.order_code}}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="fulfil_code"
        label="履行单号" width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="履行单状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'ok'">成功</span>
          <span v-else>{{scope.row.state_code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行金额" width="200%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "inactiveFulfilList",
  components: {PushFunctionBtn},
  data() {
    return {
      fulfilList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: [],
      dealerId: ''
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getFulfilList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getFulfilList();
    },
    getFulfilList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_apply', {'page': that.localPage, 'dealerId': that.dealerId}).then(res=>{
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
