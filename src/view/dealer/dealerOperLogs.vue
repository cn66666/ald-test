<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.logType" style="width: 200px;" placeholder="请选择功能类型">
          <el-option
            v-for="item in logType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.user" style="width: 200px;" placeholder="请选择操作人">
          <el-option
            v-for="item in userList"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left; width: 200px"
                        type="date"
                        placeholder="操作起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left; width: 200px"
                        type="date"
                        placeholder="操作截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="width: 100px;height: 36px" type="primary" @click="getDealerOperLogs()">查询</el-button>
        <el-button style="height: 36px;width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;width: 100px" type="primary" @click="downloadDealerOperLogs()">下载excel</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="user_name"
        label="操作人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="func_name"
        label="操作功能"
        width="200">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="操作时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="content"
        label="变更内容">
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
  name: "dealerOperLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {dealerId: null, startDate: null, endDate: null, logType: null, user: null},
      showInfo: false,
      logType: [
        {'type': '全部', 'query': ''},
        {'type': '补充资料', 'query': '补充资料'},
        {'type': '季度额度通过', 'query': '季度额度通过'},
        {'type': '评分卡补充资料', 'query': '评分卡补充资料'},
        {'type': '评分卡退回', 'query': '评分卡退回'},
        {'type': '更改逾期配置', 'query': '更改逾期配置'},
        {'type': '额度特批', 'query': '额度特批'},
        {'type': '手动拉入拦截清单', 'query': '手动拉入拦截清单'},
        {'type': '滞纳金缴纳/免除', 'query': '滞纳金缴纳/免除'},
        {'type': '拉出拦截', 'query': '拉出拦截'},
        {'type': '申请新客户拦截特批', 'query': '申请新客户拦截特批'},
        {'type': '申请客户移出拦截特批', 'query': '申请客户移出拦截特批'},
        {'type': '申请客户额度特批', 'query': '申请客户额度特批'},
        {'type': '申请客户账期调整特批', 'query': '申请客户账期调整特批'},
        {'type': '申请客户逾期配置特批', 'query': '申请客户逾期配置特批'},
      ],
      userList: []
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealerId = this.$route.query.dealerId;
    this.getDealerOperLogs()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getDealerOperLogs();
    },
    getDealerOperLogs: function (){
      var that = this;
      console.log(1)
      that.axios.post('/ald/logs/oper_logs', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
          that.userList = res.data.data.user_list
        }
      }).catch(res=>{
      })
    },
    downloadDealerOperLogs: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      var now = that.$utils.getNowDate()
      var file_name = '用户操作日志' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/dealerOperLogs?' + data,
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
>>> .el-input__inner{
  height: 36px;
}
</style>
