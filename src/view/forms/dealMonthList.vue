<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
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
        prop="year"
        label="年份" width="200%">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份" width="200%">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="月发货(万元)">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="invoice_money"
        label="月开票(万元)">
        <template slot-scope="scope">
          {{ scope.row.invoice_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="return_money_avg"
        label="月回款(万元)">
        <template slot-scope="scope">
          {{ scope.row.return_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="overdue_money"
        label="月逾期(万元)">
        <template slot-scope="scope">
          {{ scope.row.overdue_money | tenFormat}}
        </template>
      </el-table-column>
    </el-table>

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
  name: "dealMonthList",
  data() {
    return {
      queryType: {},
      dealList: [],
      dealer_id: '',
      company_name: ''
    }
  },
  mounted() {
    var that = this;
    that.dealer_id = that.$route.query.dealer_id;
    that.company_name = that.$route.query.company_name;
    that.getDealMonthList();
  },
  methods: {
    getDealMonthList: function (){
      var that = this;
      that.axios.post('/ald/forms/dealer_deal_month_list', {'dealer_id': that.dealer_id}).then(res=>{
        if (res.data.code==='ok'){
          that.dealList = res.data.data.data_list;
        }
      }).catch(res=>{
      })
    },
    download: function (){
      var that = this;
      var data = 'dealer_id=' + that.dealer_id;
      var now = that.$utils.getNowDate()
      var file_name = that.company_name + '近12月发货回款明细报表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/dealMonthList?' + data + '&timestamp=' + new Date().getTime(),
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
