<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.applyState" style="float:left;width: 200px;" placeholder="请选择客户状态">
          <el-option
            v-for="item in applyState"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="width: 100px;height: 36px" type="primary" @click="getApplyDealerList()">查询</el-button>
        <el-button style="width: 100px;height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="width: 150px;height: 36px" type="primary" :loading="loading" @click="queryDealer()">手动更新客户</el-button>
        <el-button style="width: 100px;height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
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
          <noPermissionBtn v-if="scope.row.state_code === 'input'" btn-name="补充数据" btn-type="replace" size="mini" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'save'" btn-name="修改补录信息" btn-type="replace" size="mini" url="/admin/dealer/addDealer"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'save'" btn-name="提交申请" btn-type="reload" size="mini" url="/ald/dealer/dealer_apply"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'intercept'" btn-name="拦截原因" btn-type="function" size="mini" :check-function='showInterceptFunction'
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <el-button type="primary" size="mini" v-if="scope.row.state_code === 'intercept'"
                     @click="showApplyInterceptFunction(scope.row.dealer_id)" :disabled="scope.row.oa_apply">申请跳过拦截</el-button>

          <noPermissionBtn v-if="scope.row.state_code === 'add'" btn-name="前往数据采集页面" btn-type="replace_new" url="/xingyun/upload"  size="mini"
                             params-key='code' :params-value='scope.row.code' check-role="applyList"></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'add'" btn-name="跳过数据采集页面" btn-type="reload" size="mini" url="/ald/dealer/skip_get_data"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'unactive'" btn-name="确认激活" btn-type="reload" size="mini" url="/ald/dealer/done_quota"
                             params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'unactive' && scope.row.quota_type === '新客户'" btn-name="重新录入" btn-type="reload" size="mini"
                             url="/ald/dealer/delete_quota" params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>

          <noPermissionBtn v-if="scope.row.state_code === 'active_error'" btn-name="重新激活" btn-type="reload" size="mini"
                             url="/ald/dealer/again_apply_active" params-key='dealerId' :params-value='scope.row.dealer_id'></noPermissionBtn>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>
    <el-dialog title="查看拦截原因" :visible.sync="showIntercept">
      <el-form>
        <el-form-item label="拦截原因" :label-width="formLabelWidth">
          <p v-for="(item,index)  in interceptList" :key="index">{{ item }};</p>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showApplyIntercept" width="35%">
      <div slot="title">
        <span>申请跳过拦截</span>
        <el-popover
          placement="top-start"
          offset="10"
          width="300"
          trigger="hover"
          content="申请原因（跳过拦截的理由）后点击“确认提交申请”，将申请提交至OA系统审批，OA审批通过后，系统将跳过拦截">
          <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
        </el-popover>
      </div>
      <el-form>
        <el-form-item label="申请原因" prop="info" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.remark"
            type="textarea"
            :autosize="{ minRows: 3}"
            placeholder="请输入申请原因"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="primary" size="mini" @click="skipApplyIntercept()">确认提交申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import noPermissionBtn from "../../components/noPermissionBtn";
import {Message} from "element-ui";

export default {
  name: "applyList",
  components: {noPermissionBtn},
  data() {
    return {
      dealerList: [],
      total: 1,
      localPage: 1,
      showIntercept: false,
      showApplyIntercept: false,
      formLabelWidth: '120px',
      interceptList:[],
      queryType: {},
      loading: false,
      addForm: {
        remark:'',
        dealerId: ''
      },
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
    reset: function () {
      location.reload()
    },
    queryDealer: function () {
      var that = this;
      that.loading = true;
      that.axios.post('/ald/dealer/refresh_dealer', {}).then(res=>{
        location.reload()
      }).catch(res=>{
      })
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
    showInterceptFunction: function (dealerId){
      var that = this;
      that.interceptList = []
      that.addForm.dealerId=dealerId
      that.showIntercept=true;
      that.axios.post('/ald/dealer/show_apply_intercept', {'dealerId': dealerId,}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },

    showApplyInterceptFunction: function (dealerId){
      var that = this;
      that.showApplyIntercept = true
      that.addForm.dealerId=dealerId
    },

    skipApplyIntercept: function (){
      var that = this;
      that.axios.post('/ald/dealer/skip_apply_intercept', that.addForm).then(res=>{
        that.showApplyIntercept = false
        if (res.data.code==='ok'){
          that.open('申请已发送至OA系统，请等待OA系统审批', '申请成功')
        }else {
          that.open('失败: ' + res.data.data, '申请失败')
        }
      }).catch(res=>{
      })
    },

    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType) + '&timestamp=' + new Date().getTime();
      var now = that.$utils.getNowDate()
      var file_name = '客户申请清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/applyList?' + data,
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
