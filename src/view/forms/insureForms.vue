<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="销售代表" v-model="queryType.salePerson">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getInsureFormList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>

    <el-table
      class="info_table"
      :data="insureList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="300%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id' target="_blank">
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="客户类型" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_export === false">内销客户</span>
          <span v-else-if="scope.row.is_export === true">出口客户</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="insure_type"
        label="保险类型" width="100%">
      </el-table-column>
      <el-table-column
        prop="insure_quota">
        <template slot="header" slot-scope="scope">
          <div style="width: 100%">
            当期额度(万元)
            <el-popover
              placement="top-start"
              offset="10"
              width="200"
              trigger="hover"
              content="从保险公司获取的客户当前额度">
              <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.insure_quota | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="last_insure">
        <template slot="header" slot-scope="scope">
          <div style="width: 100%">
            上期额度(万元)
            <el-popover
              placement="top-start"
              offset="10"
              width="200"
              trigger="hover"
              content="从保险公司获取的客户历史最近的变动额度">
              <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.last_insure | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="apply_money">
        <template slot="header" slot-scope="scope">
          <div style="width: 100%">
            投保额度(万元)
            <el-popover
              placement="top-start"
              offset="10"
              width="200"
              trigger="hover"
              content="从保险公司获取的客户投保额度">
              <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.apply_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_balance">
        <template slot="header" slot-scope="scope">
          <div style="width: 100%">
            当期剩余额度(万元)
            <el-popover
              placement="top-start"
              offset="10"
              width="200"
              trigger="hover"
              content="客户当前剩余的额度，当期剩余额度=最新额度-已使用额度">
              <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.quota_balance | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sale_person"
        label="业务代表"  width="90%">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showFormsBtn(scope.row.dealer_id)">查看报表</el-button>
          <el-button type="primary" size="mini" @click="downloadDealerInfo(scope.row.company_name, scope.row.dealer_id)">下载</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>


    <el-dialog title="保险额度历史图" :visible.sync="showForms" width="1000px">
      <lineChart v-if="insureFormId !== ''" :id="insureFormId" :option="insureFormOption"></lineChart>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";
import lineChart from '../../components/lineChart'
import lineChartOption from '../../assets/js/lineChartOption'
import sunburstChartOption from "../../assets/js/sunburstChartOption";
import graphChartOption from "../../assets/js/graphChartOption";

export default {
  name: "insureForms",
  components: {
    PushFunctionBtn,
    lineChart
  },
  data() {
    return {
      total: 1,
      localPage: 1,
      queryType: {},
      insureList: [],
      showForms: false,
      insureFormId:'',
      insureFormOption:''
    }
  },
  mounted() {
    var that = this;
    that.getInsureFormList();
  },
  methods: {
    getInsureFormList: function (){
      var that = this;
      that.axios.post('/ald/forms/insure_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.insureList = res.data.data.data_list;
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
      var file_name = '保险历史报表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/insureHistoryForms?' + data + '&timestamp=' + new Date().getTime(),
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
    showFormsBtn(dealer_id){
      var that = this;
      that.showForms = true
      that.axios.post('/ald/forms/insure_history', {'dealer_id': dealer_id}).then(res=>{
        if (res.data.code=='ok'){
          that.report = res.data.data
          // 处理股权结构图
          if (that.report.money_list){
            that.insureFormId = 'insureForm'
            that.insureFormOption = lineChartOption.getInsureFormOption(that.report.date_list,
              that.report.money_list)
          }
        }
      }).catch(res=>{
      })
    },
    downloadDealerInfo: function (company_name, dealer_id){
      var that = this;
      var data = 'dealer_id=' + dealer_id;
      var now = that.$utils.getNowDate()
      var file_name = company_name + '保险历史报表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/dealerInsureHistoryForms?' + data + '&timestamp=' + new Date().getTime(),
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
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getInsureFormList();
    },
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
