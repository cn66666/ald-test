<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="info.companyName">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary">查询</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="370%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="business_leader"
        label="业务负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="order_leader"
        label="跟单负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="finance_leader"
        label="财务负责人"
        width="200">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button style="width: 100px" type="primary" size="mini" @click="pushDailyNoticeConfig(scope.row.id)">日报配置</el-button>
          <el-button style="width: 100px" type="primary" size="mini" @click="pushNoticeUserConfig(scope.row.id)">负责人配置</el-button>
          <el-button style="width: 100px" type="primary" size="mini">日志</el-button>
        </template>
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
  name: "noticeList",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      info: {'companyName': ''},
    }
  },
  mounted() {
    var that = this;
    that.getNoticeList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getNoticeList();
    },
    getNoticeList: function (){
      var that = this;
      that.axios.post('/ald/notice/notice_list', {'page': that.localPage, 'info': that.info}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    pushDailyNoticeConfig: function (dealerId) {
      var that = this;
      that.$router.push('/admin/user/dailyNoticeConfig?dealerId=' + dealerId)
    },
    pushNoticeUserConfig: function (dealerId) {
      var that = this;
      that.$router.push('/admin/user/noticeUserConfig?dealerId=' + dealerId)
    }
  }
}
</script>

<style scoped>

</style>
