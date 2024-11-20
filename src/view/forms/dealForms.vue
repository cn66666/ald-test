<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left; margin: 2px 3px 2px 3px; ">
        <el-input  style="width: 200px; float:left; height: 36px"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getDealFormList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>

    <el-table
      class="info_table"
      :data="dealList"
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
        prop="fulfil_money_avg"
        label="平均月发货(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money_avg | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="fulfil_money_max"
        label="高峰月发货(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money_max | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_money_avg"
        label="平均月开票(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.invoice_money_avg | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_money_max"
        label="高峰月开票(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.invoice_money_max | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="return_money_avg"
        label="平均月回款(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.return_money_avg | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="return_money_max"
        label="高峰月回款(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.return_money_max | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="overdue_money_avg"
        label="平均月逾期(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.overdue_money_avg | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="overdue_money_max"
        label="高峰月逾期(万元)" width="150%">
        <template slot-scope="scope">
          {{ scope.row.overdue_money_max | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" fixed="right" width="250%">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showFormsBtn(scope.row.dealer_id)">查看报表</el-button>
          <el-button type="primary" size="mini" @click="getDealMonthListPage(scope.row.dealer_id, scope.row.company_name)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next" :page-count="total">
      </el-pagination>
    </div>


    <el-dialog title="客户发货回款近12月明细" :visible.sync="showForms" width="1000px">
      <barChart v-if="dealFormId !== ''" :id="dealFormId" :option="barChartOption"></barChart>
    </el-dialog>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";
import barChart from '../../components/barChart'
import barChartOption from '../../assets/js/barChartOption'

export default {
  name: "dealForms",
  components: {
    PushFunctionBtn,
    barChart
  },
  data() {
    return {
      total: 1,
      localPage: 1,
      queryType: {},
      dealList: [],
      showForms: false,
      dealFormId:'',
      barChartOption:''
    }
  },
  mounted() {
    var that = this;
    that.getDealFormList();
  },
  methods: {
    getDealFormList: function (){
      var that = this;
      that.axios.post('/ald/forms/deal_month_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.dealList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    reset: function () {
      location.reload()
    },
    showFormsBtn(dealer_id){
      var that = this;
      that.showForms = true
      that.axios.post('/ald/forms/dealer_deal_month_list', {'dealer_id': dealer_id}).then(res=>{
        if (res.data.code==='ok'){
          that.report = res.data.data
          // 处理股权结构图
          that.dealFormId = 'dealFormId'
          that.barChartOption = barChartOption.getDealFormOption(that.report.money_dict)
        }
      }).catch(res=>{
      })
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);;
      var now = that.$utils.getNowDate()
      var file_name = '发货回款统计报表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/dealMonthForms?' + data + '&timestamp=' + new Date().getTime(),
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
      that.getDealFormList ();
    },
    getDealMonthListPage:function (dealer_id, company_name){
      var that = this;
      that.$router.push('/admin/forms/dealMonthList?dealer_id=' + dealer_id + '&company_name=' + company_name)
    }
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
