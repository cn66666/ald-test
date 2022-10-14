<template>
  <div>
    <el-page-header @back="goBack" :content=content style="margin: 1%">
    </el-page-header>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.sendType" placeholder="请选择消息类型">
          <el-option
            v-for="item in sendTypeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getNoticeLogList()">查询</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="send_type"
        label="消息类型" width="150">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="发送时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="send_name"
        label="通知对象"
        width="300">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容">
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
  name: "noticeLogList",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {'sendType': '全部', 'dealerId': ''},
      sendTypeList: ['全部', '业务负责人日报', '跟单负责人日报', '财务负责人日报', '拦截通知', '剩余额度通知', '额度变更通知', '特批额度通知', '移除拦截通知'],
      content: ''
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealerId = this.$route.query.dealerId;
    that.getNoticeLogList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getNoticeLogList();
    },
    getNoticeLogList: function (){
      var that = this;
      that.axios.post('/ald/notice/notice_log_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total;
          that.content = res.data.data.company_name + '消息通知日志'
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
