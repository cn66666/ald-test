<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.stateType" placeholder="请选择拦截原因" @change="getFulfilApplyList()" style="width: 200px; ">
          <el-option
            v-for="item in stateType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户编号" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="销售单号" v-model="queryType.orderCode">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="最小履行金额" v-model="queryType.minFulfil" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-input  style="width: 200px; float:left;"
                   placeholder="最大履行金额" v-model="queryType.maxFulfil" oninput="value=value.replace(/[^0-9.-]/g, '')">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.startDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="创建起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.endDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="创建截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="getFulfilApplyList()">查询</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="applyList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行金额" width="150%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期" width="150%">
      </el-table-column>
      <el-table-column
        prop=""
        label="拦截原因">
        <template slot-scope="scope">
          <p v-for="item  in scope.row.intercept_info">
            {{ item }}
          </p>
        </template>
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
export default {
  name: "fulfilErrorList",
  components: {PushFunctionBtn},
  data() {
    return {
      applyList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: [],
      queryType: {},
      stateType: [
        {'type': '全部', 'query': ''},
        {'type': '销售单不存在', 'query': '销售单不存在'},
        {'type': '客户存在累计逾期30天以上', 'query': '客户存在累计逾期30天以上'},
        {'type': '额度不足', 'query': '额度不足'},
        {'type': '客户存在手动拦截原因', 'query': '客户存在手动拦截原因'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getFulfilApplyList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getFulfilApplyList();
    },
    getFulfilApplyList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_error', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.applyList = res.data.data.data_list;
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
      var file_name = '履行单拦截清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/fulfilErrorList?' + data + '&timestamp=' + new Date().getTime(),
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
