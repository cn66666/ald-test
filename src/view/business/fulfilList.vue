<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.stateType" style="width: 200px;" placeholder="请选择履行单状态" @change="getFulfilList()">
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
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="履行单号" v-model="queryType.fulfilCode">
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
        <el-button style="float:left; width: 100px" type="primary" @click="getFulfilList()">查询</el-button>
        <el-button style="float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="fulfilList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="apply_id"
        label="fid" width="50%">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="客户名称" width="250%">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.company_name" placement="top">
            <router-link :to='"/admin/dealer/dealerInfo?dealerId=" + scope.row.dealer_id'>
              <el-button type="text">{{scope.row.company_name}}</el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_code"
        label="销售单号" width="200%">
        <template slot-scope="scope">
            <el-button type="text" @click="toOrderList(scope.row.order_code)">{{scope.row.order_code}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="fulfil_code"
        label="履行单号" width="150%">
      </el-table-column>
      <el-table-column
        prop="state_code"
        label="履行单状态" width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'ok'">成功</span>
          <span v-else>{{scope.row.state_code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fulfil_money"
        label="履行金额" width="200%">
        <template slot-scope="scope">
          {{ scope.row.fulfil_money | moneyFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期">
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
  name: "fulfilList",
  components: {PushFunctionBtn},
  data() {
    return {
      fulfilList: [],
      total: 1,
      localPage: 1,
      isIndeterminate: true,
      selectList: [],
      queryType: {},
      stateType: [
        {'type': '全部', 'query': ''},
        {'type': '正在处理', 'query': '正在处理'},
        {'type': '已履行,但出现异常', 'query': '已履行,但出现异常'},
        {'type': '已取消', 'query': '已取消'},
      ],
    }
  },
  mounted() {
    var that = this;
    that.getFulfilList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getFulfilList();
    },
    getFulfilList: function (){
      var that = this;
      that.axios.post('/ald/business/fulfil_apply', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code=='ok'){
          that.fulfilList = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
    toOrderList: function (order_code){
      var that = this;
      that.$router.push({name: 'orderInfoList', params:{dealerId: '', orderType: '', orderCode: order_code, pageNum: 1}})
    },
    reset: function () {
      location.reload()
    },
    download: function (){
      var that = this;
      var data = 'data=' + JSON.stringify(that.queryType);
      var now = that.$utils.getNowDate()
      var file_name = '履行单通过清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/fulfilList?' + data + '&timestamp=' + new Date().getTime(),
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

</style>
