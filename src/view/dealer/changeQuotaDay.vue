<template>
  <div>
    <el-page-header @back="goBack" content="客户账期调整" style="padding-left: 15px; padding-top: 15px"></el-page-header>
    <el-form>
      <el-form-item label="ERP账期" label-width="200px">
        <el-input v-model="quotaDayInfo.erpDay" :disabled="change" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="ALD推荐账期" label-width="200px">
        <el-input v-model="quotaDayInfo.aldDay" :disabled="change" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="客户当前额度" label-width="200px">
        <el-input v-model="quotaDayInfo.quota" :disabled="change" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="调整账期" label-width="200px">
        <el-input v-model="quotaDayInfo.reckonDay" type="number" min="1"  style="width: 50%">
          <template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item label="试算额度结果" label-width="200px">
        <el-input v-model="quotaDayInfo.reckonQuota" :disabled="change" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="200px">
        <el-input v-model="quotaDayInfo.remark"  style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label-width="200px">
        <el-button type="primary" size="mini" @click="reckonQuotaDay()">额度试算</el-button>
        <el-button type="primary" size="mini" @click="changeQuotaDay()">确认提交申请</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
import {Message} from "element-ui";
export default {
  name: "changeQuotaDay",
  components: {PushFunctionBtn},
  data() {
    return {
      dealerId: '',
      quotaDayInfo: {
        erpDay: '-',
        aldDay: '-',
        quota: '-',
        reckonDay: 1,
        reckonQuota: '-',
        remark: ''
      },
      change: true,
      reckon: false,
      update: false
    }
  },
  mounted() {
    var that = this;
    that.dealerId = this.$route.query.dealerId;
    that.getQuotaDay()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getQuotaDay: function (){
      var that = this;
      that.axios.post('/ald/dealer/get_quota_day', {'dealerId': that.dealerId,}).then(res=>{
        if (res.data.code==='ok'){
          that.quotaDayInfo.erpDay = res.data.data.erp_day
          that.quotaDayInfo.aldDay = res.data.data.ald_day
          that.quotaDayInfo.quota = res.data.data.quota
          that.reckon = true
        }else {
          Message.warning('失败: ' + res.data.data)
        }
      }).catch(res=>{
      })
    },
    reckonQuotaDay: function (){
      var that = this;
      if (that.reckon === true){
        that.axios.post('/ald/dealer/reckon_quota_day', {'dealerId': that.dealerId, 'reckonDay': that.quotaDayInfo.reckonDay}).then(res=>{
          if (res.data.code==='ok'){
            that.quotaDayInfo.reckonQuota = res.data.data
            that.update = true
          }else {
            Message.warning('失败: ' + res.data.data)
          }
        }).catch(res=>{
        })
      }
    },
    changeQuotaDay: function () {
      var that = this;
      if (that.update === true){
        that.axios.post('/ald/dealer/change_quota_day', {'dealerId': that.dealerId, 'reckonDay': that.quotaDayInfo.reckonDay,
          'remark': that.quotaDayInfo.remark}).then(res=>{
          if (res.data.code==='ok'){
            Message.success('成功: 申请审批中')
            that.update = false
          }else {
            Message.warning('失败: ' + res.data.data)
          }
        }).catch(res=>{
        })
      } else {
        Message.warning('失败: 请先进行试算')
      }

    }
  }
}
</script>

<style scoped>

</style>
