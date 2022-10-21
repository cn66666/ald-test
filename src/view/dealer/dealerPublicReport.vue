<template>
  <div>
    <el-page-header @back="goBack" content="公共信息报告" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <div style="margin: 20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="基本信息">
          <el-descriptions :column="2" size="small" border style="margin: 1%;">
            <el-descriptions-item>
              <template slot="label">
                公司名称
              </template>
              {{ report.company_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                成立日期
              </template>
              {{ report.report.company_info.estiblishTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                经营状态
              </template>
              {{ report.report.company_info.regStatus }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                注册资本
              </template>
              {{ report.report.company_info.regCapital }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                实缴资本
              </template>
              {{ report.report.company_info.actualCapital }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                统一社会信用代码
              </template>
              {{ report.report.company_info.creditCode }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                行业
              </template>
              {{ report.report.company_info.industry }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                参保人数
              </template>
              {{ report.report.company_info.socialStaffNum }}
            </el-descriptions-item>
            <el-descriptions-item :contentStyle="{'max-width': '500px'}">
              <template slot="label">
                经营范围
              </template>
              {{ report.report.company_info.businessScope }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                注册地址
              </template>
              {{ report.report.company_info.regLocation }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                法人
              </template>
              {{ report.report.company_info.legalPersonName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                主要人员
              </template>
              {{ report.report.company_info.staffList }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="变更记录" name="变更记录">
          <el-table
            :data="report.report.bg_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="changeTime"
              label="变更日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="changeItem"
              label="变更项目"
              width="200">
            </el-table-column>
            <el-table-column
              prop="contentBefore"
              label="变更前">
            </el-table-column>
            <el-table-column
              prop="contentAfter"
              label="变更后">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="开庭公告" name="开庭公告">
          <el-table
            :data="report.report.kt_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="startDate"
              label="开庭日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="caseNo"
              label="案件号">
            </el-table-column>
            <el-table-column
              prop="caseReason"
              label="案由">
            </el-table-column>
            <el-table-column
              prop="plaintiff"
              label="原告/上诉人">
            </el-table-column>
            <el-table-column
              prop="defendant"
              label="被告/被上诉人">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="法律诉讼" name="法律诉讼">
          <el-table
            :data="report.report.fl_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="title"
              label="案件名称">
            </el-table-column>
            <el-table-column
              prop="judgeTime"
              label="裁判时间">
            </el-table-column>
            <el-table-column
              prop="caseNo"
              label="案号">
            </el-table-column>
            <el-table-column
              prop="caseReason"
              label="案由">
            </el-table-column>
            <el-table-column
              prop="caseType"
              label="案件类型">
            </el-table-column>
            <el-table-column
              prop="casePersons"
              label="在本案身份">
            </el-table-column>
            <el-table-column
              prop="result"
              label="裁判结果">
            </el-table-column>
            <el-table-column
              prop="caseMoney"
              label="案件金额">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="法院公告" name="法院公告">
          <el-table
            :data="report.report.fy_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="publishdate"
              label="刊登日期">
            </el-table-column>
            <el-table-column
              prop="party1"
              label="上诉方">
            </el-table-column>
            <el-table-column
              prop="party2"
              label="被诉方">
            </el-table-column>
            <el-table-column
              prop="bltntype"
              label="公告类型">
            </el-table-column>
            <el-table-column
              prop="caseno"
              label="案号">
            </el-table-column>
            <el-table-column
              prop="content"
              label="案件内容">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="被执行人" name="被执行人">
          <el-table
            :data="report.report.bzx_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="pname"
              label="被执行人">
            </el-table-column>
            <el-table-column
              prop="caseCode"
              label="案号">
            </el-table-column>
            <el-table-column
              prop="execMoney"
              label="执行标的">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="失信人" name="失信人">
          <el-table
            :data="report.report.sx_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="publishdate"
              label="发布日期">
            </el-table-column>
            <el-table-column
              prop="regdate"
              label="立案日期">
            </el-table-column>
            <el-table-column
              prop="casecode"
              label="案号">
            </el-table-column>
            <el-table-column
              prop="gistid"
              label="执行依据文号">
            </el-table-column>
            <el-table-column
              prop="performance"
              label="履行情况">
            </el-table-column>
            <el-table-column
              prop="performedPart"
              label="已履行部分">
            </el-table-column>
            <el-table-column
              prop="unperformPart"
              label="未履行部分">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="对外投资" name="对外投资">
          <el-table
            :data="report.report.tz_info"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="percent"
              label="投资金额">
              <template slot-scope="scope">
                {{ scope.row.percent | rateFormat}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="强关联关系" name="强关联关系">
          <el-table
            :data="report.report.relation.str_info_list"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop=""
              label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">公司</span>
                <span v-else-if="scope.row.type === 2">个人</span>
                <span v-else>N/A</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="real_rate"
              label="持股比例(%)">
              <template slot-scope="scope">
                {{ scope.row.real_rate | rateFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="关联原因">
              <template slot-scope="scope">
                <p v-for="item  in scope.row.from_list">
                  <span v-if="item.type === 'gd'">股东</span>
                  <span v-else-if="item.type === 'fr'">法人</span>
                  <span v-else-if="item.type === 'dwtz'">{{item.from_name}}对外投资超过20%的公司</span>
                  <span v-else-if="item.type === 'rsy'">{{item.from_name}}持有股份超过20%的公司</span>
                  <span v-else-if="item.type === 'rsy_gd'">{{item.from_name}}的{{item.from_company}}公司的股东</span>
                  <span v-else-if="item.type === 'rsy_dwtz'">人所有公司下{{item.from_company}}对外投资超过20%的公司</span>
                  <span v-else-if="item.type === 'weak_rsy_dwtz'">人所有公司下{{item.from_company}}对外投资的公司</span>
                  <span v-else>N/A</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="弱关联关系" name="弱关联关系">
          <el-table
            :data="report.report.relation.weak_info_list"
            border
            style="width: 98%; margin: 1%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              prop=""
              label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">公司</span>
                <span v-else-if="scope.row.type === 2">个人</span>
                <span v-else>N/A</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="real_rate"
              label="持股比例(%)">
              <template slot-scope="scope">
                {{ scope.row.real_rate | rateFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="关联原因">
              <template slot-scope="scope">
                <p v-for="item  in scope.row.from_list">
                  <span v-if="item.type === 'gd'">股东</span>
                  <span v-else-if="item.type === 'fr'">法人</span>
                  <span v-else-if="item.type === 'dwtz'">{{item.from_name}}对外投资超过20%的公司</span>
                  <span v-else-if="item.type === 'rsy'">{{item.from_name}}持有股份超过20%的公司</span>
                  <span v-else-if="item.type === 'rsy_gd'">{{item.from_name}}的{{item.from_company}}公司的股东</span>
                  <span v-else-if="item.type === 'rsy_dwtz'">人所有公司下{{item.from_company}}对外投资超过20%的公司</span>
                  <span v-else-if="item.type === 'weak_rsy_dwtz'">人所有公司下{{item.from_company}}对外投资的公司</span>
                  <span v-else>N/A</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="股权结构图" name="股权结构图">
          <sunburstChart v-if="gqId !== ''" :id="gqId" :option="gqOption"></sunburstChart>
        </el-tab-pane>
        <el-tab-pane label="股权关系图" name="股权关系图">
            <graphChart v-if="relationId !== ''" :id="relationId" :option="relationOption"></graphChart>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import sunburstChart from '../../components/sunburstChart'
import sunburstChartOption from '../../assets/js/sunburstChartOption'
import graphChart from '../../components/graphChart'
import graphChartOption from '../../assets/js/graphChartOption'

export default {
  components: {
    sunburstChart,
    graphChart
  },
  name: "dealerPublicList",
  data() {
    return {
      gqId: '',
      gqOption: '',
      relationId: '',
      relationOption: '',
      publicId: '',
      activeName: '基本信息',
      report: {
        company_name: '',
        report: {
          company_info: {},
          bg_info: [],
          kt_info: [],
          fl_info: [],
          fy_info: [],
          bzx_info: [],
          sx_info: [],
          relation: [],
        }
      },
    }
  },
  mounted() {
    var that = this;
    that.publicId = this.$route.query.id;
    that.getPublicReport();
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getPublicReport: function (){
      var that = this;
      that.axios.post('/ald/dealer/public_report', {'publicId': that.publicId}).then(res=>{
        if (res.data.code=='ok'){
          that.report = res.data.data
          // 处理股权结构图
          if (that.report.report.relation){
            that.gqId = 'gqPie'
            that.gqOption = sunburstChartOption.getGqOption(that.report.report.relation.company_relation_data)
            that.relationId = 'relation'
            that.relationOption = graphChartOption.getRelationOption(that.report.report.relation.point_data,
              that.report.report.relation.line_data)
          }
        }
      }).catch(res=>{
      })
    },
    handleClick(tab, event) {
    }
  },
}
</script>

<style scoped>

</style>
