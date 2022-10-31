<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="起始注销日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="截止注销日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getInactiveList()">查询</el-button>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="quotaList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="300%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="注销日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="80%">
        <span>已注销</span>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <noPermissionBtn btn-name="查看额度变更" btn-type="replace" size="mini" url="/admin/dealer/quotaLogs"
                             params-key='dealerId' :params-value='scope.row.id'></noPermissionBtn>

          <noPermissionBtn btn-name="查看滞纳金变更" btn-type="replace" size="mini" url="/admin/business/overdueLogs"
                             params-key='dealerId' :params-value='scope.row.id'></noPermissionBtn>

          <noPermissionBtn btn-name="查看发票逾期" btn-type="replace" size="mini" url="/admin/business/invoiceOverdueLogs"
                             params-key='dealerId' :params-value='scope.row.id'></noPermissionBtn>

          <noPermissionBtn btn-name="查看销售单状态" btn-type="replace" size="mini" url="/admin/business/inactiveOrderInfoList"
                             params-key='dealerId' :params-value='scope.row.id'></noPermissionBtn>

          <noPermissionBtn btn-name="查看履行单通过清单" btn-type="replace" size="mini" url="/admin/business/inactiveFulfilList"
                             params-key='dealerId' :params-value='scope.row.id'></noPermissionBtn>
        </template>
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
import noPermissionBtn from "../../components/noPermissionBtn";
import {Message} from "element-ui";
export default {
  name: "quotaList",
  components: {noPermissionBtn},
  data() {
    return {
      quotaList: [],
      total: 1,
      localPage: 1,
      showInterceptRemark: false,
      interceptRemark:  '',
      formLabelWidth: '120px',
      interceptDealerId: null,
      showChangeDate: false,
      dealerId: null,
      changeDate: '',
      queryType: {},
    }
  },
  mounted() {
    var that = this;
    that.getInactiveList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getInactiveList();
    },
    getInactiveList: function (){
      var that = this;
      that.axios.post('/ald/dealer/inactive_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.quotaList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '客户注销清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/dealerInactiveList?' + data + '&timestamp=' + new Date().getTime(),
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
