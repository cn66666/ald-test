<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="float:left;"
                        type="date"
                        placeholder="拦截起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="float:left;"
                        type="date"
                        placeholder="拦截截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px" type="primary" @click="getInterceptList()">查询</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <span style="float:left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
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
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn btn-name="普通移出" btn-type="function" size="mini"
                             check-btn="removeIntercept" check-role="interceptList" :check-function='skipIntercept'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn btn-name="特殊移出" btn-type="function" size="mini"
                             check-btn="removeSpecialIntercept" check-role="interceptList" :check-function='skipSpecialIntercept'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>

    <el-dialog title="进行普通移出" :visible.sync="showForm">
      <el-form>
        <el-form-item label="备注信息" prop="info" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="skipInterceptBtn()">确认移出</el-button>
      </div>
    </el-dialog>

    <el-dialog title="进行特殊移出" :visible.sync="specialShowForm">
      <el-form>
        <el-form-item label="备注信息" prop="info" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="skipSpecialInterceptBtn()">确认移出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";

export default {
  name: "interceptList",
  components: {PushFunctionBtn},
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
      that.addForm.dealerId = dealerId
      that.addForm.remark = ''
      that.showForm = true
    },

    skipSpecialIntercept: function (dealerId){
      var that = this;
      that.addForm.dealerId = dealerId
      that.addForm.remark = ''
      that.specialShowForm = true
    },

    skipInterceptBtn: function () {
      var that = this;
      that.axios.post('/ald/dealer/remove_intercept', that.addForm).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 申请审批中')
          that.update = false
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },

    skipSpecialInterceptBtn: function () {
      var that = this;
      that.axios.post('/ald/dealer/special_remove_intercept', that.addForm).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 申请审批中')
          that.update = false
        }else {
          Message.warning('失败: ' + res.data.data)
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
      console.log(data)
      that.axios({
        method: "get",
        url: '/ald/downloads/interceptList?' + data + '&timestamp=' + new Date().getTime(),
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '客户拦截清单.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
