<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.state_code" placeholder="请选择变更类型">
          <el-option
            v-for="item in stateCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" style="width: 200px">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.change_type" placeholder="请选择单据类型">
          <el-option
            v-for="item in changeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" style="width: 200px">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="最早发生日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="最晚发生日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input v-model="queryType.change_code" placeholder="请输入单据号" style="width: 200px"></el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="width: 100px;height: 36px" type="primary" @click="getQuotaLogs()">查询</el-button>
        <el-button style="height: 36px;width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button type="primary" style="height: 36px;width: 130px" @click="download()">下载excel</el-button>
        <el-button type="primary" style="height: 36px;width: 150px" @click="showAddLog=true">手动添加变更记录</el-button>
      </div>
    </el-row>
    <el-table
      class="info_table"
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="change_quota" width="150%"
        label="剩余金额">
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
        prop="change_type"
        label="单据类型">
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
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="手动添加变更记录" :visible.sync="showAddLog" >
      <el-form>
        <el-form-item label="变更类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.changeType" placeholder="请选择变更类型" @change="getQuotaLogs">
              <el-option
                v-for="item in changeTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更金额" :label-width="formLabelWidth">
          <el-input v-model="addForm.changeMoney">
            <template slot="append">元</template></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.changeInfo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showAddLog=false">关闭</el-button>
        <push-function-btn btn-name="创建变更记录" btn-type="reload" size="mini"
                           check-btn="addQuotaLog" check-role="quotaList" url="/ald/dealer/add_quota_log"
                           params-key='addInfo' :params-value='addForm'></push-function-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
export default {
  name: "quotaLogs",
  components: {PushFunctionBtn},
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {'state_code': null, 'dealer_id': null, 'change_type': null, 'startDate': null, 'endDate': null, 'change_code': null},
      showInfo: false,
      stateCodeOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '+',
        label: '返还'
      }, {
        value: '-',
        label: '占用'
      }, {
        value: '=',
        label: '调整'
      }],
      changeTypeOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '履行单',
        label: '履行单'
      }, {
        value: '开票',
        label: '开票'
      }, {
        value: '退货授权单',
        label: '退货授权单'
      }],
      showAddLog: false,
      formLabelWidth: '120px',
      addForm: {
        dealerId: '',
        changeMoney: 0,
        changeInfo: '',
        changeType: '',
      },
      changeTypeList: [{
        value: '+',
        label: '返还额度'
      }, {
        value: '-',
        label: '占用额度'
      }]
    }
  },
  mounted() {
    var that = this;
    that.queryType.dealer_id = this.$route.query.dealerId;
    that.addForm.dealerId = this.$route.query.dealerId;
    this.getQuotaLogs()
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
      this.getQuotaLogs();
    },
    getQuotaLogs: function (){
      var that = this;
      that.axios.post('/ald/logs/quota_logs', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '客户额度变更详情' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/quotaLogs?' + data + '&timestamp=' + new Date().getTime(),
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
