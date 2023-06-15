<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px 3px 2px 3px; ">
        <el-select v-model="queryType.apiType" style="float:left;width: 200px;" placeholder="请选择接口类型">
          <el-option
            v-for="item in apiType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.createStartDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="接口请求日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.createEndDate" style="width: 200px; float:left;"
                        type="date"
                        placeholder="接口请求截止日期范围" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="getOpenApiList()">查询</el-button>
        <el-button style="float:left; width: 100px; height: 36px" type="primary" @click="reset()">重置</el-button>
      </div>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="No."
      width="80px">
      </el-table-column>
      <el-table-column
        prop="request_url"
        label="请求地址"
        width="170%">
      </el-table-column>
      <el-table-column
        prop="request_data"
        label="请求参数">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :rows="1"
            :value="scope.row.request_data">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="response_data"
        label="返回参数">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 23px;margin-right: 79px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="localPage"
                     layout="prev, pager, next, jumper" :page-count="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "openApiLogs",
  data() {
    return {
      tableData: [],
      total: 0,
      localPage: 1,
      queryType: {},
      apiType: [
        {'type': '全部', 'query': '全部'},
        {'type': '履行单申请', 'query': '/ald/open_api/fulfil_order'},
        {'type': '履行单状态', 'query': '/ald/open_api/fulfil_state'},
        {'type': '退货申请', 'query': '/ald/open_api/return_order'},
        {'type': '销售单数据', 'query': '/ald/open_api/business_order'},
        {'type': '发票数据', 'query': '/ald/open_api/invoice_order'},
        {'type': '货物数据', 'query': '/ald/open_api/goods_order'},
        {'type': 'oa回调', 'query': '/ald/open_api/oa_call_back'},
      ],
    }
  },
  mounted() {
    this.getOpenApiList()
  },
  methods: {
    reset: function () {
      location.reload()
    },
    handleCurrentChange(val) {
      this.localPage = val;
      this.getOpenApiList();
    },
    getOpenApiList: function (){
      var that = this;
      that.axios.post('/ald/logs/open_api', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.tableData = res.data.data.data_list;
          that.total = res.data.data.total
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
