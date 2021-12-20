<template>
  <div>
    <el-form :model="infoForm" status-icon :rules="rules" ref="infoForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="经销商名称" prop="companyName" style="width: 50%">
        <span>{{infoForm.companyName}}</span>
      </el-form-item>
      <el-form-item label="经销商类型" prop="companyType" style="width: 50%">
        <span>{{infoForm.companyType}}</span>
      </el-form-item>
      <el-form-item label="合作起始时间" prop="coopDate" style="width: 50%">
        <span>{{infoForm.coopDate}}</span>
      </el-form-item>
      <el-form-item label="销售代表" prop="salePerson" style="width: 50%">
        <span>{{infoForm.salePerson}}</span>
      </el-form-item>
      <el-form-item label="销售金额" prop="saleMoney" style="width: 50%">
        <span>{{infoForm.saleMoney}}</span>
      </el-form-item>
      <el-form-item label="经销商分类" prop="limitType" style="width: 50%">
        <span>新客户申请</span>
      </el-form-item>
      <el-form-item label="额度有效期" prop="" style="width: 50%">
        <span>一年期</span>
      </el-form-item>
      <el-form-item label="特批额度" prop="specialMoney" style="width: 50%">
        <el-input v-model="infoForm.specialMoney"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="addBtn" @click="addSpecialMoney('infoForm')">启用特殊审批</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "specialApply",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写销售金额'));
      } else {
        if (this.infoForm.specialMoney !== '') {
          try {
            var res = parseFloat(this.infoForm.specialMoney)
            if (isNaN(res)){
              callback(new Error('请填写正确的特批金额'));
            }
            callback();
          }
          catch(err){
            callback(new Error('请填写正确的特批金额'));
          }
        }
      }
    };
    return {
      addBtn: false,
      infoForm: {
        companyName: '',
        companyType: '',
        coopDate: null,
        salePerson: '',
        saleMoney: '',
        limitType: '',
        specialMoney: '',
        dealerId: null
      },
      change: false,
      rules: {
        specialMoney: [
          { required: true, validator: validatePass,},
        ],
      }
    };
  },
  mounted() {
    var that = this;
    that.infoForm.dealerId = this.$route.query.dealerId;
    // 查询经销商信息进行修改
    that.axios.post('/ald/dealer/dealer_info', {'dealerId': that.infoForm.dealerId}).then(res=>{
      that.addBtn = false;
      if (res.data.code=='ok'){
        that.infoForm.companyName = res.data.data.company_name;
        that.infoForm.companyType = res.data.data.company_type;
        that.infoForm.coopDate = res.data.data.coop_date;
        that.infoForm.salePerson = res.data.data.sale_person;
        that.infoForm.saleMoney = res.data.data.sale_money;
        that.infoForm.limitType = '0';
      } else {
        this.$message({
          message: res.data.msg + ':' + res.data.data,
          type: 'warning'
        });
      }
    }).catch(res=>{
    })
  },
  methods: {
    addSpecialMoney(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this;
          that.addBtn = true;
          that.axios.post('/ald/dealer/special_apply', {'infoForm': that.infoForm}).then(res=>{
            that.addBtn = false;
            if (res.data.code=='ok'){
              that.$router.push('/admin/dealer/applyList')
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

</style>
