<template>
  <div>
    <el-table
      class="info_table"
      :data="interceptList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="intercept_info"
        label="拦截项目" header-align="center" align="center">
      </el-table-column>
      <el-table-column
        prop="intercept_num"
        label="累计出现次数" width="300%" header-align="center" align="center">
      </el-table-column>
      <el-table-column
        prop="intercept_remove_days"
        label="平均拦截后拉出天数" width="300%" header-align="center" align="center">
      </el-table-column>
      <el-table-column
        prop="intercept_unremove_num"
        label="现有拦截数量" width="300%" header-align="center" align="center">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" fixed="right" width="200%">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getInterceptHistoryPage(scope.row.intercept_info)">历史明细</el-button>
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
  name: "interceptForms",
  data() {
    return {
      interceptList: [],
    }
  },
  mounted() {
    var that = this;
    that.getInterceptFormList();
  },
  methods: {
    getInterceptFormList: function (){
      var that = this;
      that.axios.post('/ald/forms/intercept_forms', {}).then(res=>{
        if (res.data.code=='ok'){
          that.interceptList = res.data.data;
        }
      }).catch(res=>{
      })
    },
    getInterceptHistoryPage:function (intercept_type){
      var that = this;
      that.$router.push('/admin/forms/interceptHistoryList?intercept_type=' + intercept_type)
    }
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
