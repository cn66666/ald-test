<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="margin: 1%">
    </el-page-header>
    <el-row class="filter_row">
      <el-select v-model="info.state_code" placeholder="请选择" @change="getQuotaLogs">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="change_money" width="150%"
        label="发生金额">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === '+'">+{{ scope.row.change_money }}</span>
          <span v-else-if="scope.row.state_code === '-'">-{{ scope.row.change_money }}</span>
          <span v-else>{{ scope.row.change_money }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code" width="100%"
        label="变更类型">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === '+'">返还</span>
          <span v-else-if="scope.row.state_code === '-'">占用</span>
          <span v-else>调整</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="发生时间">
      </el-table-column>
      <el-table-column
        prop="change_code"
        label="单据号">
      </el-table-column>
      <el-table-column
        prop="change_info"
        label="变更信息">
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "quotaLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      info: {'state_code': null, 'dealer_id': null},
      showInfo: false,
      options: [{
        value: '+',
        label: '返还'
      }, {
        value: '-',
        label: '占用'
      }, {
        value: '=',
        label: '调整'
      }],
    }
  },
  mounted() {
    var that = this;
    that.info.dealer_id = this.$route.query.dealerId;
    this.getQuotaLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getScoreLogs();
    },
    getQuotaLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/quota_logs', {'page': that.localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
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
