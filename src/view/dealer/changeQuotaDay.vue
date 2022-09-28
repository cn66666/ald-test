<template>
  <div>
    <el-page-header @back="goBack" content="客户账期调整" style="margin: 1%"></el-page-header>
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
        <el-input v-model="quotaDayInfo.reckonDay" type="number" min="1"  style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="试算额度结果" label-width="200px">
        <el-input v-model="quotaDayInfo.reckonQuota" :disabled="change" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="200px">
        <el-input v-model="quotaDayInfo.info"  style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label-width="200px">
        <el-button type="primary" size="mini" @click="reckonQuotaDay()">额度试算</el-button>
        <push-function-btn btn-name="账期调整额度" btn-type="reload" size="mini"
                           check-btn="changeQuotaDayMoney" check-role="quotaList" url="/ald/dealer/change_quota_day"
                           params-key='dealerId' :params-value='dealerId' back></push-function-btn>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PushFunctionBtn from "../../components/pushFunctionBtn";
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
        reckonDay: 0,
        reckonQuota: '-',
        info: ''
      },
      change: true,
      reckon: false
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
          that.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
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
          }else {
            that.$message({
              message: res.data.msg + ':' + res.data.data,
              type: 'warning'
            });
          }
        }).catch(res=>{
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
