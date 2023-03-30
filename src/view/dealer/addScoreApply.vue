<template>
  <div>
    <el-page-header @back="goBack" :content="companyName" style="padding-left: 15px; padding-top: 15px">
    </el-page-header>
    <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="130px" class="demo-ruleForm" style="margin-top: 20px">
      <el-form-item label="去年业务规划" prop="oldSaleMoney" style="width: 50%">
        <el-input v-model="addForm.oldSaleMoney">
          <template slot="append">万元</template></el-input>
      </el-form-item>
      <el-form-item label="今年业务规划" prop="saleMoney" style="width: 50%">
        <el-input v-model="addForm.saleMoney">
          <template slot="append">万元</template></el-input>
      </el-form-item>
      <el-form-item label="结算时长" prop="endDay" style="width: 50%">
        <el-input v-model="addForm.endDay" :disabled="change">
          <template slot="append">天</template></el-input>
      </el-form-item>
      <el-form-item label="最新保险数据" prop="endDay" style="width: 50%">
        <div v-show="showExport" style="float: left; margin-left: 10px">
          <el-button type="text" @click="showInsureForm=true">维护最新保险数据</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="addScore('addForm')">提交</el-button>
        <p style="margin-top: 10px"><el-tag v-if="errorShow" type="warning">该客户为出口客户,但是未在系统中查询到上传的该客户相关出口保险信息.可在
          <el-link href="/#/admin/dealer/exportInfoList" target="_blank" type="primary">出口信息列表</el-link>中查询.
          </el-tag></p>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="showInsureForm">
      <div slot="title" class="dialog-title">
        <span>最新保险数据维护</span>
        <el-popover
          placement="top-start"
          offset="10"
          width="300"
          trigger="hover"
          content="中信保/人保数据来源为中信保或人保官网，出口客户必须填写相关中信保/人保的数据，否则不可进行额度申请">
          <i slot="reference" style="margin: 0 5px 0 5px" class="el-icon-question"></i>
        </el-popover>
      </div>
      <el-form :model="addForm.exportInfo" :rules="rules" ref="addForm">
        <el-form-item label="批复金额" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.insureQuota" :disabled="change" style="width: 250px">
          </el-input>
        </el-form-item>
        <el-form-item label="成立时长" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.createYear" type="number" min="0" style="width: 250px">
            <template slot="append">年</template>
          </el-input>
        </el-form-item>
        <el-form-item label="国家/地区" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.country" placeholder="请选择国家/地区" style="width: 250px">
            <el-option v-for="country in countryList" :label="country.country" :value="country.country_code" :key="country.country_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.payType" placeholder="请选择支付方式" style="width: 250px">
            <el-option v-for="pay in payList" :label="pay" :value="pay" :key="pay"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用期限" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.creditDay" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="拒收风险赔付比例" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.riskRate" style="width: 250px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="其他商业风险(包含政治风险)赔付比例" :label-width="formLabelWidth">
          <el-input v-model="addForm.exportInfo.otherRiskRate" style="width: 250px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否存在理赔记录" :label-width="formLabelWidth">
          <el-select v-model="addForm.exportInfo.payLog" placeholder="请选择是否存在理赔记录" style="width: 250px">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="showInsureForm=false" type="primary" size="mini">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addScoreApply",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写正确内容'));
      } else {
        try {
          var res = parseFloat(value)
          if (isNaN(res)){
            callback(new Error('请填写正确内容'));
          }
          callback();
        }
        catch(err){
          callback(new Error('请填写正确内容'));
        }
      }
    };
    return {
      addBtn: false,
      change: true,
      showInsureForm: false,
      showExport: false,
      addForm: {
        applyType: '',
        saleMoney: 0,
        endDay: 0,
        oldSaleMoney: 0,
        exportInfo: {
          createYear: 0,
          country: '',
          payType: '',
          creditDay: 0,
          riskRate: 0,
          otherRiskRate: 0,
          payLog: '',
          insureQuota: 0,
        }
      },
      countryList: [],
      payList: ['LC', 'DP', 'DA', 'OA'],
      formLabelWidth: '300px',
      errorShow: false,
      errorInfo: '',
      companyName: '',
      rules: {
        saleMoney: [
          {required: true, validator: validatePass,},
        ],
        oldSaleMoney: [
          {required: true, validator: validatePass,},
        ],
        endDay: [
          {required: true, validator: validatePass,},
        ],
      }
    };
  },
  mounted() {
    var that = this;
    that.dealer_id = that.$route.query.dealerId;
    if (that.dealer_id){
      // 查询评分卡申请信息进行修改
      that.axios.post('/ald/dealer/score_apply_info', {'dealerId': that.dealer_id}).then(res=>{
        that.addBtn = false;
        if (res.data.code==='ok'){
          that.addForm.applyType = res.data.data.quota_type;
          that.addForm.endDay = res.data.data.end_day;
          that.companyName = res.data.data.company_name + '的补充评分卡信息';
          if (res.data.data.is_export === true){
            that.countryList = res.data.data.countryList
            that.showExport = true;
            if (res.data.data.export_info){
              if (res.data.data.export_info.create_year){
                that.addForm.exportInfo.createYear = res.data.data.export_info.create_year;
              }
              if (res.data.data.export_info.pay_log){
                that.addForm.exportInfo.payLog = res.data.data.export_info.pay_log;
              }
              that.addForm.exportInfo.country = res.data.data.export_info.country;
              that.addForm.exportInfo.payType = res.data.data.export_info.pay_type;
              that.addForm.exportInfo.creditDay = res.data.data.export_info.credit_day;
              that.addForm.exportInfo.riskRate = res.data.data.export_info.risk_rate;
              that.addForm.exportInfo.otherRiskRate = res.data.data.export_info.other_risk_rate;
              that.addForm.exportInfo.insureQuota = res.data.data.export_info.insure_quota;
            }
          }
          if (res.data.data.is_error === true){
            that.errorShow = true;
          }
        } else {
          this.$message({
            message: res.data.msg + ':' + res.data.data,
            type: 'warning'
          });
        }
      }).catch(res=>{
      })
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    addScore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/dealer/add_score_apply', {'addForm': that.addForm, 'dealerId': that.dealer_id}).then(res=>{
            that.addBtn = false;
            if (res.data.code === 'ok'){
              that.$router.push('/admin/dealer/scoreList')
            } else {
              that.addBtn = false;
              this.$message({
                message: res.data.msg + ':' + res.data.data,
                type: 'warning'
              });
            }
          }).catch(res=>{
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.el-table >>> tbody tr:hover > td{
  background-color: rgba(255,255,255, 1)!important;
  color: #000;
}
</style>
