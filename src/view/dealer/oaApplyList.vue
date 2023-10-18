<template>
  <div>
    <el-row class="filter_row">
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="客户名称" v-model="queryType.companyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-input  style="width: 200px; float:left;"
                   placeholder="申请人名称" v-model="queryType.applyName">
        </el-input>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.permissionType" placeholder="请选择项目类型">
          <el-option
            v-for="item in permissionType"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-select v-model="queryType.stateCode" placeholder="请选择申请状态">
          <el-option
            v-for="item in stateCode"
            :key="item.query"
            :label="item.type"
            :value="item.query">
          </el-option>
        </el-select>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.applyStartDate" style="float:left;"
                        type="date"
                        placeholder="申请起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.applyEndDate" style="float:left;"
                        type="date"
                        placeholder="申请截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-date-picker v-model="queryType.backStartDate" style="float:left;"
                        type="date"
                        placeholder="反馈起始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="float:left; height: 40px; line-height:  40px;">&nbsp;-&nbsp;</span>
        <el-date-picker v-model="queryType.backEndDate" style="float:left;"
                        type="date"
                        placeholder="反馈截止日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="demo-input-suffix" style="float:left;margin: 2px;">
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="getOaApplyList()">查询</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="reset()">重置</el-button>
        <el-button style="height: 36px;float:left; width: 100px" type="primary" @click="download()">下载excel</el-button>
      </div>

    </el-row>
    <el-table
      class="info_table"
      :data="oaApplyList"
      style="width: 98%; margin: 0 1%" :row-style="{height: '30px'}">
      <el-table-column
        prop="id"
        label="申请id" width="100px">
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
        prop="state_code"
        label="审批状态" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.state_code === 'active'">通过</span>
          <span v-else-if="scope.row.state_code === 'refuse'">已拒绝</span>
          <span v-else-if="scope.row.state_code === 'apply'">审批中</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="permission_type"
        label="项目类型" width="200px">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="申请日期">
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="反馈日期">
      </el-table-column>
      <el-table-column
        prop="apply_user"
        label="申请人">
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
import {Message} from "element-ui";

export default {
  name: "oaApplyList",
  data() {
    return {
      oaApplyList: [],
      total: 1,
      localPage: 1,
      formLabelWidth: '120px',
      queryType: {},
      permissionType: [
        {'type': '全部', 'query': ''},
        {'type': '客户额度特批', 'query': '客户额度特批'},
        {'type': '新客户拦截特批', 'query': '新客户拦截特批'},
        {'type': '客户移出拦截特批', 'query': '客户移出拦截特批'},
        {'type': '客户账期调整特批', 'query': '客户账期调整特批'},
        {'type': '客户逾期配置特批', 'query': '客户逾期配置特批'},
      ],
      stateCode: [
        {'type': '全部', 'query': ''},
        {'type': '审批中', 'query': '301'},
        {'type': '通过', 'query': '200'},
        {'type': '拒绝', 'query': '404'},
      ],
    }
  },
  mounted() {
    this.getOaApplyList()
  },
  methods: {
    handleCurrentChange(val) {
      var that = this;
      that.localPage = val;
      that.getOaApplyList();
    },
    getOaApplyList: function (){
      var that = this;
      that.axios.post('/ald/oa/apply_list', {'page': that.localPage, 'queryType': that.queryType}).then(res=>{
        if (res.data.code==='ok'){
          that.oaApplyList = res.data.data.data_list;
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
      var file_name = 'OA审批清单' + now + '.xls'
      that.axios({
        method: "get",
        url: '/ald/downloads/oaApplyList?' + data + '&timestamp=' + new Date().getTime(),
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
