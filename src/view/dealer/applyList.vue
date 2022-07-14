<template>
  <div>
    <el-row class="filter_row">
      <el-select v-model="queryType.applyState" placeholder="请选择客户状态" @change="getApplyDealerList()">
        <el-option
          v-for="item in applyState"
          :key="item.query"
          :label="item.type"
          :value="item.query">
        </el-option>
      </el-select>
<!--      <el-select v-model="queryType.dealerType" placeholder="请选择客户类型" @change="getApplyDealerList()">-->
<!--        <el-option-->
<!--          v-for="item in dealerType"-->
<!--          :key="item.query"-->
<!--          :label="item.type"-->
<!--          :value="item.query">-->
<!--        </el-option>-->
<!--      </el-select>-->
      <push-function-btn btn-name="手动更新客户" btn-type="reload" size="mini"
                         check-btn="refreshDealer" check-role="applyList" url="/ald/dealer/refresh_dealer"></push-function-btn>
      <el-button type="primary" @click="download()"  size="mini">下载excel</el-button>
    </el-row>
    <el-table
      class="info_table"
      :data="dealerList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="370%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="赊销额度" width="150%">
        <template slot-scope="scope">
          {{ scope.row.quota_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_date"
        label="额度截止日期"  width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'input'">待录入</span>
          <span v-else-if="scope.row.state_code === 'save'">暂存</span>
          <span v-else-if="scope.row.state_code === 'intercept'">已拦截</span>
          <span v-else-if="scope.row.state_code === 'add'">待补充数据</span>
          <span v-else-if="scope.row.state_code === 'unactive'">待激活</span>
          <span v-else-if="scope.row.state_code === 'reckon'">额度计算中</span>
          <span v-else-if="scope.row.state_code === 'active_error'">激活失败</span>
          <span v-else-if="scope.row.state_code === 'activeing'">激活中</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <push-function-btn v-if="scope.row.state_code === 'input'" btn-name="补充数据" btn-type="replace" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'save'" btn-name="修改补录信息" btn-type="replace" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'save'" btn-name="提交申请" btn-type="reload" size="mini"
                             check-btn="changeDealer" check-role="applyList" url="/ald/dealer/dealer_apply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'save'" btn-name="特殊审批" btn-type="replace" size="mini"
                             check-btn="specialApply" check-role="applyList" url="/admin/dealer/specialApply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'intercept'" btn-name="查询拦截原因" btn-type="function" size="mini"
                             check-btn="showApplyIntercept" check-role="applyList" :check-function='showApplyIntercept'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'add'" btn-name="前往数据采集页面" btn-type="replace_new"
                             check-btn="getDealerData" url="/xingyun/upload"
                             params-key='code' :params-value='scope.row.code' check-role="applyList"></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'add'" btn-name="跳过数据采集页面" btn-type="reload" size="mini"
                             check-btn="skipGetData" check-role="applyList" url="/ald/dealer/skip_get_data"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'unactive'" btn-name="确认激活" btn-type="reload" size="mini"
                             check-btn="doneDealerQuota" check-role="applyList" url="/ald/dealer/done_quota"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'unactive' && scope.row.quota_type === '新客户'" btn-name="重新录入" btn-type="reload" size="mini"
                             check-btn="deleteDealerQuota" check-role="applyList" url="/ald/dealer/delete_quota"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>

          <push-function-btn v-if="scope.row.state_code === 'active_error'" btn-name="重新激活" btn-type="reload" size="mini"
                             check-btn="againApplyActive" check-role="applyList" url="/ald/dealer/again_apply_active"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></push-function-btn>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="查看拦截原因" :visible.sync="showIntercept">
      <el-form>
        <el-form-item label="拦截原因" :label-width="formLabelWidth">
          <p v-for="(item)  in interceptList" :key="item">{{ item }};</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="showIntercept=false">关闭</el-button>
        <push-function-btn btn-name="跳过拦截" btn-type="reload" size="mini"
                           check-btn="skipApplyIntercept" check-role="applyList" url="/ald/dealer/skip_apply_intercept"
                           params-key='dealerId' :params-value='applyInterceptId'></push-function-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";

export default {
  name: "applyList",
  components: {PushFunctionBtn},
  data() {
    return {
      dealerList: [],
      total: 1,
      localPage: 1,
      showIntercept: false,
      formLabelWidth: '120px',
      interceptList:[],
      applyInterceptId: null,
      queryType: {},
      dealerType: [
        {'type': '全部', 'query': ''},
        {'type': '内销客户', 'query': 'in'},
        {'type': '出口客户', 'query': 'out'},
      ],
      applyState: [
        {'type': '全部', 'query': ''},
        {'type': '待录入', 'query': 'input'},
        {'type': '暂存', 'query': 'save'},
        {'type': '已拦截', 'query': 'intercept'},
        {'type': '待补充数据', 'query': 'add'},
        {'type': '待激活', 'query': 'unactive'},
        {'type': '额度计算中', 'query': 'reckon'},
        {'type': '激活失败', 'query': 'active_error'},
        {'type': '激活中', 'query': 'activeing'}
      ],
    }
  },
  mounted() {
    var that = this;
    that.getApplyDealerList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getApplyDealerList();
    },

    getApplyDealerList: function (){
      var that = this;
      that.axios.post('/ald/dealer/apply_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.dealerList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },

    showApplyIntercept: function (dealerId){
      var that = this;
      that.interceptList = []
      that.applyInterceptId=dealerId
      that.showIntercept=true;
      that.axios.post('/ald/dealer/show_apply_intercept', {'dealerId': dealerId,}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data
        }else {
          that.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      console.log(data)
      that.axios({
        method: "get",
        url: '/ald/downloads/applyList?' + data,
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data])
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", '客户申请清单.xls');
        document.body.appendChild(link);
        link.click();
      })
    },
  }
}
</script>

<style scoped>

</style>
