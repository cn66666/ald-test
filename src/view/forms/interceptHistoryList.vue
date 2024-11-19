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
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getInsureHistoryFormList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>

    <el-table
      class="info_table"
      :data="interceptHistoryList"
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
        prop="intercept_type"
        label="拦截原因" width="200%">
      </el-table-column>
      <el-table-column
        prop="sale_person"
        label="业务代表"  width="90%">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="拦截日期" width="200%">
      </el-table-column>
      <el-table-column
        prop="remove_time"
        label="解除日期" width="200%">
      </el-table-column>
      <el-table-column
        prop="oa_code"
        label="OA编号" width="150%">
      </el-table-column>
      <el-table-column
        prop="oa_apply_remark"
        label="OA申请备注" width="250%">
      </el-table-column>
      <el-table-column
        prop="oa_result"
        label="OA回复" width="250%">
      </el-table-column>
      <el-table-column
        prop="remove_days"
        label="拦截天数" width="150%">
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
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";
import lineChart from '../../components/lineChart'
import lineChartOption from '../../assets/js/lineChartOption'
import sunburstChartOption from "../../assets/js/sunburstChartOption";
import graphChartOption from "../../assets/js/graphChartOption";

export default {
  name: "interceptHistoryList",
  data() {
    return {
      interceptHistoryList: [],
      total: 1,
      localPage: 1,
      queryType: {},
    }
  },
  mounted() {
    var that = this;
    that.queryType['intercept_type'] = that.$route.query.intercept_type;
    that.getInsureHistoryFormList();
  },
  methods: {
    getInsureHistoryFormList: function (){
      var that = this;
      that.axios.post('/ald/forms/intercept_history_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.interceptHistoryList = res.data.data.data_list;
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
      var file_name = that.queryType['intercept_type'] + '历史明细' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/interceptHistoryList?' + data + '&timestamp=' + new Date().getTime(),
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
      that.getInsureHistoryFormList();
    },
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
