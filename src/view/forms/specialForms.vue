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
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getSpecialFormList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="download()">下载excel</el-button>
      </div>
    </el-row>

    <el-table
      class="info_table"
      :data="specialList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="id"  width="90%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id' target="_blank">
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="special_done_date"
        label="特批通过日期">
      </el-table-column>
      <el-table-column
        prop="quota_money"
        label="现有额度(万元)">
        <template slot-scope="scope">
          {{ scope.row.quota_money | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="quota_special"
        label="特批额度(万元)">
        <template slot-scope="scope">
          {{ scope.row.quota_special | tenFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="special_date"
        label="特批通过日期" >
      </el-table-column>
      <el-table-column
        prop="sale_person"
        label="业务代表"  width="90%">
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

export default {
  name: "specialForms",
  components: {PushFunctionBtn},
  data() {
    return {
      total: 1,
      localPage: 1,
      queryType: {},
      specialList: [],

    }
  },
  mounted() {
    this.getSpecialFormList()
  },
  methods: {
    getSpecialFormList: function (){
      var that = this;
      that.axios.post('/ald/forms/special_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.specialList = res.data.data.data_list;
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
      var file_name = '特批报表' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/specialList?' + data + '&timestamp=' + new Date().getTime(),
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
      that.getSpecialFormList();
    },
  }
}
</script>

<style scoped>
>>> .el-input__inner{
  height: 36px;
}

</style>
