<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left; width: 200px;"
                        type="date"
                        placeholder="拦截起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left; width: 200px;"
                        type="date"
                        placeholder="拦截截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getInterceptList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="interceptList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="200%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="拦截原因" width="500%">
        <template slot-scope="scope">
          <span v-if="scope.row.intercept_reason['manual'] === true">存在手动拦截:{{scope.row.intercept_reason['manual_info']}}</span>
          <span v-if="scope.row.intercept_reason['law'] === true">存在司法诉讼拦截</span>
          <span v-if="scope.row.intercept_reason['overdue_30'] !== 0">逾期30天以上存在{{scope.row.intercept_reason['overdue_30']}}次</span>
          <span v-if="scope.row.intercept_reason['overdue_90'] !== 0">逾期90天以上存在{{scope.row.intercept_reason['overdue_90']}}次</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="拦截状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'intercept'">已拦截</span>
          <span v-else-if="scope.row.state_code === 'unintercept'">未拦截</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="拦截时间" width="120%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="skipIntercept(scope.row.dealer_id)" :disabled="scope.row.oa_apply">申请解除拦截</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>

    <el-dialog title="申请解除拦截" :visible.sync="showForm" width="30%">
      <el-form>
        <el-form-item label="备注信息" prop="info" label-width="150px">
          <el-input v-model="addForm.remark" style="width: 70%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="skipInterceptBtn()">确认提交申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "interceptList",
  data() {
    return {
      interceptList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
      queryType: {},
      showForm: false,
      specialShowForm: false,
      addForm: {
        remark:'',
        dealerId: '',
      }
    }
  },
  mounted() {
    this.getInterceptList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getInterceptList();
    },
    getInterceptList: function (){
      var that = this;
      that.axios.post('/ald/dealer/intercept_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },

    skipIntercept: function (dealerId){
      var that = this;
      console.log(dealerId)
      that.addForm.dealerId = dealerId
      that.addForm.remark = ''
      that.showForm = true
    },

    skipInterceptBtn: function () {
      var that = this;
      console.log(that.addForm)
      that.axios.post('/ald/dealer/remove_intercept', that.addForm).then(res=>{
        that.showForm = false
        if (res.data.code==='ok'){
          that.open('申请已发送至OA系统，请等待OA系统审批', '申请成功')
        }else {
          that.open('失败: ' + res.data.data, '申请失败')
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
      var file_name = '客户拦截清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/interceptList?' + data + '&timestamp=' + new Date().getTime(),
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
    open(message, title) {
      this.$alert(message, title, {
        confirmButtonText: '关闭',
        callback: action => {
          location.reload()
        }
      });
    }
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
