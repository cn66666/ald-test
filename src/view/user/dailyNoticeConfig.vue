<template>
  <div>
    <el-page-header @back="goBack" content="日报配置详情" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <div style="margin: 1% 3%; height: 50px; width: 90%">
      <div>
        <span style="line-height: 40px">日报提醒时间为每日8:30</span>
        <el-button style="width: 100px; margin-left: 40px" type="primary" size="mini" @click="defaultConfig()">改为默认配置</el-button>
      </div>
    </div>
    <div style="margin: 1% 3%;  width: 90%">
      <div style="min-height: 30px">
        <h4 style="float: left">业务负责人日报配置</h4>
      </div>
      <el-table
        :data="businessDaily"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="序号" width="70">
        </el-table-column>
        <el-table-column
          prop="title"
          label="通知内容" width="150">
        </el-table-column>
        <el-table-column
          prop="content"
          label="通知描述" width="400">
        </el-table-column>
        <el-table-column
          prop="type"
          label="通知方式" width="100">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.open"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="openConfig(scope.row.id, 'businessDaily', scope.row.name)">
            </el-switch>
            <el-button v-if="scope.row.config === true" style="width: 100px; margin-left: 30px" type="primary" size="mini"
                       @click="configChoose('businessDaily', scope.row.name)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 1% 3%;  width: 90%">
      <div style="min-height: 30px">
        <h4 style="float: left">跟单负责人日报配置</h4>
      </div>
      <el-table
        :data="orderDaily"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="序号" width="70">
        </el-table-column>
        <el-table-column
          prop="title"
          label="通知内容" width="150">
        </el-table-column>
        <el-table-column
          prop="content"
          label="通知描述" width="400">
        </el-table-column>
        <el-table-column
          prop="type"
          label="通知方式" width="100">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.open"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="openConfig(scope.row.id, 'orderDaily', scope.row.name)">
            </el-switch>
            <el-button v-if="scope.row.config === true" style="width: 100px; margin-left: 30px" type="primary" size="mini" @click="configChoose('orderDaily', scope.row.name)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 1% 3%;  width: 90%">
      <div style="min-height: 30px">
        <h4 style="float: left">财务负责人日报配置</h4>
      </div>
      <el-table
        :data="financeDaily"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="序号" width="70">
        </el-table-column>
        <el-table-column
          prop="title"
          label="通知内容" width="150">
        </el-table-column>
        <el-table-column
          prop="content"
          label="通知描述" width="400">
        </el-table-column>
        <el-table-column
          prop="type"
          label="通知方式" width="100">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.open"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="openConfig(scope.row.id, 'financeDaily', scope.row.name)">
            </el-switch>
            <el-button v-if="scope.row.config === true" style="width: 100px; margin-left: 30px" type="primary" size="mini" @click="configChoose('financeDaily', scope.row.name)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="发票日报日期设置" :visible.sync="businessInvoiceDailyShow" style="width: 100%">
      <el-form>
        <el-form-item label="发票到期小于该日期进行提醒" >
          <el-input v-model="configData.businessDaily.config.invoice"
                    @change="updateConfig('businessDaily', 'config', 'invoice', configData.businessDaily.config.invoice)"
                    style="width: 20%" type="number" min="1">
            <template slot="append">天</template></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="发票日报日期设置" :visible.sync="orderInvoiceDailyShow" style="width: 100%">
      <el-form>
        <el-form-item label="发票到期小于该日期进行提醒" >
          <el-input v-model="configData.orderDaily.config.invoice"
                    @change="updateConfig('orderDaily', 'config', 'invoice', configData.orderDaily.config.invoice)"
                    style="width: 20%" type="number" min="1">
            <template slot="append">天</template></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="额度到期日报设置" :visible.sync="financeQuotaDailyShow" style="width: 100%">
      <el-form>
        <el-form-item label="额度失效小于该日期时进行提醒" >
          <el-input v-model="configData.financeDaily.config.quota"
                    @change="updateConfig('financeDaily', 'config', 'quota', configData.financeDaily.config.quota)"
                    style="width: 20%" type="number" min="1">
            <template slot="append">天</template></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="特批额度到期日报设置" :visible.sync="financeSpecialDailyShow" style="width: 100%">
      <el-form>
        <el-form-item label="特批额度失效小于该日期时进行提醒" >
          <el-input v-model="configData.financeDaily.config.specialQuota"
                    @change="updateConfig('financeDaily', 'config', 'specialQuota', configData.financeDaily.config.specialQuota)"
                    style="width: 20%" type="number" min="1">
            <template slot="append">天</template></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "dailyNoticeConfig",
  data() {
    return {
      dealer_id: '',
      configData: {
        'businessDaily': {
          'open': {
            'invoice': true,
            'quota': true,
            'overdueCount': true,
            'overdueMonth': true,
          },
          'config':{
            'invoice': 7,
          }
        },
        'orderDaily': {
          'open': {
            'invoice': true,
            'quota': true,
            'overdueCount': true,
            'overdueMonth': true,
          },
          'config':{
            'invoice': 7,
          }
        },
        'financeDaily': {
          'open': {
            'quota': true,
          },
          'config':{
            'quota': 7,
          }
        },
      },
      businessDaily: [
        {
          'id': 1,
          'name': 'invoice',
          'title': '发票日报',
          'content': '发票到期日小于0天,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': true,
        },
        {
          'id': 2,
          'name': 'quota',
          'title': '额度日报',
          'content': '额度在日报发送时的剩余额度及有效期,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 3,
          'name': 'overdueCount',
          'title': '逾期天数日报',
          'content': '发票在日报发送时的逾期总数,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 4,
          'name': 'overdueMonth',
          'title': '月度逾期统计日报',
          'content': '客户以当前开票逾期情况进行月度统计,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
      ],
      orderDaily: [
        {
          'id': 1,
          'name': 'invoice',
          'title': '发票日报',
          'content': '发票到期日小于0天,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': true,
        },
        {
          'id': 2,
          'name': 'quota',
          'title': '额度日报',
          'content': '额度在日报发送时的剩余额度及有效期,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 3,
          'name': 'overdueCount',
          'title': '逾期天数日报',
          'content': '发票在日报发送时的逾期总数,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
        {
          'id': 4,
          'name': 'overdueMonth',
          'title': '月度逾期统计日报',
          'content': '客户以当前开票逾期情况进行月度统计,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': false
        },
      ],
      financeDaily: [
        {
          'id': 1,
          'name': 'quota',
          'title': '额度到期日报',
          'content': '额度有效期小于0天,进行日报通知',
          'type': '钉钉',
          'open': true,
          'config': true,
        },
      ],

      businessInvoiceDailyShow: false,
      businessSpecialDailyShow: false,

      orderInvoiceDailyShow: false,
      orderSpecialDailyShow: false,

      financeQuotaDailyShow: false,
      financeSpecialDailyShow: false,
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getNoticeDealerConfig()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getNoticeDealerConfig: function () {
      var that = this;
      that.axios.post('/ald/notice/notice_dealer_config', {'dealerId': that.dealerId}).then(res=>{
        if (res.data.code==='ok'){
          that.configData = res.data.data;
          for (var data in that.businessDaily){
            that.businessDaily[data]['open'] = that.configData['businessDaily']['open'][that.businessDaily[data]['name']]
            if (that.businessDaily[data]['config'] === true){
              var day = that.configData['businessDaily']['config'][that.businessDaily[data]['name']]
              that.businessDaily[data]['content'] = that.businessDaily[data]['content'].replace(/0/, day)
            }
          }
          for (var data in that.orderDaily){
            that.orderDaily[data]['open'] = that.configData['orderDaily']['open'][that.orderDaily[data]['name']]
            if (that.orderDaily[data]['config'] === true){
              var day = that.configData['orderDaily']['config'][that.orderDaily[data]['name']]
              that.orderDaily[data]['content'] = that.orderDaily[data]['content'].replace(/0/, day)
            }
          }
          for (var data in that.financeDaily){
            that.financeDaily[data]['open'] = that.configData['financeDaily']['open'][that.financeDaily[data]['name']]
            if (that.financeDaily[data]['config'] === true){
              var day = that.configData['financeDaily']['config'][that.financeDaily[data]['name']]
              that.financeDaily[data]['content'] = that.financeDaily[data]['content'].replace(/0/, day)
            }
          }
        }
      }).catch(res=>{
      })
    },
    openConfig: function (id, type, name) {
      var that = this;
      if (that.configData[type]['open'][name] === true){
        that.configData[type]['open'][name] = false
        if (type === 'businessDaily'){
          that.businessDaily[id - 1]['open'] = false
        }
        if (type === 'orderDaily'){
          that.orderDaily[id - 1]['open'] = false
        }
        if (type === 'financeDaily'){
          that.financeDaily[id - 1]['open'] = false
        }
        that.updateConfig(type, 'open', name, false)
      } else {
        that.configData[type]['open'][name] = true
        if (type === 'businessDaily'){
          that.businessDaily[id - 1]['open'] = true
        }
        if (type === 'orderDaily'){
          that.orderDaily[id - 1]['open'] = true
        }
        if (type === 'financeDaily'){
          that.financeDaily[id - 1]['open'] = true
        }
        that.updateConfig(type, 'open', name, true)
      }
    },
    configChoose: function (type, name) {
      var that = this;
      if (type === 'businessDaily'){
        if (name === 'invoice'){
          that.businessInvoiceDailyShow = true
        }
        else if (name === 'specialQuota'){
          that.businessSpecialDailyShow = true
        }
      }else if (type === 'orderDaily'){
        if (name === 'invoice'){
          that.orderInvoiceDailyShow = true
        }
        else if (name === 'specialQuota'){
          that.orderSpecialDailyShow = true
        }
      }else if (type === 'financeDaily'){
        if (name === 'quota'){
          that.financeQuotaDailyShow = true
        }
        else if (name === 'specialQuota'){
          that.financeSpecialDailyShow = true
        }
      }
    },
    updateConfig: function (configClass, configForm, configType, configData) {
      var that = this;
      that.axios.post('/ald/notice/update_dealer_config', {'dealerId': that.dealerId, 'configClass': configClass,
        'configForm': configForm, 'configType': configType, 'configData': configData,}).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 修改成功')
        } else {
          Message.warning('失败: 修改失败')
        }
      }).catch(res=>{
      })
    },
    defaultConfig: function () {
      var that = this;
      that.axios.post('/ald/notice/default_dealer_config', {'dealerId': that.dealerId}).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 修改成功')
        } else {
          Message.warning('失败: 修改失败')
        }
      }).catch(res=>{
      })
    },
  },
}
</script>

<style scoped>

</style>
