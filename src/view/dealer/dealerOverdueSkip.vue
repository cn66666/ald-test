<template>
  <div>
    <el-page-header @back="goBack" content="客户信息" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-form>
      <el-form-item label="发票逾期校验" label-width="200px">
        <el-select v-model="setting.isSkip" placeholder="请选择" style="float: left">
          <el-option label="不跳过" value='0'></el-option>
          <el-option label="跳过" value='1'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最长逾期天数" label-width="200px">
        <el-input v-model="setting.maxDay" type="number" min="0"  style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="小额逾期豁免" label-width="200px">
        <el-select v-model="setting.isClose" placeholder="请选择" style="float: left">
          <el-option label="关闭" value='0'></el-option>
          <el-option label="开启" value='1'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="逾期金额下限" label-width="200px">
        <el-input v-model="setting.minMoney" type="number" min="1"  style="width: 30%"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="逾期金额门槛比例" label-width="200px">
        <el-input v-model="setting.minMoneyRate" type="number" min="0" max="100" style="width: 30%"><template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="200px">
        <el-input v-model="setting.remark"  style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label-width="200px">
        <el-button type="primary" size="mini" @click="defaultSetting()">默认配置</el-button>
        <el-button type="primary" size="mini" @click="saveSetting()">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import {Message} from "element-ui";

export default {
  name: "dealerOverdueSkip",
  data() {
    return {
      dealerId: null,
      setting: {
        isSkip: '0',
        maxDay: 30,
        isClose: '0',
        minMoney: 100000,
        minMoneyRate: 5,
        remark: ''
      },
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getSetting();
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    defaultSetting: function (){
      var that = this;
      that.setting = {
        isSkip: '0',
        maxDay: 30,
        isClose: '0',
        minMoney: 100000,
        minMoneyRate: 5,
        remark: ''
      }
    },
    getSetting: function (){
      var that = this;
      that.axios.post('/ald/dealer/get_overdue_setting', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code==='ok'){
          var settings = res.data.data
          if (settings['isSkip'] === false){
            settings['isSkip'] = '0'
          } else {
            settings['isSkip'] = '1'
          }
          if (settings['isClose'] === false){
            settings['isClose'] = '0'
          } else {
            settings['isClose'] = '1'
          }
          that.setting = settings
          that.setting.remark = ''
        }else {
          that.setting = {
            isSkip: '0',
            maxDay: 30,
            isClose: '0',
            minMoney: 100000,
            minMoneyRate: 5,
            remark: ''
          }
        }
      }).catch(res=>{
      })
    },
    saveSetting: function (){
      var that = this;
      var settings = {
        isSkip: that.setting.isSkip,
        maxDay: that.setting.maxDay,
        isClose: that.setting.isSkip,
        minMoney: that.setting.minMoney,
        minMoneyRate: that.setting.minMoneyRate,
        remark: that.setting.remark
      }
      if (that.setting.isSkip === '0'){
        settings.isSkip = false
      } else {
        settings.isSkip = true
      }
      if (that.setting.isClose === '0'){
        settings.isClose = false
      } else {
        settings.isClose = true
      }
      console.log(settings)
      that.axios.post('/ald/dealer/save_overdue_setting', {'dealerId': that.dealerId,
        'setting': settings}).then(res=>{
        if (res.data.code==='ok'){
          Message.success('成功: 申请审批中')
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },
  }
}
</script>

<style scoped>

</style>
