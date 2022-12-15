<template>
  <div>
    <el-page-header @back="goBack" :content=content style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.sendType" style="width: 200px;" placeholder="请选择消息类型">
          <el-option
            v-for="item in sendTypeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发送起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="发送截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.stateCode" placeholder="请选择状态类型" style="width: 200px;">
          <el-option
            v-for="item in stateCodeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="通知对象" v-model="queryType.userName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getNoticeLogList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
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
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
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
      queryType: {'sendType': '', 'dealerId': '', 'stateCode': '', 'startDate': '', 'endDate': '', 'userName': ''},
      sendTypeList: ['全部', '业务负责人日报', '跟单负责人日报', '财务负责人日报', '拦截通知', '剩余额度通知', '额度变更通知', '特批额度通知', '移除拦截通知'],
      stateCodeList: ['全部', '发送成功', '发送失败'],
      content: ''
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealerId = this.$route.query.dealerId;
    that.getNoticeLogList()
  },
  methods: {
    reset: function () {
      location.reload()
    },
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
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '客户消息通知日志' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/noticeLogList?' + data + '&timestamp=' + new Date().getTime(),
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", file_name);
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
